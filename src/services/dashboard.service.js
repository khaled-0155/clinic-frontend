import { apiRequest } from "./axiosInstance";

const API_URL = "dashboard";

const dashboardService = {
  getDashboardStats: (period) =>
    apiRequest({
      method: "get",
      url: `${API_URL}/stats`,
      params: { period },
    }),

  getAppointmentStatistics: (period) =>
    apiRequest({
      method: "get",
      url: `${API_URL}/appointments/statistics`,
      params: { period },
    }),

  getAppointmentsWidget: (period, status) =>
    apiRequest({
      method: "get",
      url: `${API_URL}/appointments/widget`,
      params: { date: period, status },
    }),

  getRecentTransactions: () =>
    apiRequest({
      method: "get",
      url: `${API_URL}/recent-transactions`,
    }),

  getTopDoctors: () =>
    apiRequest({
      method: "get",
      url: `${API_URL}/top-doctors`,
    }),

  getTopPatients: () =>
    apiRequest({
      method: "get",
      url: `${API_URL}/top-patients`,
    }),
};

export default dashboardService;
