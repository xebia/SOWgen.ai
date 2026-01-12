# Quick Start Guide: MongoDB Backend

This is a quick guide to get the MongoDB backend running in 5 minutes.

## Prerequisites
- Python 3.9+
- MongoDB (local or Atlas account)

## Quick Setup

### 1. Start MongoDB (Choose One)

**Option A: Use MongoDB Atlas (Recommended)**
- Go to https://www.mongodb.com/cloud/atlas
- Create free account and cluster
- Get connection string (replace `<password>`)

**Option B: Local MongoDB**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 2. Configure Backend

```bash
cd backend

# Create .env file
cat > .env << EOF
MONGODB_URL=mongodb://localhost:27017
# OR for Atlas: mongodb+srv://user:pass@cluster.mongodb.net/
MONGODB_DB_NAME=sowgen_db
SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_urlsafe(32))')
ALLOWED_ORIGINS=http://localhost:5000,https://xebia.github.io
EOF
```

### 3. Install Dependencies

```bash
pip3 install -r requirements.txt
```

### 4. Run Backend

```bash
python3 main.py
```

Backend will be running at: http://localhost:8000

### 5. Test Backend

Open http://localhost:8000/docs in your browser to see the interactive API documentation.

Default demo users are created automatically:
- `client@example.com` / `demo123`
- `admin@xebia.com` / `demo123`
- `approver@xebia.com` / `demo123`

### 6. Configure Frontend

```bash
# In the root directory, create .env.local
cd ..
cat > .env.local << EOF
VITE_API_URL=http://localhost:8000
VITE_USE_BACKEND=true
EOF
```

### 7. Run Frontend

```bash
npm run dev
```

Frontend will be running at: http://localhost:5000

## Testing

1. Open http://localhost:5000
2. Login with `client@example.com` / `demo123`
3. Create a SOW
4. Refresh page - data should persist!

## Troubleshooting

**MongoDB Connection Error**
- Check MongoDB is running: `mongosh` (should connect)
- Verify MONGODB_URL in .env

**CORS Error**
- Verify ALLOWED_ORIGINS includes your frontend URL
- Check backend logs for CORS errors

**Login Failed**
- Check backend logs: `python3 main.py`
- Verify demo users created (check backend startup logs)

## Next Steps

- Read [MONGODB_BACKEND_GUIDE.md](../MONGODB_BACKEND_GUIDE.md) for production deployment
- Deploy backend to Heroku/Railway/DigitalOcean
- Configure GitHub Actions for production deployment

## Support

- Backend API Docs: http://localhost:8000/docs
- Backend README: [backend/README.md](README.md)
- Full Integration Guide: [MONGODB_BACKEND_GUIDE.md](../MONGODB_BACKEND_GUIDE.md)
