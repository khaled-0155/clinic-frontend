import { apiRequest } from "./axiosInstance";

const API_URL = "transactions";

const transactionsService = {
  getTransactions: (filters) =>
    apiRequest({
      method: "get",
      url: API_URL,
      params: filters,
    }),

  getTransactionById: (id) =>
    apiRequest({
      method: "get",
      url: `${API_URL}/${id}`,
    }),

  createTransaction: (data) =>
    apiRequest({
      method: "post",
      url: API_URL,
      data,
    }),
};

export default transactionsService;
