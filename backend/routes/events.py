from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/events", tags=["events"])


@router.get("/token/{token}")
def get_event_by_token(token: str, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.event_token == token).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    return {
        "id": event.id,
        "event_name": event.event_name,
        "hall_name": event.hall_name,
        "location": event.location,
        "bus_routes": event.bus_routes,
        "bus_stops": event.bus_stops
    }