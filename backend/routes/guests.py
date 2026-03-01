from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.models import Guest, Event
from schemas.schemas import GuestCreate, GuestOut
from dependencies.auth import require_role

router = APIRouter(prefix="/guests", tags=["guests"])


@router.post("/", response_model=GuestOut)
def add_guest(
    guest: GuestCreate,
    user = Depends(require_role("organizer")),
    db: Session = Depends(get_db)
):
    phone_clean = guest.phone.strip().replace("+91", "")

    event = db.query(Event).filter(
        Event.id == guest.event_id,
        Event.user_id == int(user["sub"])
    ).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    existing_guest = db.query(Guest).filter(
        Guest.phone == phone_clean,
        Guest.event_id == guest.event_id
    ).first()

    if existing_guest:
        raise HTTPException(
            status_code=400,
            detail="Guest with this phone already exists"
        )

    new_guest = Guest(
        name=guest.name,
        phone=phone_clean,
        number_of_people=guest.number_of_people,
        transport_type=guest.transport_type,
        parking_needed=guest.parking_needed,
        needs_room=guest.needs_room,
        event_id=guest.event_id
    )

    db.add(new_guest)
    db.commit()
    db.refresh(new_guest)

    return new_guest


@router.get("/event/{event_id}", response_model=list[GuestOut])
def list_guests(
    event_id: int,
    user = Depends(require_role("organizer")),
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter(
        Event.id == event_id,
        Event.user_id == int(user["sub"])
    ).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    return db.query(Guest).filter(
        Guest.event_id == event_id
    ).all()