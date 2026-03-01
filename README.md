# SustainaWed – AI Powered Sustainable Wedding Management System

This repository contains a full-stack application designed to reduce food waste and optimize logistics for weddings using machine learning.

## 🚀 Features

- Organizer registration with JWT authentication
- Event creation and QR code generation
- Guest RSVP pages and entrance scanning
- Machine learning models for attendance, food, parking, and room estimation
- SOS emergency system
- Sustainability analytics dashboard
- Dockerized backend, frontend, PostgreSQL, and Redis

## 🛠️ Technology Stack

**Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Chart.js, Axios

**Backend**: Python 3.11, FastAPI, SQLAlchemy, Pydantic, JWT auth

**Machine Learning**: scikit-learn, XGBoost, pandas, numpy, joblib

**Database**: PostgreSQL

**DevOps**: Docker, docker-compose, environment variables

## 📁 Project Structure

```
sustainawed/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── config.py
│   ├── requirements.txt
│   ├── models/
│   ├── schemas/
│   ├── routes/
│   ├── ml/
│   ├── utils/
│   └── Dockerfile
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── services/
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
├── setup.sh
└── README.md
```

## 📦 Getting Started

### With Docker

1. Copy `.env.example` to `.env` and fill in any needed values.
2. Run:
   ```bash
   docker-compose up --build
   ```
3. Backend available at `http://localhost:8000` and frontend at `http://localhost:3000`.

### Without Docker

1. **Backend**
   ```bash
   # ensure Python 3.11 is installed
   python -m venv venv
   source venv/bin/activate   # or venv\Scripts\activate on Windows
   pip install -r backend/requirements.txt
   export DATABASE_URL="postgresql://user:pass@localhost:5432/sustainawed"  # or use .env
   cd backend && uvicorn main:app --reload
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Initial ML models**
   You can generate sample models with:
   ```bash
   python - <<'PY'
import ml.model
model.train_sample_models()
PY
   ```

## 🧪 Testing with Sample Data

A helper script creates an organizer, an event and guests:

```bash
cd backend && python -m sample_data
```

You can also use `curl` or Postman to hit the API endpoints. Example:

```bash
# register user
curl -X POST "http://localhost:8000/auth/register" -H "Content-Type: application/json" \
  -d '{"name":"Org","email":"org@example.com","password":"secret"}'
# predict attendance
curl -X POST "http://localhost:8000/predict/attendance" -H "Content-Type: application/json" -d '{"features":[1,2,3,4,5]}'
# retrain model
curl -X POST "http://localhost:8000/retrain/model"
```
## 🔐 Security Notes

- Passwords are hashed using bcrypt
- JWT is used for authentication
- Environment variables are used for all secrets

## ☁️ Deployment

The application is cloud-ready and compatible with AWS EC2, RDS, and S3. Avoid hardcoded secrets; use environment variables.

## ✨ Contributions

This is a starter scaffold for SustainaWed. Feel free to extend features, improve ML models, and add UI components.

---

Made with ❤️ by SustainaWed AI team
