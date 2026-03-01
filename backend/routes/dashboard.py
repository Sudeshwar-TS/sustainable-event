from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException

import models
from database import get_db

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary/{event_id}")
def summary(event_id: int, db: Session = Depends(get_db)):
    ev = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Event not found")
    total_rsvps = db.query(func.count(models.Guest.id)).filter(models.Guest.event_id == event_id).scalar() or 0
    actual = db.query(func.sum(models.Attendance.actual_people_count)).join(models.Guest).filter(models.Guest.event_id == event_id).scalar() or 0
    # transport distribution
    guests = db.query(models.Guest).filter(models.Guest.event_id == event_id).all()
    transport_counts = {"Bike":0, "Car":0, "Public Transport":0, "Other":0}
    for g in guests:
        t = g.transport_type or "Other"
        if t not in transport_counts:
            t = "Other"
        transport_counts[t] += 1
    # predicted values stored in event
    predicted = ev.predicted_attendance or 0
    predicted_food = ev.predicted_food or 0
    predicted_parking = ev.predicted_parking or 0
    predicted_rooms = ev.predicted_rooms or 0
    # estimations for actual
    actual_food = actual # assume 1 plate per person
    actual_parking = predicted_parking  # we don't track actual here
    actual_rooms = predicted_rooms
    # sustainability metrics
    predicted_without_system = ev.expected_count or 0
    optimized_prediction = predicted_food
    waste_saved = max(predicted_without_system - optimized_prediction, 0) * 0.4
    co2_saved = (predicted_parking - actual_parking) * 0.2 if predicted_parking else 0
    money_saved = (predicted_without_system - optimized_prediction) * 10
    return {
        "total_rsvps": total_rsvps,
        "actual_attendance": actual,
        "predicted_attendance": predicted,
        "predicted_food": predicted_food,
        "actual_food": actual_food,
        "predicted_parking": predicted_parking,
        "actual_parking": actual_parking,
        "predicted_rooms": predicted_rooms,
        "actual_rooms": actual_rooms,
        "transport_distribution": transport_counts,
        "waste_saved": waste_saved,
        "co2_saved": co2_saved,
        "money_saved": money_saved,
    }
