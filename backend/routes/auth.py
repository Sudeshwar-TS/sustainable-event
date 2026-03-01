from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import timedelta
import uuid
from utils.security import get_password_hash, verify_password, create_access_token
import models
import schemas
from database import get_db
from config import settings
from utils import security
from utils.qr import generate_event_qr
router = APIRouter(prefix="/auth", tags=["auth"])


# ---------------- REGISTER ----------------
@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):

    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    print("Password length:", len(user.password))
    hashed = security.get_password_hash(user.password)

    new_user = models.User(
        name=user.name,
        email=user.email,
        password_hash=hashed,
        phone=user.phone,
        role="organizer"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create default event
    token = str(uuid.uuid4())

    new_event = models.Event(
        user_id=new_user.id,
        event_name=f"{user.name}'s Wedding",
        expected_count=user.expected_count,
        event_token=token
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    # Generate QR
    qr_url = generate_event_qr(token)
    new_event.qr_code_url = qr_url
    db.commit()

    return {
        "user_id": new_user.id,
        "event_id": new_event.id,
        "event_token": token,
        "qr_code_url": qr_url
    }


# ---------------- LOGIN ----------------
@router.post("/login")
def login(login_data: schemas.LoginRequest, db: Session = Depends(get_db)):

    user = db.query(models.User).filter(models.User.email == login_data.email).first()

    if not user or not security.verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = security.create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {"access_token": access_token, "token_type": "bearer"}