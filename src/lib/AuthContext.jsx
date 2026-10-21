import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  // Función para verificar autenticación desde localStorage
  const verifyAuthFromStorage = () => {
    console.log('[AuthContext] Verificando autenticación desde localStorage...');
    const token = localStorage.getItem('authToken');
    const userJson = localStorage.getItem('user');

    console.log('[AuthContext] localStorage state:', {
      tokenExists: !!token,
      userJsonExists: !!userJson,
    });

    if (token && userJson) {
      try {
        const userData = JSON.parse(userJson);
        console.log('[AuthContext] Usuario autenticado:', userData);
        setUser(userData);
        setIsAuthenticated(true);
        setAuthError(null);
      } catch (e) {
        console.error('[AuthContext] Error parsing user data:', e);
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      console.log('[AuthContext] No autenticado (faltan token o user)');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    // Verificar autenticación al montar el AuthProvider
    verifyAuthFromStorage();

    // Cargar configuración pública
    setAppPublicSettings({ id: 'local', public_settings: {} });

    // Marcar autenticación como verificada
    setIsLoadingAuth(false);
    setAuthChecked(true);
    console.log('[AuthContext] Estado inicial completado');
  }, []);

  // Escuchar cambios en localStorage desde otras pestañas o desde Login.jsx
  useEffect(() => {
    const handleStorageChange = (e) => {
      console.log('[AuthContext] Storage change detected:', e.key);
      if (e.key === 'authToken' || e.key === 'user' || e.key === null) {
        // null significa que se llamó localStorage.clear()
        verifyAuthFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const checkUserAuth = () => {
    // Función para re-verificar autenticación sin cambiar isLoadingAuth
    verifyAuthFromStorage();
  };

  const logout = (shouldRedirect = true) => {
    // Limpiar localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);

    if (shouldRedirect) {
      window.location.href = '/login';
    }
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        authChecked,
        logout,
        navigateToLogin,
        checkUserAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
