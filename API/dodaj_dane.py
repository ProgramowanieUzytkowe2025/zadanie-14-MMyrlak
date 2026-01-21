from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)

def wstaw_rekordy():
    db = SessionLocal()
    
    try:
        print("Rozpoczynam dodawanie nowych zwierząt...")

        nowe_zwierzeta = [
            models.Zwierze(
                gatunek="Słoń Afrykański", 
                wiek=15, 
                czy_niebezpieczne=True, 
                ilosc=3, 
                klimat="Sawanna"
            ),
            models.Zwierze(
                gatunek="Panda Wielka", 
                wiek=6, 
                czy_niebezpieczne=False, 
                ilosc=2, 
                klimat="Umiarkowany (Bambusowy Las)"
            ),
            models.Zwierze(
                gatunek="Krokodyl Nilowy", 
                wiek=25, 
                czy_niebezpieczne=True, 
                ilosc=5, 
                klimat="Rzeka / Tropikalny"
            ),
            models.Zwierze(
                gatunek="Papuga Ara", 
                wiek=4, 
                czy_niebezpieczne=False, 
                ilosc=10, 
                klimat="Tropikalny"
            ),
            models.Zwierze(
                gatunek="Niedźwiedź Polarny", 
                wiek=9, 
                czy_niebezpieczne=True, 
                ilosc=2, 
                klimat="Polarny"
            ),
            models.Zwierze(
                gatunek="Kangur Rudy", 
                wiek=3, 
                czy_niebezpieczne=False, 
                ilosc=8, 
                klimat="Pustynny / Step"
            ),
            models.Zwierze(
                gatunek="Wilk Szary", 
                wiek=5, 
                czy_niebezpieczne=True, 
                ilosc=6, 
                klimat="Umiarkowany / Leśny"
            ),
        ]

        db.add_all(nowe_zwierzeta)
        db.commit()
        
        print(f"Sukces! Dodano {len(nowe_zwierzeta)} nowych rekordów do bazy Zoo.")

    except Exception as e:
        print(f"Wystąpił błąd: {e}")
        db.rollback()
    
    finally:
        db.close()

if __name__ == "__main__":
    wstaw_rekordy()