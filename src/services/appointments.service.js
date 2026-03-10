import { apiRequest } from "./axiosInstance";

const API_URL = "appointments";

const appointmentsService = {
  getAppointments: (params) =>
    apiRequest({
      method: "get",
      url: API_URL,
      params,
    }),

  getAppointmentById: (id) =>
    apiRequest({
      method: "get",
      url: `${API_URL}/${id}`,
    }),

  getSlots: (params) =>
    apiRequest({
      method: "get",
      url: `${API_URL}/slots`,
      params,
    }),

  createAppointment: (data) =>
    apiRequest({
      method: "post",
      url: API_URL,
      data,
    }),

  updateAppointment: (id, data) =>
    apiRequest({
      method: "put",
      url: `${API_URL}/${id}`,
      data,
    }),

  updateStatus: (id, data) =>
    apiRequest({
      method: "put",
      url: `${API_URL}/${id}/status`,
      data: data,
    }),

  deleteAppointment: (id) =>
    apiRequest({
      method: "delete",
      url: `${API_URL}/${id}`,
    }),

  getProgress: (appointmentId) =>
    apiRequest({
      method: "get",
      url: `${API_URL}/${appointmentId}/progress`,
    }),

  addProgress: (appointmentId, data) =>
    apiRequest({
      method: "post",
      url: `${API_URL}/${appointmentId}/progress`,
      data,
    }),

  updateProgress: (appointmentId, data) =>
    apiRequest({
      method: "patch",
      url: `${API_URL}/${appointmentId}/progress`,
      data,
    }),
};

export default appointmentsService;
