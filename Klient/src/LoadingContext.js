import React, { createContext, useState, useContext } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ setIsLoading }}>
      {children}
      {isLoading && (
        <div className="loader-overlay">
          <div className="loader-content">
            <div className="spinner"></div>
            <span>wczytywanie…</span>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);