import { apiRequest } from "./axiosInstance";

const API_URL = "users";

const usersService = {
  getUsers: (params) =>
    apiRequest({
      method: "get",
      url: API_URL,
      params,
    }),

  getUserById: (id) =>
    apiRequest({
      method: "get",
      url: `${API_URL}/${id}`,
    }),
  createUserLocal: (data) =>
    apiRequest({
      method: "post",
      url: `${API_URL}/direct`,
      data,
    }),

  createUserInvite: (data) =>
    apiRequest({
      method: "post",
      url: `${API_URL}/invite`,
      data,
    }),

  toggleUserStatus: (id) =>
    apiRequest({
      method: "patch",
      url: `users/${id}/toggle-status`,
    }),

  deleteUser: (id) =>
    apiRequest({
      method: "delete",
      url: `users/${id}`,
    }),

  updateUser: (id, data) =>
    apiRequest({
      method: "put",
      url: `${API_URL}/${id}`,
      data,
    }),
};

export default usersService;
