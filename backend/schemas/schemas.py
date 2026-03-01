from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


# ---------------- USER ----------------

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str


class OrganizerRegister(BaseModel):
    name: str
    email: EmailStr
    phone: str
    expected_count: int
    hall_name: str
    location: str
    bus_routes: str
    bus_stops: str


class OTPRequest(BaseModel):
    phone: str


class OTPVerify(BaseModel):
    phone: str
    otp: str


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str]

    class Config:
        from_attributes = True


# ---------------- EVENT ----------------

class EventCreate(BaseModel):
    event_name: str
    location: Optional[str] = None
    hall_name: Optional[str] = None
    bus_routes: Optional[str] = None
    bus_stops: Optional[str] = None
    expected_count: Optional[int] = None
    event_date: Optional[datetime] = None


class EventOut(BaseModel):
    id: int
    user_id: int
    event_token: str
    event_name: str
    hall_name: Optional[str]
    location: Optional[str]
    bus_routes: Optional[str]
    bus_stops: Optional[str]
    expected_count: Optional[int]
    qr_code_url: Optional[str]
    event_date: Optional[datetime]

    class Config:
        from_attributes = True


# ---------------- GUEST ----------------

class GuestCreate(BaseModel):
    name: str
    phone: str
    number_of_people: int = 1
    transport_type: Optional[str] = None
    parking_needed: Optional[str] = None
    needs_room: Optional[str] = None
    event_id: int


class GuestOut(BaseModel):
    id: int
    event_id: int
    name: str
    phone: str
    number_of_people: int
    transport_type: Optional[str] = None
    parking_needed: Optional[str] = None
    needs_room: Optional[str] = None

    class Config:
        from_attributes = True
# ---------------- ATTENDANCE ----------------

class AttendanceCreate(BaseModel):
    event_id: int
    guest_id: int
    actual_people_count: int


class AttendanceOut(BaseModel):
    id: int
    event_id: int
    guest_id: int
    actual_people_count: int
    scanned_at: datetime

    class Config:
        from_attributes = True
# ---------------- SOS ----------------

class SOSCreate(BaseModel):
    event_id: int
    guest_id: int


class SOSOut(BaseModel):
    id: int
    event_id: int
    guest_id: int
    triggered_at: datetime
    resolved: Optional[str] = None

    class Config:
        from_attributes = True