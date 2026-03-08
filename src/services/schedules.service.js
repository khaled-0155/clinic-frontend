import { apiRequest } from "./axiosInstance";

const API_URL = "schedules";

const schedulesService = {
  getSchedules: (doctorId, branchId) =>
    apiRequest({
      method: "get",
      url: API_URL,
      params: { doctorId, branchId },
    }),

  create: (data) =>
    apiRequest({
      method: "post",
      url: API_URL,
      data,
    }),

  updateSchedules: (id, data) =>
    apiRequest({
      method: "put",
      url: `${API_URL}/${id}`,
      data,
    }),

  remove: (id) =>
    apiRequest({
      method: "delete",
      url: `${API_URL}/${id}`,
    }),
};

export default schedulesService;
