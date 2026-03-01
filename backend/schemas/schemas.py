from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


# ---------------- USER ----------------

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    expected_count: int
    hall_name: str
    location: str
    bus_routes: str
    bus_stops: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str]

    class Config:
        from_attributes = True


# ---------------- EVENT ----------------

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
    password: str
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
    transport_type: str
    parking_needed: str
    needs_room: str

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
    resolved: Optional[str]

    class Config:
        from_attributes = True

# ---------------- EVENT ----------------

class EventCreate(BaseModel):
    user_id: int
    event_name: str
    location: str | None = None
    hall_name: str | None = None
    bus_routes: str | None = None
    bus_stops: str | None = None
    expected_count: int | None = None
    event_date: datetime | None = None