# Docker Deployment Guide

This guide shows how to deploy SOWgen.ai backend using Docker.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start with Docker Compose

### 1. Start Services

```bash
# Start MongoDB and Backend
docker-compose up -d

# View logs
docker-compose logs -f backend
```

### 2. Verify Services

```bash
# Check if services are running
docker-compose ps

# Test backend
curl http://localhost:8000/health
```

### 3. Access API Documentation

Open http://localhost:8000/docs in your browser.

### 4. Stop Services

```bash
docker-compose down

# To also remove data
docker-compose down -v
```

## Using Individual Docker Containers

### Build Backend Image

```bash
cd backend
docker build -t sowgen-backend .
```

### Run with External MongoDB

```bash
docker run -d \
  --name sowgen-backend \
  -p 8000:8000 \
  -e MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/ \
  -e MONGODB_DB_NAME=sowgen_db \
  -e SECRET_KEY=your-secret-key \
  -e ALLOWED_ORIGINS=https://xebia.github.io \
  sowgen-backend
```

## Environment Variables

Configure these in docker-compose.yml or as -e flags:

| Variable | Description | Default |
|----------|-------------|---------|
| MONGODB_URL | MongoDB connection string | mongodb://mongodb:27017 |
| MONGODB_DB_NAME | Database name | sowgen_db |
| SECRET_KEY | JWT secret key | (required) |
| ALLOWED_ORIGINS | CORS allowed origins | http://localhost:5000 |
| API_HOST | API bind host | 0.0.0.0 |
| API_PORT | API bind port | 8000 |

## Production Deployment

### Using Docker Compose in Production

1. **Update docker-compose.yml**

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secure-password
    volumes:
      - /data/mongodb:/data/db

  backend:
    build: ./backend
    restart: always
    ports:
      - "8000:8000"
    environment:
      MONGODB_URL: mongodb://admin:secure-password@mongodb:27017
      SECRET_KEY: ${SECRET_KEY}
      ALLOWED_ORIGINS: ${ALLOWED_ORIGINS}
```

2. **Create .env file**

```bash
SECRET_KEY=your-secure-secret-key
ALLOWED_ORIGINS=https://xebia.github.io
```

3. **Deploy**

```bash
docker-compose up -d
```

### Deploy to Cloud Platforms

#### AWS ECS / Fargate

1. Push image to ECR
2. Create ECS task definition
3. Create ECS service
4. Configure Application Load Balancer

#### Google Cloud Run

```bash
# Build and push
gcloud builds submit --tag gcr.io/PROJECT_ID/sowgen-backend

# Deploy
gcloud run deploy sowgen-backend \
  --image gcr.io/PROJECT_ID/sowgen-backend \
  --platform managed \
  --set-env-vars MONGODB_URL=...,SECRET_KEY=...
```

#### Azure Container Instances

```bash
# Build and push to ACR
az acr build --registry REGISTRY_NAME --image sowgen-backend .

# Deploy
az container create \
  --resource-group RESOURCE_GROUP \
  --name sowgen-backend \
  --image REGISTRY_NAME.azurecr.io/sowgen-backend \
  --environment-variables MONGODB_URL=... SECRET_KEY=...
```

## Monitoring

### View Logs

```bash
# Backend logs
docker-compose logs -f backend

# MongoDB logs
docker-compose logs -f mongodb
```

### Health Check

```bash
# Check backend health
curl http://localhost:8000/health

# Check MongoDB
docker exec sowgen-mongodb mongosh --eval "db.adminCommand('ping')"
```

## Backup and Restore

### Backup MongoDB

```bash
docker exec sowgen-mongodb mongodump \
  --db sowgen_db \
  --out /data/backup

docker cp sowgen-mongodb:/data/backup ./backup
```

### Restore MongoDB

```bash
docker cp ./backup sowgen-mongodb:/data/backup

docker exec sowgen-mongodb mongorestore \
  --db sowgen_db \
  /data/backup/sowgen_db
```

## Troubleshooting

### Backend Can't Connect to MongoDB

```bash
# Check MongoDB is running
docker-compose ps mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Test connection from backend container
docker exec sowgen-backend ping mongodb
```

### Permission Issues

```bash
# Check file permissions
ls -la backend/

# Fix if needed
sudo chown -R $USER:$USER backend/
```

### Port Already in Use

```bash
# Find process using port
sudo lsof -i :8000

# Or change port in docker-compose.yml
ports:
  - "8001:8000"
```

## Security Best Practices

1. **Always use strong SECRET_KEY** in production
2. **Don't expose MongoDB** port in production
3. **Use secure MongoDB credentials**
4. **Enable MongoDB authentication**
5. **Use HTTPS** with reverse proxy (nginx/Caddy)
6. **Limit CORS origins** to your actual domains
7. **Keep Docker images updated**

## Performance Optimization

1. **Use production WSGI server** (uvicorn with multiple workers)
2. **Enable MongoDB indexes** (automatically created)
3. **Set up caching** (Redis for session storage)
4. **Use connection pooling** (configured by default)
5. **Monitor resource usage** with Docker stats

```bash
docker stats sowgen-backend sowgen-mongodb
```

## Support

- Main documentation: [README.md](README.md)
- MongoDB guide: [../MONGODB_BACKEND_GUIDE.md](../MONGODB_BACKEND_GUIDE.md)
- Quick start: [QUICKSTART.md](QUICKSTART.md)
