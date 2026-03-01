from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import models, schemas
from database import get_db

router = APIRouter(prefix="/sos", tags=["sos"])


@router.post("/trigger")
def trigger(sos: schemas.SOSCreate, db: Session = Depends(get_db)):
    guest = db.query(models.Guest).filter(models.Guest.id == sos.guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    event = db.query(models.Event).filter(models.Event.id == sos.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    organizer = db.query(models.User).filter(models.User.id == event.user_id).first()
    new = models.SOS(**sos.dict())
    db.add(new)
    db.commit()
    db.refresh(new)
    # mock notification to organizer
    if organizer and organizer.phone:
        print(f"[SOS] notifying organizer {organizer.phone} that guest {guest.name} needs help")
    return {"sos": new, "organizer_phone": organizer.phone if organizer else None}


@router.post("/resolve/{sos_id}", response_model=schemas.SOSOut)
def resolve(sos_id: int, db: Session = Depends(get_db)):
    record = db.query(models.SOS).filter(models.SOS.id == sos_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="SOS not found")
    record.resolved = "true"
    db.commit()
    db.refresh(record)
    return record
