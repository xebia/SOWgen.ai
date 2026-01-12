# SOWgen.ai Backend

Python FastAPI backend with MongoDB for persistent data storage.

## Overview

This backend provides RESTful API endpoints for the SOWgen.ai application, enabling data persistence in MongoDB so that data is not lost when the GitHub Pages frontend is reloaded.

## Features

- **RESTful API** with FastAPI
- **MongoDB** for data persistence
- **JWT Authentication** for secure API access
- **CRUD Operations** for Users and SOWs
- **Role-Based Access Control** (Client, Xebia Admin, Approver)
- **CORS Support** for GitHub Pages frontend
- **Automatic Demo Data** initialization

## Prerequisites

- Python 3.9 or higher
- MongoDB 4.4 or higher (local or cloud instance)
- pip (Python package installer)

## Installation

1. **Navigate to the backend directory**

```bash
cd backend
```

2. **Create a virtual environment**

```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Configure environment variables**

Copy the example environment file and update it with your configuration:

```bash
cp .env.example .env
```

Edit `.env` and update the following variables:

```env
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=sowgen_db
SECRET_KEY=your-secret-key-change-in-production
ALLOWED_ORIGINS=http://localhost:5000,https://xebia.github.io
```

## MongoDB Setup

### Option 1: Local MongoDB

1. **Install MongoDB** ([Download](https://www.mongodb.com/try/download/community))

2. **Start MongoDB service**

```bash
# On Windows
net start MongoDB

# On macOS (with Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

3. **Verify MongoDB is running**

```bash
mongosh
# Should connect successfully
```

### Option 2: MongoDB Atlas (Cloud)

1. **Create a free account** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **Create a cluster** (free tier available)

3. **Get your connection string**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

4. **Update `.env` file**

```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

## Running the Backend

1. **Start the FastAPI server**

```bash
python main.py
```

Or use uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

2. **Verify the server is running**

Open your browser and navigate to:
- API: http://localhost:8000
- Interactive API Docs: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

## API Endpoints

### Authentication

- **POST** `/api/auth/login` - Login and get JWT token
- **GET** `/api/auth/me` - Get current user info

### Users

- **POST** `/api/users` - Create a new user (admin only)
- **GET** `/api/users` - Get all users (admin only)
- **GET** `/api/users/{user_id}` - Get user by ID
- **PUT** `/api/users/{user_id}` - Update user
- **DELETE** `/api/users/{user_id}` - Delete user (admin only)

### SOWs

- **POST** `/api/sows` - Create a new SOW
- **GET** `/api/sows` - Get all SOWs (filtered by user role)
- **GET** `/api/sows?status=pending` - Get SOWs by status
- **GET** `/api/sows/{sow_id}` - Get SOW by ID
- **PUT** `/api/sows/{sow_id}` - Update SOW
- **DELETE** `/api/sows/{sow_id}` - Delete SOW
- **POST** `/api/sows/{sow_id}/comments` - Add approval comment

### Health Check

- **GET** `/` - Basic health check
- **GET** `/health` - Detailed health check with database status

## Demo Users

The backend automatically creates demo users on first startup:

| Email | Password | Role |
|-------|----------|------|
| client@example.com | demo123 | Client |
| admin@xebia.com | demo123 | Xebia Admin |
| approver@xebia.com | demo123 | Approver |

## Authentication Flow

1. **Login**
   ```bash
   curl -X POST http://localhost:8000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "client@example.com", "password": "demo123"}'
   ```

2. **Use the returned token**
   ```bash
   curl -X GET http://localhost:8000/api/sows \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

## Development

### API Documentation

FastAPI automatically generates interactive API documentation:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Testing API Endpoints

You can test the API using:
- **Interactive Docs**: Use the built-in Swagger UI at `/docs`
- **Postman**: Import the endpoints from the OpenAPI schema
- **curl**: Command-line HTTP client
- **httpie**: User-friendly HTTP client

Example with curl:

```bash
# Login
TOKEN=$(curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "client@example.com", "password": "demo123"}' \
  | jq -r '.access_token')

# Get SOWs
curl -X GET http://localhost:8000/api/sows \
  -H "Authorization: Bearer $TOKEN"
```

## Deployment

### Option 1: Heroku

1. **Install Heroku CLI**

2. **Create a Heroku app**
   ```bash
   heroku create sowgen-api
   ```

3. **Add MongoDB addon**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 2: Railway

1. **Install Railway CLI**

2. **Initialize Railway project**
   ```bash
   railway init
   ```

3. **Add MongoDB plugin**

4. **Deploy**
   ```bash
   railway up
   ```

### Option 3: AWS/DigitalOcean/Azure

Deploy using Docker or traditional VPS hosting. See deployment guides in the main README.

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| MONGODB_URL | MongoDB connection string | mongodb://localhost:27017 |
| MONGODB_DB_NAME | Database name | sowgen_db |
| API_HOST | API server host | 0.0.0.0 |
| API_PORT | API server port | 8000 |
| SECRET_KEY | JWT secret key | (required in production) |
| ALGORITHM | JWT algorithm | HS256 |
| ACCESS_TOKEN_EXPIRE_MINUTES | Token expiration time | 30 |
| ALLOWED_ORIGINS | CORS allowed origins | http://localhost:5000 |

## Security Notes

- **Change SECRET_KEY** in production to a secure random string
- **Use HTTPS** in production
- **Secure MongoDB** with authentication and firewall rules
- **Rotate JWT tokens** regularly
- **Validate input** thoroughly (handled by Pydantic models)

## Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
mongosh

# Check MongoDB logs (on Linux)
sudo journalctl -u mongod
```

### Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

### CORS Issues

Ensure your frontend URL is in the `ALLOWED_ORIGINS` environment variable:
```env
ALLOWED_ORIGINS=http://localhost:5000,https://xebia.github.io
```

## Support

For issues or questions:
- Check the [main README](../README.md)
- Review API documentation at `/docs`
- Check MongoDB connection and logs

## License

MIT License - see [LICENSE](../LICENSE) file for details.
