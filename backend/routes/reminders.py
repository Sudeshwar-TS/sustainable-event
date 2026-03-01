from fastapi import APIRouter
from sqlalchemy.orm import Session
from database import get_db
import models
from datetime import datetime

router = APIRouter(prefix="/reminders", tags=["reminders"])


def send_reminder_for_event(event_id: int):
    db = next(get_db())
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        print(f"Reminder: event {event_id} not found")
        return
    guests = db.query(models.Guest).filter(models.Guest.event_id == event_id).all()
    phones = [g.phone for g in guests if g.phone]
    for p in phones:
        # mock SMS
        print(f"[Reminder] sending SMS to {p} for event {event.event_name} on {event.event_date}")
    # log
    print(f"Reminders sent to {len(phones)} guests for event {event_id} at {datetime.utcnow()}")


@router.post("/send/{event_id}")
def trigger_manual(event_id: int):
    send_reminder_for_event(event_id)
    return {"status": "sent"}
