# Getting Started with MongoDB Backend

This guide will help you get the MongoDB backend running for SOWgen.ai in just a few steps.

## 🎯 What You'll Get

- **Persistent Data**: Data stored in MongoDB survives page reloads
- **Multi-device Access**: Access your data from any device
- **Shared Database**: All users work with the same data
- **Production Ready**: Deploy to GitHub Pages with backend API

## 🚀 Three Ways to Start

### Option 1: Quick Start with Docker (Recommended)

**Best for**: First-time users who want to try it quickly

```bash
# 1. Start everything (backend + MongoDB)
docker-compose up -d

# 2. Configure frontend
echo "VITE_API_URL=http://localhost:8000" > .env.local
echo "VITE_USE_BACKEND=true" >> .env.local

# 3. Start frontend
npm run dev

# 4. Open browser: http://localhost:5000
# Login: client@example.com / demo123
```

**That's it!** 🎉

[Full Docker Guide →](backend/DOCKER.md)

---

### Option 2: Local Development

**Best for**: Developers who want full control

```bash
# 1. Run the automated setup script
./start-dev.sh

# The script will:
# - Check prerequisites (Python, Node, MongoDB)
# - Install dependencies
# - Configure environment variables
# - Start backend and frontend
# - Show you where to access the app

# 2. Open browser: http://localhost:5000
# Login: client@example.com / demo123
```

[5-Minute Quick Start →](backend/QUICKSTART.md)

---

### Option 3: Manual Setup

**Best for**: Understanding each step

#### Step 1: Set up MongoDB

**Option A: MongoDB Atlas (Cloud - Free)**
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Copy to `backend/.env`: `MONGODB_URL=mongodb+srv://...`

**Option B: Local MongoDB**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo apt install mongodb
sudo systemctl start mongod

# Windows
Download from mongodb.com and install as service
```

#### Step 2: Configure Backend

```bash
cd backend

# Create environment file
cp .env.example .env

# Edit .env with your settings
# At minimum, set: MONGODB_URL and SECRET_KEY
```

#### Step 3: Install & Run Backend

```bash
# Install Python dependencies
pip3 install -r requirements.txt

# Run backend
python3 main.py
```

Backend will be running at http://localhost:8000

#### Step 4: Configure Frontend

```bash
# In root directory
echo "VITE_API_URL=http://localhost:8000" > .env.local
echo "VITE_USE_BACKEND=true" >> .env.local
```

#### Step 5: Run Frontend

```bash
npm run dev
```

Frontend will be running at http://localhost:5000

[Full Backend README →](backend/README.md)

---

## 🧪 Testing Your Setup

### 1. Check Backend Health

```bash
curl http://localhost:8000/health
```

Should return: `{"status":"healthy","database":"connected"}`

### 2. Test Login

1. Open http://localhost:5000
2. Login with: `client@example.com` / `demo123`
3. Create a SOW
4. **Refresh the page** - data should still be there! ✅

### 3. View API Documentation

Open http://localhost:8000/docs for interactive API documentation

---

## 📚 Documentation Guide

Depending on your use case, refer to:

| Document | Best For |
|----------|----------|
| [QUICKSTART.md](backend/QUICKSTART.md) | 5-minute setup guide |
| [README.md](backend/README.md) | Complete backend documentation |
| [DOCKER.md](backend/DOCKER.md) | Docker deployment |
| [MONGODB_BACKEND_GUIDE.md](MONGODB_BACKEND_GUIDE.md) | Production deployment |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | Technical overview |

---

## 🎓 Understanding the Architecture

```
┌─────────────────────┐
│  Your Browser       │
│  (GitHub Pages)     │
│  localhost:5000     │
└──────────┬──────────┘
           │ HTTP + JWT Token
           ▼
