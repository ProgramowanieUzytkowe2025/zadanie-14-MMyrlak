import time
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from contextlib import asynccontextmanager

import models
import schemas
from database import engine, get_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    models.Base.metadata.create_all(bind=engine)
    print("--- Serwer Zoo wystartował. Gotowy do pracy. ---")
    yield 
    print("--- Zamykanie serwera Zoo. ---")

app = FastAPI(title="Zoo Manager", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. CREATE - Dodawanie zwierzęcia
@app.post("/zwierzeta/", response_model=schemas.ZwierzeResponse)
def stworz_zwierze(zwierze: schemas.ZwierzeCreate, db: Session = Depends(get_db)):

    if zwierze.wiek > 100:
        raise HTTPException(status_code=400, detail="Zwierzę nie może mieć więcej niż 100 lat!")
    
    nowe_zwierze = models.Zwierze(
        gatunek=zwierze.gatunek,
        wiek=zwierze.wiek,
        czy_niebezpieczne=zwierze.czy_niebezpieczne,
        ilosc=zwierze.ilosc,
        klimat=zwierze.klimat
    )
    db.add(nowe_zwierze)
    db.commit()
    db.refresh(nowe_zwierze)
    return nowe_zwierze

# 2. READ ALL - Pobieranie listy
@app.get("/zwierzeta/", response_model=List[schemas.ZwierzeResponse])
def pobierz_zwierzeta(
    niebezpieczne: Optional[bool] = None,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    query = db.query(models.Zwierze)
    if niebezpieczne is not None:
        query = query.filter(models.Zwierze.czy_niebezpieczne == niebezpieczne)
    
    time.sleep(1000)
    return query.order_by(models.Zwierze.id).offset(skip).limit(limit).all()

# 3. READ ONE - Pobieranie szczegółów jednego zwierzęcia
@app.get("/zwierzeta/{zwierze_id}", response_model=schemas.ZwierzeResponse)
def pobierz_jedno_zwierze(zwierze_id: int, db: Session = Depends(get_db)):
    zwierze = db.query(models.Zwierze).filter(models.Zwierze.id == zwierze_id).first()
    if zwierze is None:
        raise HTTPException(status_code=404, detail="Nie znaleziono zwierzęcia")
    return zwierze

# 4. UPDATE - Edycja danych
@app.put("/zwierzeta/{zwierze_id}", response_model=schemas.ZwierzeResponse)
def aktualizuj_zwierze(zwierze_id: int, dane: schemas.ZwierzeCreate, db: Session = Depends(get_db)):

    if dane.wiek > 100:
        raise HTTPException(status_code=400, detail="Zwierzę nie może mieć więcej niż 100 lat!")
    
    zwierze_db = db.query(models.Zwierze).filter(models.Zwierze.id == zwierze_id).first()
    if zwierze_db is None:
        raise HTTPException(status_code=404, detail="Nie znaleziono zwierzęcia")
    
    zwierze_db.gatunek = dane.gatunek
    zwierze_db.wiek = dane.wiek
    zwierze_db.czy_niebezpieczne = dane.czy_niebezpieczne
    zwierze_db.ilosc = dane.ilosc
    zwierze_db.klimat = dane.klimat
    
    db.commit()
    db.refresh(zwierze_db)
    return zwierze_db

# 5. DELETE - Usuwanie
@app.delete("/zwierzeta/{zwierze_id}")
def usun_zwierze(zwierze_id: int, db: Session = Depends(get_db)):
    zwierze = db.query(models.Zwierze).filter(models.Zwierze.id == zwierze_id).first()
    if zwierze is None:
        raise HTTPException(status_code=404, detail="Nie znaleziono zwierzęcia")
    
    if not zwierze.czy_niebezpieczne:
        raise HTTPException(
            status_code=400, 
            detail="Wystąpił błąd: Nie można usuwać zwierząt oznaczonych jako łagodne (false)."
        )
    
    db.delete(zwierze)
    db.commit()
    return {"message": "Zwierzę usunięte pomyślnie"}