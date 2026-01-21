import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ZwierzetaList from './ZwierzetaList';
import ZwierzeForm from './ZwierzeForm';
import { LoadingProvider } from './LoadingContext';
import { ToastProvider } from './ToastContext';
import './App.css';

function App() {
  return (
    <LoadingProvider>
      <ToastProvider>
        <Router>
        <div className="app-wrapper">
          <nav className="main-nav">
            <div className="nav-container">
              <Link to="/" className="logo">
                <span>🦁</span> Zoo Manager
              </Link>
            </div>
          </nav>

          <main>
            <Routes>
              <Route path="/" element={<ZwierzetaList />} />
              <Route path="/dodaj" element={<ZwierzeForm />} />
              <Route path="/edytuj/:id" element={<ZwierzeForm />} />
            </Routes>
          </main>
        </div>
      </Router>
      </ToastProvider>
    </LoadingProvider>
  );
}

export default App;