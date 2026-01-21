from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class Zwierze(Base):
    __tablename__ = "zwierzeta"

    id = Column(Integer, primary_key=True, index=True)
    gatunek = Column(String(100), index=True)
    wiek = Column(Integer)
    czy_niebezpieczne = Column(Boolean, default=False)
    ilosc = Column(Integer, default=1)           
    klimat = Column(String(50))                  