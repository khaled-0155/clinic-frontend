import { apiRequest } from "./axiosInstance";

const API_URL = "branches";

const branchesService = {
  getBranches: () =>
    apiRequest({
      method: "get",
      url: API_URL,
    }),

  createBranch: (data) =>
    apiRequest({
      method: "post",
      url: API_URL,
      data,
    }),

  updateBranch: (id, data) =>
    apiRequest({
      method: "put",
      url: `${API_URL}/${id}`,
      data,
    }),

  deleteBranch: (id) =>
    apiRequest({
      method: "delete",
      url: `${API_URL}/${id}`,
    }),
};

export default branchesService;
