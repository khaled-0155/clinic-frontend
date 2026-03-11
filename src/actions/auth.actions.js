import { authService } from "../services/auth.service";

/* =========================
   SIGN IN
========================= */
export const signIn = async (credentials) => {
  const data = await authService.signIn(credentials);
  if (data?.token) {
    localStorage.setItem("accessToken", data.token);
  }
  return data;
};

/* =========================
   REQUEST PASSWORD RESET
========================= */
export const requestPasswordReset = async (payload) => {
  return authService.requestPasswordReset(payload);
};

/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = async (payload) => {
  return authService.resetPassword(payload);
};

/* =========================
   REFRESH TOKEN
========================= */
export const refreshToken = async () => {
  const refreshTokenValue = localStorage.getItem("refreshToken");

  if (!refreshTokenValue) {
    throw new Error("No refresh token found");
  }

  const data = await authService.refreshToken(refreshTokenValue);

  if (data?.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
  }

  return data;
};

/* =========================
   GET PROFILE
========================= */
export const getProfile = async () => {
  return authService.getProfile();
};

/* =========================
   LOGOUT
========================= */
export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
};

export const acceptInvite = async (payload) => {
  return authService.acceptInvite(payload);
};
