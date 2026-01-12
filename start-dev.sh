#!/bin/bash

# SOWgen.ai Local Development Startup Script
# This script helps you quickly start the backend and frontend for local development

set -e

echo "🚀 SOWgen.ai Local Development Setup"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend/.env exists
if [ ! -f backend/.env ]; then
    echo -e "${YELLOW}⚠️  Backend .env file not found. Creating with defaults...${NC}"
    cat > backend/.env << EOF
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=sowgen_db
API_HOST=0.0.0.0
API_PORT=8000
SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_urlsafe(32))')
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=http://localhost:5000,https://xebia.github.io
EOF
    echo -e "${GREEN}✅ Created backend/.env${NC}"
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  Frontend .env.local not found. Creating...${NC}"
    cat > .env.local << EOF
VITE_API_URL=http://localhost:8000
VITE_USE_BACKEND=true
EOF
    echo -e "${GREEN}✅ Created .env.local${NC}"
fi

echo ""
echo "📋 Checking prerequisites..."
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Python 3 found:${NC} $(python3 --version)"

# Check MongoDB
if ! command -v mongod &> /dev/null && ! command -v mongosh &> /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB not found locally${NC}"
    echo "   You can either:"
    echo "   1. Install MongoDB locally"
    echo "   2. Use MongoDB Atlas (cloud)"
    echo "   3. Use Docker: docker-compose up -d"
    echo ""
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✅ MongoDB found${NC}"
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js found:${NC} $(node --version)"

# Check if backend dependencies are installed
echo ""
echo "📦 Installing dependencies..."
echo ""

if [ ! -d "backend/venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv backend/venv
fi

echo "Installing Python dependencies..."
backend/venv/bin/pip install -q -r backend/requirements.txt
echo -e "${GREEN}✅ Backend dependencies installed${NC}"

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
fi

echo ""
echo "🎬 Starting services..."
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit
}

trap cleanup EXIT INT TERM

# Start backend
echo "Starting backend on http://localhost:8000..."
cd backend
../backend/venv/bin/python main.py > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Check if backend started successfully
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
    echo "   API Docs: http://localhost:8000/docs"
else
    echo -e "${RED}❌ Backend failed to start. Check backend.log${NC}"
    exit 1
fi

# Start frontend
echo ""
echo "Starting frontend on http://localhost:5000..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait a bit for frontend to start
sleep 3

# Check if frontend started successfully
if kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
else
    echo -e "${RED}❌ Frontend failed to start. Check frontend.log${NC}"
    exit 1
fi

echo ""
echo "======================================"
echo -e "${GREEN}✅ All services are running!${NC}"
echo "======================================"
echo ""
echo "📱 Access the application:"
echo "   Frontend:  http://localhost:5000"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/docs"
echo ""
echo "👤 Demo login credentials:"
echo "   Email:    client@example.com"
echo "   Password: demo123"
echo ""
echo "📝 Logs:"
echo "   Backend:  backend.log"
echo "   Frontend: frontend.log"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Keep script running
wait
