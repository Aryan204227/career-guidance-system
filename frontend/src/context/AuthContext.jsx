import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const profile = localStorage.getItem('profile');
    if (profile) {
      try {
        setUser(JSON.parse(profile));
      } catch (e) {
        console.error('Failed to parse profile from localStorage', e);
        localStorage.removeItem('profile');
      }
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    localStorage.setItem('profile', JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('profile');
    setUser(null);
  };

  const value = useMemo(() => ({ user, setUser, login, logout, loading }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
