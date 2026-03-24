# Movie Recommendation System

A Netflix-style movie recommendation system built with Next.js, FastAPI, PostgreSQL, and Redis.

## Architecture

- **Frontend**: Next.js 14 (App Router)
- **Backend**: Python FastAPI with python-socketio for real-time recommendations
- **Database**: PostgreSQL 15
- **Cache**: Redis 7

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Python 3.11+ (for local development)
- Node.js 18+ (for local development)

### Quick Start with Docker

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Start all services:
   ```bash
   docker-compose up
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Local Development

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Project Structure

```
movie-recommendation-system/
├── frontend/          # Next.js application
├── backend/           # FastAPI ML service
├── docker-compose.yml
├── .env.example
└── README.md
```