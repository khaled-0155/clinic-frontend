import { apiRequest } from "./axiosInstance";

const API_URL = "packages";

const packagesService = {
  getPackages: () =>
    apiRequest({
      method: "get",
      url: API_URL,
    }),

  getPackagePatients: (id) =>
    apiRequest({
      method: "get",
      url: `${API_URL}/${id}/patients`,
    }),

  assignPatientToPackage: (packageId, payload) =>
    apiRequest({
      method: "post",
      url: `${API_URL}/${packageId}/assign-patient`,
      data: payload,
    }),

  removePatientFromPackage: (id) =>
    apiRequest({
      method: "delete",
      url: `${API_URL}/patient-package/${id}`,
    }),

  getPackageById: (id) =>
    apiRequest({
      method: "get",
      url: `${API_URL}/${id}`,
    }),

  createPackage: (data) =>
    apiRequest({
      method: "post",
      url: API_URL,
      data,
    }),

  updatePackage: (id, data) =>
    apiRequest({
      method: "put",
      url: `${API_URL}/${id}`,
      data,
    }),

  deletePackage: (id) =>
    apiRequest({
      method: "delete",
      url: `${API_URL}/${id}`,
    }),
};

export default packagesService;
