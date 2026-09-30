import React, { createContext, useState, useContext, useEffect } from "react";
import { getToken, getTokenExpiry, clearToken } from "@/lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const checkUserAuth = () => {
    const token = getToken();
    const valid = !!token && getTokenExpiry() > Date.now();

    if (token && !valid) clearToken(); // expired token

    setIsAuthenticated(valid);
    setUser(valid ? { role: "admin" } : null);
    setIsLoadingAuth(false);
    setAuthChecked(true);
  };

  useEffect(() => {
    checkUserAuth();
  }, []);

  const logout = (shouldRedirect = true) => {
    clearToken();
    setUser(null);
    setIsAuthenticated(false);
    if (shouldRedirect) window.location.href = "/admin/login";
  };

  const navigateToLogin = () => {
    window.location.href = "/admin/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings: false,
        authError: null,
        appPublicSettings: null,
        authChecked,
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState: checkUserAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};