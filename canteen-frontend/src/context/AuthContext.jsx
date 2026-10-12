import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('canteen_user');
    const token = localStorage.getItem('canteen_token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const data = response.data;
    localStorage.setItem('canteen_token', data.token);
    localStorage.setItem('canteen_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, email, password, role) => {
    const response = await api.post('/auth/register', { name, email, password, role });
    const data = response.data;
    localStorage.setItem('canteen_token', data.token);
    localStorage.setItem('canteen_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('canteen_token');
    localStorage.removeItem('canteen_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isStaff: user?.role === 'ROLE_STAFF',
        isStudent: user?.role === 'ROLE_STUDENT',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
