from pydantic import BaseModel

class ZwierzeCreate(BaseModel):
    gatunek: str
    wiek: int
    czy_niebezpieczne: bool
    ilosc: int
    klimat: str

class ZwierzeResponse(ZwierzeCreate):
    id: int

    class Config:
        from_attributes = True