from fastapi import FastAPI
from database import engine, Base, wait_for_db
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# Routers
from routes import auth, events, guests, entrance, sos, dashboard, reminders

app = FastAPI(title="SustainaWed Backend")

# ---------------------------
# Startup Event
# ---------------------------
@app.on_event("startup")
def on_startup():
    wait_for_db()
    Base.metadata.create_all(bind=engine)


# ---------------------------
# CORS Configuration
# ---------------------------
origins = [
    "http://localhost:3000",  # local dev
    "https://sustainable-event.vercel.app",  # deployed frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------
# Uploads Folder
# ---------------------------
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# ---------------------------
# Include Routers
# ---------------------------
app.include_router(auth.router)
app.include_router(events.router)
app.include_router(guests.router)
app.include_router(entrance.router)
app.include_router(sos.router)
app.include_router(dashboard.router)
app.include_router(reminders.router)


# ---------------------------
# Root Endpoint
# ---------------------------
@app.get("/")
def root():
    return {"message": "SustainaWed API is running"}