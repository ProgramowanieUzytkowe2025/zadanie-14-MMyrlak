import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from './ToastContext';
import { useLoading } from './LoadingContext';
import { Save, X, PawPrint } from 'lucide-react';

const ZwierzeForm = () => {
  const { id } = useParams(); // Pobieranie ID z URL
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { setIsLoading } = useLoading();
  
  const [errorDetails, setErrorDetails] = useState(null);
  const [formData, setFormData] = useState({
    gatunek: '',
    wiek: 0,
    czy_niebezpieczne: false,
    ilosc: 1,
    klimat: ''
  });

  useEffect(() => {
    if (id) {
      const fetchOne = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`http://127.0.0.1:8000/zwierzeta/${id}`);
          if (!res.ok) throw new Error();
          const data = await res.json();
          setFormData(data);
        } catch (err) {
          showToast("Wystąpił błąd", "error");
          navigate('/');
        } finally {
          setIsLoading(false);
        }
      };
      fetchOne();
    }
  }, [id, navigate, showToast, setIsLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorDetails(null);
    setIsLoading(true);

    const method = id ? 'PUT' : 'POST';
    const url = id ? `http://127.0.0.1:8000/zwierzeta/${id}` : `http://127.0.0.1:8000/zwierzeta/`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showToast("Poprawnie zapisano zmiany", "success");
        navigate('/'); 
      } else {
        const errorData = await response.json();
        setErrorDetails(errorData.detail || "Wystąpił błąd");
        showToast("Wystąpił błąd", "error");
      }
    } catch (err) {
      showToast("Wystąpił błąd", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="content-container">
      <div className="form-wrapper">
        <div className="form-header">
          <div className="form-icon-circle">
            <PawPrint size={24} />
          </div>
          <h2>{id ? "Edycja mieszkańca" : "Nowy mieszkaniec Zoo"}</h2>
          <p>Uzupełnij wymagane informacje o zwierzęciu</p>
        </div>

        {errorDetails && (
          <div className="api-error-banner">
            <strong>Błąd walidacji API:</strong> {errorDetails}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modern-form">
          <div className="form-section">
            <label>Gatunek zwierzęcia</label>
            <input 
              type="text" 
              value={formData.gatunek} 
              onChange={e => setFormData({...formData, gatunek: e.target.value})} 
              placeholder="np. Tygrys Sumatrzański"
              required 
            />
          </div>

          <div className="form-row-grid">
            <div className="form-section">
              <label>Wiek (lata)</label>
              <input 
                type="number" 
                value={formData.wiek} 
                onChange={e => setFormData({...formData, wiek: parseInt(e.target.value) || 0})} 
              />
            </div>
            <div className="form-section">
              <label>Ilość osobników</label>
              <input 
                type="number" 
                value={formData.ilosc} 
                onChange={e => setFormData({...formData, ilosc: parseInt(e.target.value) || 1})} 
              />
            </div>
          </div>

          <div className="form-section">
            <label>Klimat i środowisko</label>
            <input 
              type="text" 
              value={formData.klimat} 
              onChange={e => setFormData({...formData, klimat: e.target.value})} 
              placeholder="np. Wilgotny, tropikalny"
            />
          </div>

          <div className="danger-toggle-card">
            <div className="toggle-info">
              <span className="toggle-title">Status bezpieczeństwa</span>
              <span className="toggle-desc">Czy zwierzę wymaga specjalnych środków ostrożności?</span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={formData.czy_niebezpieczne} 
                onChange={e => setFormData({...formData, czy_niebezpieczne: e.target.checked})} 
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="form-footer-actions">
            <button type="button" onClick={() => navigate('/')} className="btn-cancel">
              <X size={18} /> Anuluj
            </button>
            <button type="submit" className="btn-submit">
              <Save size={18} /> {id ? "Zapisz zmiany" : "Dodaj zwierzę"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ZwierzeForm;