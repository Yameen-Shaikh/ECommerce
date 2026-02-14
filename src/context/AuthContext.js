import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

const AuthContext = createContext();

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
};

function authReducer(state, action) {
  console.log('AuthReducer - Action:', action.type, 'Payload:', action.payload);
  switch (action.type) {
    case 'USER_LOADED':
      console.log('AuthReducer - USER_LOADED, user:', action.payload);
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      console.log('AuthReducer - LOGIN/REGISTER_SUCCESS, token:', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'AUTH_ERROR':
    case 'REGISTER_FAIL':
    case 'LOGIN_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      console.log('AuthReducer - AUTH_ERROR/FAIL/LOGOUT');
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

  console.log('AuthContext - Current State:', state);

  useEffect(() => {
    console.log('AuthContext - useEffect triggered, calling loadUser()');
    loadUser();
  }, []);

  // Load User
  const loadUser = async () => {
    console.log('loadUser - checking localStorage.token:', localStorage.token);
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    } else {
      dispatch({ type: 'AUTH_ERROR' }); // No token, so not authenticated
      return;
    }

    try {
      console.log('loadUser - making axios.get(/api/auth)');
      const res = await axios.get('/api/auth'); // This route is not yet implemented in backend, need to add it.
      dispatch({
        type: 'USER_LOADED',
        payload: res.data,
      });
    } catch (err) {
      console.error('loadUser - Error loading user:', err.response ? err.response.data : err);
      dispatch({
        type: 'AUTH_ERROR',
      });
    }
  };

  // Register User
  const register = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const res = await axios.post('/api/auth/register', formData, config);
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data,
      });
      loadUser();
    } catch (err) {
      console.error('Register error:', err.response ? err.response.data : err);
      dispatch({
        type: 'REGISTER_FAIL',
      });
    }
  };

  // Login User
  const login = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const res = await axios.post('/api/auth/login', formData, config);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data,
      });
      loadUser();
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err);
      dispatch({
        type: 'LOGIN_FAIL',
      });
    }
  };

  // Logout
  const logout = () => {
    console.log('Logout action dispatched');
    dispatch({ type: 'LOGOUT' });
  };

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
