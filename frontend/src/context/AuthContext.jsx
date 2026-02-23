import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('unigo_user');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  // Global axios interceptor — if ANY API call returns 401,
  // the stored token is stale (e.g. user not in new DB).
  // Auto-clear localStorage so the user sees a clean login page.
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear stale session
          setUser(null);
          localStorage.removeItem('unigo_user');
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`, { email, password });
      setUser(data);
      localStorage.setItem('unigo_user', JSON.stringify(data));
    } catch (err) {
      console.error('LOGIN ERROR:', err.response?.data || err.message);
      throw err;
    }
  };

  const signup = async (name, email, password, role) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/signup`, { name, email, password, role });
      setUser(data);
      localStorage.setItem('unigo_user', JSON.stringify(data));
    } catch (err) {
      console.error('SIGNUP ERROR:', err.response?.data || err.message);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('unigo_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
