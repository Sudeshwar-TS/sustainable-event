from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models, schemas
from database import get_db

router = APIRouter(prefix="/guests", tags=["guests"])



@router.post("/", response_model=schemas.GuestOut)
def add_guest(guest: schemas.GuestCreate, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == guest.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    new_guest = models.Guest(**guest.dict())
    db.add(new_guest)
    db.commit()
    db.refresh(new_guest)

    return new_guest

@router.get("/event/{event_id}", response_model=list[schemas.GuestOut])
def list_guests(event_id: int, db: Session = Depends(get_db)):
    return db.query(models.Guest).filter(models.Guest.event_id == event_id).all()
