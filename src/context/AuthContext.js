import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import api from '../utils/api';
import setAuthToken from '../utils/setAuthToken';

const AuthContext = createContext();

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        loading: false,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case 'AUTH_ERROR':
    case 'REGISTER_FAIL':
    case 'LOGIN_FAIL':
    case 'LOGOUT':
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load User
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    console.log('loadUser called, token from localStorage:', token);
    
    if (token) {
      setAuthToken(token);
    } else {
      console.log('No token found, dispatching AUTH_ERROR');
      dispatch({ type: 'AUTH_ERROR' });
      return;
    }

    try {
      console.log('Fetching user profile...');
      const res = await api.get('/api/auth');
      console.log('User profile fetched successfully:', res.data);
      dispatch({
        type: 'USER_LOADED',
        payload: res.data,
      });
    } catch (err) {
      console.error('loadUser - Error loading user:', err.response ? err.response.data : err);
      localStorage.removeItem('token');
      setAuthToken(null);
      dispatch({
        type: 'AUTH_ERROR',
      });
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Register User
  const register = useCallback(async (formData) => {
    try {
      console.log('Registering user...', formData);
      await api.post('/api/auth/register', formData);
      dispatch({
        type: 'REGISTER_SUCCESS',
      });
      return true;
    } catch (err) {
      console.error('Register error:', err.response ? err.response.data : err);
      alert(err.response?.data?.message || 'Registration failed');
      dispatch({
        type: 'REGISTER_FAIL',
      });
      return false;
    }
  }, []);

  // Login User
  const login = useCallback(async (formData) => {
    try {
      console.log('Logging in user...', formData.email);
      const res = await api.post('/api/auth/login', formData);
      console.log('Login response received:', res.data.username);
      
      // SET TOKEN MANUALLY BEFORE DISPATCH/LOADUSER
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data,
      });

      // After login success, load user to confirm profile
      await loadUser();
      return true;
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err);
      alert(err.response?.data?.message || 'Login failed');
      localStorage.removeItem('token');
      setAuthToken(null);
      dispatch({
        type: 'LOGIN_FAIL',
      });
      return false;
    }
  }, [loadUser]);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthToken(null);
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
