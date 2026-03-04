from fastapi import FastAPI
from database import engine, Base, wait_for_db
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# ✅ include events
from routes import auth, events, guests, entrance, sos, dashboard, reminders

app = FastAPI(title="SustainaWed Backend")


@app.on_event("startup")
def on_startup():
    wait_for_db()
    Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router)
app.include_router(events.router)   # ✅ ADD THIS BACK
app.include_router(guests.router)
app.include_router(entrance.router)
app.include_router(sos.router)
app.include_router(dashboard.router)
app.include_router(reminders.router)


@app.get("/")
def root():
    return {"message": "SustainaWed API"}
