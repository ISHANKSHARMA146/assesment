# Local Development Setup - Complete

## ✅ Setup Completed

### Backend Setup
- ✅ Python virtual environment created
- ✅ Dependencies installed (FastAPI, SQLAlchemy, Pydantic, etc.)
- ✅ email-validator installed
- ✅ .env file created with SQLite database
- ✅ Database configuration updated for SQLite

### Frontend Setup
- ✅ Node modules installed
- ✅ .env file created with API URL

## 🚀 To Start the Servers

### Start Backend (Terminal 1)

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend will be available at: **http://localhost:8000**
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

### Start Frontend (Terminal 2)

```powershell
cd frontend
npm run dev
```

Frontend will be available at: **http://localhost:5173** (or the port shown by Vite)

## 📝 Environment Files

### Backend (.env)
```
DATABASE_URL=sqlite:///./hrms_lite.db
CORS_ORIGINS=["http://localhost:3000"]
API_V1_PREFIX=/api/v1
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000
```

## 🗄️ Database

- Using SQLite for local development (no PostgreSQL setup needed)
- Database file: `backend/hrms_lite.db` (created automatically on first run)

## ✅ Verification

1. Backend health check: http://localhost:8000/health
   - Should return: `{"status":"ok","version":"1.0.0"}`

2. Frontend: http://localhost:5173
   - Should show the HRMS Lite application

3. Test API: http://localhost:8000/docs
   - Interactive API documentation

## 🐛 Troubleshooting

If backend doesn't start:
- Check if port 8000 is already in use
- Verify .env file exists in backend directory
- Check virtual environment is activated

If frontend doesn't connect to backend:
- Verify backend is running on port 8000
- Check frontend .env file has correct API URL
- Check browser console for CORS errors
