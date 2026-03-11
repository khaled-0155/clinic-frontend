import { apiRequest } from "./axiosInstance";

const API_URL = "auth";

export const authService = {
  signIn: (data) =>
    apiRequest({
      method: "post",
      url: `${API_URL}/login`,
      data,
    }),

  requestPasswordReset: (data) =>
    apiRequest({
      method: "post",
      url: `${API_URL}/request-reset`,
      data,
    }),

  resetPassword: (data) => {
    return apiRequest({
      method: "post",
      url: `${API_URL}/reset-password`,
      data: data,
    });
  },

  getProfile: () =>
    apiRequest({
      method: "get",
      url: `${API_URL}/me`,
    }),

  acceptInvite: (data) =>
    apiRequest({
      method: "post",
      url: `${API_URL}/accept-invite`,
      data,
    }),
};
