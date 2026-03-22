# HLMS - Docker Setup

## Prerequisites
- Docker installed
- Docker Compose installed
- MongoDB Atlas account

## Environment Setup

### Backend (.env)
Create `backend/.env` file:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hlms?retryWrites=true&w=majority
PORT=4000
JWT_SECRET=your_jwt_secret_key
```

### Frontend (.env.production)
Update `frontend/.env.production`:
```
VITE_API_URL=http://localhost:4000/api
```

## Running with Docker

### Build and Start All Services
```bash
docker-compose up --build
```

### Start Services (after first build)
```bash
docker-compose up
```

### Stop Services
```bash
docker-compose down
```

## Access Application
- Frontend: http://localhost
- Backend API: http://localhost:4000

## Individual Service Commands

### Backend Only
```bash
docker-compose up backend
```

### Frontend Only
```bash
docker-compose up frontend
```

### View Logs
```bash
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Production Deployment
1. Update MongoDB Atlas connection string in backend/.env
2. Update VITE_API_URL to production domain
3. Run: `docker-compose up -d`
