# MongoDB Backend Integration Guide

This guide explains how to integrate the MongoDB backend with the SOWgen.ai frontend to enable persistent data storage on GitHub Pages.

## Architecture Overview

The SOWgen.ai application supports two modes of operation:

1. **Local Mode** (Default): Uses GitHub Spark KV store for in-browser persistence
2. **Backend Mode**: Uses MongoDB backend via REST API for server-side persistence

## Why MongoDB Backend?

When deploying to GitHub Pages, data stored in the browser (localStorage, IndexedDB) is:
- **Isolated per browser**: Data doesn't sync across devices
- **Volatile**: Cleared when browser cache is cleared
- **Not shared**: Other users can't see the data

With a MongoDB backend:
- **Persistent**: Data survives browser cache clears and page reloads
- **Shared**: All users access the same database
- **Cross-device**: Access your data from any device
- **Secure**: Role-based access control and authentication

## Prerequisites

1. **MongoDB Database**: Either local or cloud (MongoDB Atlas recommended)
2. **Backend Server**: A server to run the Python FastAPI backend
3. **Domain/URL**: Public URL for your backend API (for GitHub Pages to access)

## Setup Instructions

### Step 1: Set Up MongoDB

#### Option A: MongoDB Atlas (Recommended for Production)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with read/write permissions
4. Whitelist your backend server's IP address (or use 0.0.0.0/0 for testing)
5. Get your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/sowgen_db
   ```

#### Option B: Local MongoDB (For Development)

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```
3. Your connection string: `mongodb://localhost:27017`

### Step 2: Deploy the Backend

#### Option A: Deploy to Heroku

1. Install Heroku CLI
2. Create a new Heroku app:
   ```bash
   cd backend
   heroku create sowgen-api
   ```
3. Add MongoDB addon:
   ```bash
   heroku addons:create mongolab:sandbox
   ```
4. Set environment variables:
   ```bash
   heroku config:set SECRET_KEY=your-secret-key-here
   heroku config:set ALLOWED_ORIGINS=https://xebia.github.io
   ```
5. Deploy:
   ```bash
   git push heroku main
   ```
6. Your API URL: `https://sowgen-api.herokuapp.com`

#### Option B: Deploy to Railway

1. Install Railway CLI: `npm install -g @railway/cli`
2. Initialize project:
   ```bash
   cd backend
   railway init
   ```
3. Add MongoDB plugin in Railway dashboard
4. Set environment variables in Railway dashboard:
   - `SECRET_KEY`: Your secure secret key
   - `ALLOWED_ORIGINS`: `https://xebia.github.io`
5. Deploy:
   ```bash
   railway up
   ```
6. Your API URL will be provided by Railway

#### Option C: Deploy to DigitalOcean/AWS/Azure

1. Create a VPS/VM instance
2. Install Python 3.9+:
   ```bash
   sudo apt update
   sudo apt install python3 python3-pip
   ```
3. Clone the repository and install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
4. Set up environment variables in `.env`:
   ```env
   MONGODB_URL=mongodb+srv://...
   SECRET_KEY=your-secret-key
   ALLOWED_ORIGINS=https://xebia.github.io
   ```
5. Run with a process manager (e.g., systemd, PM2, or supervisord):
   ```bash
   # With systemd
   sudo systemctl start sowgen-api
   
   # Or with screen/tmux
   screen -S sowgen-api
   python main.py
   ```
6. Configure nginx as a reverse proxy (optional but recommended)

### Step 3: Configure the Frontend

1. **Update Environment Variables**

   Create/update `.env.production`:
   ```env
   VITE_API_URL=https://your-backend-url.com
   VITE_USE_BACKEND=true
   ```

2. **For Local Development**

   Create/update `.env.local`:
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_USE_BACKEND=true
   ```

3. **Update GitHub Actions Workflow**

   Edit `.github/workflows/deploy-github-pages.yml`:
   ```yaml
   - name: Build with Vite
     env:
       GITHUB_PAGES: 'true'
       VITE_API_URL: 'https://your-backend-url.com'
       VITE_USE_BACKEND: 'true'
     run: npm run build
   ```

### Step 4: Test the Integration

1. **Test Backend Locally**
   ```bash
   cd backend
   python main.py
   ```
   
   Visit http://localhost:8000/docs to see the API documentation.

2. **Test Frontend Locally**
   ```bash
   npm run dev
   ```
   
   The app should connect to your backend and fetch data from MongoDB.

3. **Test Authentication**
   - Login with demo credentials: `client@example.com` / `demo123`
   - Create a SOW and verify it's saved to MongoDB
   - Refresh the page - data should persist

### Step 5: Deploy to GitHub Pages

1. **Update the environment variables in GitHub Actions**
   
   Go to your repository → Settings → Secrets and variables → Actions
   
   Add a new secret:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-url.com`

