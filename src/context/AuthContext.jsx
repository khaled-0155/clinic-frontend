import { createContext, useEffect, useState } from "react";
import {
  getProfile,
  logout as logoutAction,
  signIn,
} from "../actions/auth.actions";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH PROFILE
  ========================= */
  const fetchProfile = async () => {
    let data = null;

    try {
      data = await getProfile();
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }

    return data;
  };

  /* =========================
     INITIAL LOAD
  ========================= */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  /* =========================
     LOGIN
  ========================= */
  const login = async (credentials) => {
    await signIn(credentials);
    const data = await fetchProfile();
    return data;
  };

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    logoutAction(); // removes tokens + redirect
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
