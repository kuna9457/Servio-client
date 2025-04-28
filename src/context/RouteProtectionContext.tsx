'use client';

import { createContext, useContext, ReactNode } from 'react';

interface RouteProtectionContextType {
  isRouteValid: boolean;
  setRouteValid: (valid: boolean) => void;
}

const RouteProtectionContext = createContext<RouteProtectionContextType | undefined>(undefined);

export function RouteProtectionProvider({ children }: { children: ReactNode }) {
  const isRouteValid = true; // Always valid since we're removing route tracking

  const setRouteValid = () => {
    // No-op since we're removing route tracking
  };

  return (
    <RouteProtectionContext.Provider value={{ isRouteValid, setRouteValid }}>
      {children}
    </RouteProtectionContext.Provider>
  );
}

export function useRouteProtection() {
  const context = useContext(RouteProtectionContext);
  if (context === undefined) {
    throw new Error('useRouteProtection must be used within a RouteProtectionProvider');
  }
  return context;
} 