2. **Modify the workflow to use the secret**
   
   Edit `.github/workflows/deploy-github-pages.yml`:
   ```yaml
   - name: Build with Vite
     env:
       GITHUB_PAGES: 'true'
       VITE_API_URL: ${{ secrets.VITE_API_URL }}
       VITE_USE_BACKEND: 'true'
     run: npm run build
   ```

3. **Push to main branch**
   ```bash
   git push origin main
   ```

4. **Verify deployment**
   - Go to https://xebia.github.io/SOWgen.ai/
   - Login and verify data persistence

## API Endpoints

The backend provides the following REST API endpoints:

### Authentication
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Users
- `POST /api/users` - Create user (admin only)
- `GET /api/users` - List all users (admin only)
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user (admin only)

### SOWs
- `POST /api/sows` - Create SOW
- `GET /api/sows` - List SOWs (filtered by user role)
- `GET /api/sows/{id}` - Get SOW by ID
- `PUT /api/sows/{id}` - Update SOW
- `DELETE /api/sows/{id}` - Delete SOW
- `POST /api/sows/{id}/comments` - Add approval comment

Full API documentation available at: `https://your-backend-url.com/docs`

## Security Considerations

1. **Use HTTPS**: Always use HTTPS for production deployments
2. **Secure MongoDB**: Enable authentication and use strong passwords
3. **Secret Key**: Use a strong, random secret key for JWT signing
4. **CORS**: Only allow your GitHub Pages domain in ALLOWED_ORIGINS
5. **Rate Limiting**: Consider adding rate limiting to prevent abuse
6. **Input Validation**: All input is validated by Pydantic models
7. **Token Expiration**: JWT tokens expire after 30 minutes by default

## Troubleshooting

### CORS Issues

If you see CORS errors in the browser console:
1. Verify `ALLOWED_ORIGINS` includes your GitHub Pages URL
2. Make sure the backend URL uses HTTPS
3. Check that CORS middleware is properly configured

### Authentication Issues

If login fails or token is rejected:
1. Check that SECRET_KEY is the same on all backend instances
2. Verify the token hasn't expired (30 min default)
3. Check browser console for error messages

### Database Connection Issues

If the backend can't connect to MongoDB:
1. Verify the MongoDB connection string
2. Check that your IP is whitelisted (for Atlas)
3. Ensure MongoDB service is running (for local)
4. Check the backend logs for detailed error messages

### Data Not Persisting

If data doesn't persist after page reload:
1. Verify `VITE_USE_BACKEND=true` in your build
2. Check that the API URL is correct
3. Open browser dev tools → Network tab to see API requests
4. Check for error responses from the backend

## Migration from Local Storage

To migrate existing data from local storage to MongoDB:

1. **Export Data** from the browser:
   ```javascript
   // Run in browser console
   const data = {
     users: JSON.parse(localStorage.getItem('users')),
     sows: JSON.parse(localStorage.getItem('sows'))
   };
   console.log(JSON.stringify(data));
   ```

2. **Import to MongoDB** using the API or MongoDB Compass

3. **Switch to Backend Mode** by setting `VITE_USE_BACKEND=true`

## Monitoring and Maintenance

1. **Monitor Backend Logs**: Check application logs regularly
2. **Database Backups**: Enable automated backups in MongoDB Atlas
3. **Health Checks**: Use the `/health` endpoint for monitoring
4. **Update Dependencies**: Keep Python packages up to date
5. **Token Rotation**: Periodically rotate the SECRET_KEY

## Cost Considerations

### Free Tier Options

- **MongoDB Atlas**: 512 MB storage free
- **Heroku**: Free tier available (with limitations)
- **Railway**: $5/month free credit
- **Vercel**: Free tier for API routes

### Paid Options

For production deployments with higher traffic:
- **MongoDB Atlas**: $0.08/GB/month (M10 tier)
- **Heroku**: $7/month (Hobby tier)
- **DigitalOcean**: $6/month (Basic Droplet)
- **AWS/Azure**: Pay-as-you-go pricing

## Support

For issues or questions:
- Check the [Backend README](backend/README.md)
- Review API documentation at `/docs`
- Check backend logs for errors
- Verify MongoDB connection

## Next Steps

1. Deploy the backend to your preferred hosting platform
2. Set up MongoDB database
3. Configure environment variables
4. Update GitHub Actions workflow
5. Test the integration locally
6. Deploy to GitHub Pages
7. Monitor and maintain the system

---

**Built with ❤️ by Xebia | Empowering Digital Excellence**
