from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import models, schemas
from database import get_db

router = APIRouter(prefix="/entrance", tags=["entrance"])


@router.post("/scan", response_model=schemas.AttendanceOut)
def scan(att: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    guest = db.query(models.Guest).filter(models.Guest.id == att.guest_id).first()
    if not guest or guest.event_id != att.event_id:
        raise HTTPException(status_code=404, detail="Guest not found for event")
    new = models.Attendance(**att.dict())
    db.add(new)
    db.commit()
    db.refresh(new)
    return new