┌─────────────────────┐
│  FastAPI Backend    │
│  localhost:8000     │
│  • Authentication   │
│  • CRUD Operations  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  MongoDB            │
│  localhost:27017    │
│  • Persistent Data  │
└─────────────────────┘
```

### How It Works

1. **Frontend** (React) runs on GitHub Pages
2. **Backend** (Python/FastAPI) runs on your server
3. **Database** (MongoDB) stores the data
4. **Authentication** uses JWT tokens for security
5. **CORS** allows GitHub Pages to access your backend

---

## 🔑 Demo Users

Three users are created automatically:

| Email | Password | Role | Can Do |
|-------|----------|------|--------|
| client@example.com | demo123 | Client | Create and view own SOWs |
| admin@xebia.com | demo123 | Admin | View all SOWs, manage users |
| approver@xebia.com | demo123 | Approver | Review and approve SOWs |

---

## 🚢 Deploying to Production

### Backend Deployment Options

1. **Heroku**: One-click deploy
   ```bash
   heroku create sowgen-api
   git push heroku main
   ```

2. **Railway**: Simple deployment
   ```bash
   railway init
   railway up
   ```

3. **DigitalOcean**: VPS deployment
   - Create droplet
   - Install Python + MongoDB
   - Run backend

4. **Docker**: Any container platform
   ```bash
   docker build -t sowgen-backend .
   docker run -p 8000:8000 sowgen-backend
   ```

### Frontend Configuration for Production

Update `.github/workflows/deploy-github-pages.yml`:

```yaml
- name: Build with Vite
  env:
    GITHUB_PAGES: 'true'
    VITE_API_URL: 'https://your-backend-url.com'
    VITE_USE_BACKEND: 'true'
  run: npm run build
```

[Full Deployment Guide →](MONGODB_BACKEND_GUIDE.md)

---

## ❓ Troubleshooting

### Backend won't start

**Check Python version:**
```bash
python3 --version  # Need 3.9 or higher
```

**Check MongoDB connection:**
```bash
# Test connection
mongosh mongodb://localhost:27017
```

**View backend logs:**
```bash
# If using start-dev.sh
cat backend.log

# If using docker-compose
docker-compose logs backend
```

### Frontend can't connect to backend

**Check CORS settings:**

In `backend/.env`, ensure:
```
ALLOWED_ORIGINS=http://localhost:5000
```

**Verify API URL:**

In `.env.local`:
```
VITE_API_URL=http://localhost:8000
```

**Check backend is running:**
```bash
curl http://localhost:8000/health
```

### Data not persisting

**Verify backend mode is enabled:**

In `.env.local`:
```
VITE_USE_BACKEND=true
```

**Check browser console for errors:**

Open DevTools → Console → Look for API errors

**Verify MongoDB is running:**
```bash
docker-compose ps  # If using docker
# or
mongosh  # If using local MongoDB
```

### Authentication errors

**Check SECRET_KEY is set:**
```bash
# In backend/.env
SECRET_KEY=your-secret-key
```

**Clear browser storage:**
```javascript
// In browser console
localStorage.clear()
sessionStorage.clear()
```

**Try login again:**

Visit http://localhost:5000 and login with demo credentials

---

## 💡 Pro Tips

1. **Use Docker for development** - It's the easiest way to get started
2. **Check API docs** - http://localhost:8000/docs is interactive
3. **Monitor logs** - `docker-compose logs -f` shows real-time logs
4. **Use .env files** - Never commit secrets to git
5. **Test locally first** - Before deploying to production

---

## 🆘 Getting Help

1. **Check Documentation**
   - Start with this guide
   - Read [QUICKSTART.md](backend/QUICKSTART.md)
   - Check [backend/README.md](backend/README.md)

2. **Verify Setup**
   - Run `backend/test_backend.py`
   - Check http://localhost:8000/docs
   - Test with demo users

3. **Common Issues**
   - MongoDB not running
   - Port already in use (8000 or 5000)
   - CORS configuration
   - Environment variables not set

4. **Debug Tools**
   - Backend logs: `docker-compose logs backend`
   - Frontend logs: Browser console
   - API testing: http://localhost:8000/docs
   - Database: MongoDB Compass

---

## 🎉 Next Steps

Once you have it running locally:

1. ✅ Test all features (login, create SOW, etc.)
2. 📝 Read the [full integration guide](MONGODB_BACKEND_GUIDE.md)
3. 🚀 Deploy backend to your preferred platform
4. 🌐 Configure GitHub Actions for production
5. 🎊 Your data will persist on GitHub Pages!

---

**Need more help?** Check the comprehensive guides:
- [MongoDB Backend Integration Guide](MONGODB_BACKEND_GUIDE.md) - Complete setup
- [Backend README](backend/README.md) - API documentation
- [Docker Guide](backend/DOCKER.md) - Container deployment
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md) - Technical details

**Built with ❤️ for Xebia | Empowering Digital Excellence**
