from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, User, Workout, Event, Progress
from typing import List, Union
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI()

# Habilitar CORS
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class UserCreate(BaseModel):
    username: str
    password: str

class WorkoutCreate(BaseModel):
    id: int  
    type: str
    description: str
    duration: int

class EventCreate(BaseModel):
    id: int 
    title: str
    date: Union[str, datetime]

class ProgressCreate(BaseModel):
    id: int  
    weight: float

EventCreate.update_forward_refs()

@app.post("/users/", response_model=UserCreate)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(username=user.username, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return user

@app.post("/workouts/{user_id}", response_model=WorkoutCreate)
def create_workout(user_id: int, workout: WorkoutCreate, db: Session = Depends(get_db)):
    db_workout = Workout(user_id=user_id, **workout.dict(exclude={'id'}))  
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)
    return WorkoutCreate(id=db_workout.id, type=db_workout.type, description=db_workout.description, duration=db_workout.duration)

@app.get("/workouts/{user_id}", response_model=List[WorkoutCreate])
def get_workouts(user_id: int, db: Session = Depends(get_db)):
    workouts = db.query(Workout).filter(Workout.user_id == user_id).all()
    return [WorkoutCreate(id=w.id, type=w.type, description=w.description, duration=w.duration) for w in workouts]

@app.delete("/workouts/{user_id}/{workout_id}")
def delete_workout(user_id: int, workout_id: int, db: Session = Depends(get_db)):
    workout = db.query(Workout).filter(Workout.user_id == user_id, Workout.id == workout_id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Entrenamiento no encontrado")
    db.delete(workout)
    db.commit()
    return {"message": "Entrenamiento eliminado exitosamente"}

@app.post("/events/{user_id}", response_model=EventCreate)
def create_event(user_id: int, event: EventCreate, db: Session = Depends(get_db)):
    try:
        if isinstance(event.date, str):
            event_date = datetime.strptime(event.date, "%Y-%m-%dT%H:%M")
        else:
            event_date = event.date
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Formato de fecha inválido. Usa YYYY-MM-DDTHH:MM")
    
    db_event = Event(user_id=user_id, title=event.title, date=event_date)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return EventCreate(id=db_event.id, title=db_event.title, date=db_event.date.isoformat())

@app.get("/events/{user_id}", response_model=List[EventCreate])
def get_events(user_id: int, db: Session = Depends(get_db)):
    events = db.query(Event).filter(Event.user_id == user_id).all()
    return [EventCreate(id=e.id, title=e.title, date=e.date.isoformat()) for e in events]

@app.delete("/events/{user_id}/{event_id}")
def delete_event(user_id: int, event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.user_id == user_id, Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    db.delete(event)
    db.commit()
    return {"message": "Evento eliminado exitosamente"}

@app.post("/progress/{user_id}", response_model=ProgressCreate)
def create_progress(user_id: int, progress: ProgressCreate, db: Session = Depends(get_db)):
    db_progress = Progress(user_id=user_id, **progress.dict(exclude={'id'}))
    db.add(db_progress)
    db.commit()
    db.refresh(db_progress)
    return ProgressCreate(id=db_progress.id, weight=db_progress.weight)

@app.get("/progress/{user_id}", response_model=List[ProgressCreate])
def get_progress(user_id: int, db: Session = Depends(get_db)):
    progress_entries = db.query(Progress).filter(Progress.user_id == user_id).all()
    return [ProgressCreate(id=p.id, weight=p.weight) for p in progress_entries]

@app.delete("/progress/{user_id}/{progress_id}")
def delete_progress(user_id: int, progress_id: int, db: Session = Depends(get_db)):
    progress = db.query(Progress).filter(Progress.user_id == user_id, Progress.id == progress_id).first()
    if not progress:
        raise HTTPException(status_code=404, detail="Progreso no encontrado")
    db.delete(progress)
    db.commit()
    return {"message": "Progreso eliminado exitosamente"}