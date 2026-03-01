from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import uuid4
from database import get_db
from models.models import User, Guest, Event
from schemas.schemas import OTPRequest, OTPVerify, OrganizerRegister
from utils.security import create_access_token, get_password_hash
from utils.otp import generate_otp, store_otp, verify_otp
from utils.qr import generate_event_qr

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
def register_organizer(data: OrganizerRegister, db: Session = Depends(get_db)):
    """Register a new organizer and create their event"""
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    existing_phone = db.query(User).filter(User.phone == data.phone).first()
    if existing_phone:
        raise HTTPException(status_code=400, detail="Phone already registered")
    
    # Create organizer user with a hashed placeholder password (OTP-based login)
    password_hash = get_password_hash(str(uuid4()))
    
    new_user = User(
        name=data.name,
        email=data.email,
        phone=data.phone,
        password_hash=password_hash,
        role="organizer"
    )
    
    db.add(new_user)
    db.flush()  # Flush to get the user ID
    
    # Create event for the organizer
    event_token = str(uuid4())
    new_event = Event(
        user_id=new_user.id,
        event_name=f"{data.name}'s Wedding",  # Default event name
        event_token=event_token,
        hall_name=data.hall_name,
        location=data.location,
        bus_routes=data.bus_routes,
        bus_stops=data.bus_stops,
        expected_count=data.expected_count
    )
    
    db.add(new_event)
    db.flush()
    
    # Generate QR code
    qr_url = generate_event_qr(event_token)
    new_event.qr_code_url = qr_url
    
    db.commit()
    db.refresh(new_event)
    
    return {"qr_code_url": qr_url}


@router.post("/request-otp")
def request_otp(data: OTPRequest, db: Session = Depends(get_db)):
    phone_clean = data.phone.strip().replace("+91", "")

    user = db.query(User).filter(User.phone == phone_clean).first()
    guest = db.query(Guest).filter(Guest.phone == phone_clean).first()

    if not user and not guest:
        raise HTTPException(status_code=404, detail="Phone not registered")

    otp = generate_otp()
    store_otp(phone_clean, otp)

    print("OTP:", otp)  # REMOVE in production

    return {"message": "OTP sent successfully"}


@router.post("/verify-otp")
def verify_user_otp(data: OTPVerify, db: Session = Depends(get_db)):
    phone_clean = data.phone.strip().replace("+91", "")

    if not verify_otp(phone_clean, data.otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    user = db.query(User).filter(User.phone == phone_clean).first()
    if user:
        token = create_access_token({
            "sub": str(user.id),
            "role": "organizer"
        })
        return {"access_token": token, "role": "organizer"}

    guest = db.query(Guest).filter(Guest.phone == phone_clean).first()
    if guest:
        token = create_access_token({
            "sub": str(guest.id),
            "role": "guest",
            "event_id": guest.event_id
        })
        return {"access_token": token, "role": "guest"}

    raise HTTPException(status_code=404, detail="User not found")