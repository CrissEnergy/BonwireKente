
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminAuthContextType {
  isAdmin: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedAuth = sessionStorage.getItem('isAdminAuthenticated');
      if (storedAuth === 'true') {
        setIsAdmin(true);
      }
    } catch (error) {
        console.error("Could not access session storage:", error);
    }
    setIsLoading(false);
  }, []);

  const login = () => {
    try {
        sessionStorage.setItem('isAdminAuthenticated', 'true');
    } catch (error) {
         console.error("Could not access session storage:", error);
    }
    setIsAdmin(true);
  };

  const logout = () => {
    try {
        sessionStorage.removeItem('isAdminAuthenticated');
    } catch (error) {
        console.error("Could not access session storage:", error);
    }
    setIsAdmin(false);
  };

  const value = { isAdmin, isLoading, login, logout };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
