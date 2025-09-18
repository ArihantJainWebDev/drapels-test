"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SpotlightContextType {
  isSpotlightEnabled: boolean;
  toggleSpotlight: () => void;
  setSpotlightEnabled: (enabled: boolean) => void;
  spotlightSize: number;
  setSpotlightSize: (size: number) => void;
}

const SpotlightContext = createContext<SpotlightContextType | undefined>(undefined);

export const useSpotlight = () => {
  const context = useContext(SpotlightContext);
  if (context === undefined) {
    throw new Error('useSpotlight must be used within a SpotlightProvider');
  }
  return context;
};

interface SpotlightProviderProps {
  children: ReactNode;
}

export const SpotlightProvider: React.FC<SpotlightProviderProps> = ({ children }) => {
  const [isSpotlightEnabled, setIsSpotlightEnabled] = useState(false);
  const [spotlightSize, setSpotlightSize] = useState(150);

  const toggleSpotlight = () => {
    setIsSpotlightEnabled(prev => !prev);
  };

  const setSpotlightEnabled = (enabled: boolean) => {
    setIsSpotlightEnabled(enabled);
  };

  const value = {
    isSpotlightEnabled,
    toggleSpotlight,
    setSpotlightEnabled,
    spotlightSize,
    setSpotlightSize,
  };

  return (
    <SpotlightContext.Provider value={value}>
      {children}
    </SpotlightContext.Provider>
  );
};
