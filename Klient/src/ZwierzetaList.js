import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Edit, Plus, Filter, Info } from 'lucide-react';
import { useToast } from './ToastContext';
import { useLoading } from './LoadingContext';

const ZwierzetaList = () => {
  const [zwierzeta, setZwierzeta] = useState([]);
  const [filtr, setFiltr] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  const { showToast } = useToast();
  const { setIsLoading } = useLoading();

  const fetchZwierzeta = useCallback(async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    try {
      let url = "http://127.0.0.1:8000/zwierzeta/";
      if (filtr !== 'all') {
        url += `?niebezpieczne=${filtr === 'true'}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setZwierzeta(data);
    } catch (err) {
      showToast("Wystąpił błąd podczas pobierania danych", "error");
    } finally {
      if (showLoader) setIsLoading(false);
    }
  }, [filtr, setIsLoading]);

  useEffect(() => {
    fetchZwierzeta();
  }, [fetchZwierzeta]);

  const potwierdzUsuniecie = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/zwierzeta/${itemToDelete}`, { 
        method: 'DELETE' 
      });
      
      if (response.ok) {
        showToast("Poprawnie zapisano zmiany", "success");
        await fetchZwierzeta(false); 
      } else {
        const error = await response.json();
        showToast(error.detail || "Wystąpił błąd", "error");
      }
    } catch (err) {
      showToast("Wystąpił błąd", "error");
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="content-container">
      <div className="section-header">
        <div className="section-title">
          <h1>Mieszkańcy Zoo 🦒</h1>
        </div>
        <div className="controls-bar">
          <div className="filter-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} />
            <select 
              className="custom-select"
              value={filtr}
              onChange={(e) => setFiltr(e.target.value)}
            >
              <option value="all">Wszystkie zwierzęta</option>
              <option value="true">Tylko Niebezpieczne (true)</option>
              <option value="false">Tylko Łagodne (false)</option>
            </select>
          </div>
          <Link to="/dodaj" className="btn-add">
            <Plus size={18} /> Dodaj zwierzę
          </Link>
        </div>
      </div>

      <div className="animals-grid">
        {zwierzeta.map(z => (
          <div key={z.id} className="animal-card">
            <div className="animal-info-main">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 className="animal-species">{z.gatunek}</h3>
                <span className={`status-badge ${z.czy_niebezpieczne ? 'status-danger' : 'status-safe'}`}>
                  {z.czy_niebezpieczne ? "Tak" : "Nie"}
                </span>
              </div>
              
              <div className="info-item">
                <span className="label">Ilość osobników</span>
                <span className="value">{z.ilosc}</span>
              </div>
              <div className="info-item">
                <span className="label">Wiek osobników: </span>
                <span className="value">{z.wiek}</span>
              </div>
              <div className="info-item">
                <span className="label">Preferowany klimat</span>
                <span className="value">{z.klimat}</span>
              </div>
            </div>
            
            <div className="card-actions">
              <Link to={`/edytuj/${z.id}`} className="btn-icon btn-edit" title="Edytuj">
                <Edit size={18} />
              </Link>
              <button 
                onClick={() => { setItemToDelete(z.id); setIsModalOpen(true); }}
                className="btn-icon btn-delete" 
                title="Usuń"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ color: '#ef4444', marginBottom: '1rem' }}>
              <Info size={48} style={{ margin: '0 auto' }} />
            </div>
            <h2>Potwierdź usunięcie</h2>
            <p>Czy na pewno chcesz usunąć ten rekord? Tej operacji nie można cofnąć.</p>
            <div className="modal-actions">
              <button onClick={() => setIsModalOpen(false)} className="btn-modal-cancel">Anuluj</button>
              <button onClick={potwierdzUsuniecie} className="btn-modal-confirm">Usuń</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZwierzetaList;