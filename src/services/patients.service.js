import { apiRequest } from "./axiosInstance";

const API_URL = "patients";

const patientsService = {
  // --------------------------------
  // Patients CRUD
  // --------------------------------

  getPatients: (params) =>
    apiRequest({
      method: "get",
      url: API_URL,
      params,
    }),

  getPatient: (id) =>
    apiRequest({
      method: "get",
      url: `${API_URL}/${id}`,
    }),

  createPatient: (data) =>
    apiRequest({
      method: "post",
      url: API_URL,
      data,
    }),

  updatePatient: (id, data) =>
    apiRequest({
      method: "put",
      url: `${API_URL}/${id}`,
      data,
    }),

  deletePatient: (id) =>
    apiRequest({
      method: "delete",
      url: `${API_URL}/${id}`,
    }),

  // --------------------------------
  // Patient Appointments
  // --------------------------------

  getPatientAppointments: (patientId, params) =>
    apiRequest({
      method: "get",
      url: `${API_URL}/${patientId}/appointments`,
      params,
    }),

  // --------------------------------
  // Patient Packages
  // --------------------------------

  getPatientPackages: (patientId) =>
    apiRequest({
      method: "get",
      url: `${API_URL}/${patientId}/packages`,
    }),

  // --------------------------------
  // Patient Sessions
  // --------------------------------

  getPatientSessions: (patientId, params) =>
    apiRequest({
      method: "get",
      url: `${API_URL}/${patientId}/sessions`,
      params,
    }),

  // --------------------------------
  // Patient Notes
  // --------------------------------

  getNotes: (patientId) =>
    apiRequest({
      method: "get",
      url: `${API_URL}/${patientId}/notes`,
    }),

  addNote: (patientId, data) =>
    apiRequest({
      method: "post",
      url: `${API_URL}/${patientId}/notes`,
      data,
    }),

  deleteNote: (noteId) =>
    apiRequest({
      method: "delete",
      url: `${API_URL}/notes/${noteId}`,
    }),
};

export default patientsService;
