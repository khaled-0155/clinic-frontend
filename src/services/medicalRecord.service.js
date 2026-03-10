import { apiRequest } from "./axiosInstance";

const API_URL = "medical-records";

const medicalRecordService = {
  // Create medical record
  createMedicalRecord: (data) =>
    apiRequest({
      method: "post",
      url: API_URL,
      data,
    }),

  // Get all records for a patient
  getPatientMedicalRecords: (patientId, page = 1, limit = 5) =>
    apiRequest({
      method: "get",
      url: `${API_URL}/patient/${patientId}`,
      params: { page, limit },
    }),

  // Get single record
  getMedicalRecord: (id) =>
    apiRequest({
      method: "get",
      url: `${API_URL}/${id}`,
    }),

  // Update record
  updateMedicalRecord: (id, data) =>
    apiRequest({
      method: "put",
      url: `${API_URL}/${id}`,
      data,
    }),

  // Delete record
  deleteMedicalRecord: (id) =>
    apiRequest({
      method: "delete",
      url: `${API_URL}/${id}`,
    }),
};

export default medicalRecordService;
