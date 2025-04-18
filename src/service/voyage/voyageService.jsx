import axiosClient from "../axiosClient";

const voyageService = {
  // Get all voyages
  getAll: () => axiosClient.get("/api/voyages"),

  // Get voyage by ID
  getById: (id) => axiosClient.get(`/api/voyages/${id}`),

  // Search voyages by reference
  searchByReference: (reference) =>
    axiosClient.get("/api/voyages/search", {
      params: { reference },
    }),

  // Get voyages by date range (accepts string dates)
  getByDateRange: (startDate, endDate) =>
    axiosClient.get("/api/voyages/periode", {
      params: { start: startDate, end: endDate },
    }),

  // Get voyages by status
  getByStatus: (status) => axiosClient.get(`/api/voyages/statut/${status}`),

  // Create new voyage
  create: (voyageData) => axiosClient.post("/api/voyages", voyageData),

  // Update existing voyage
  update: (id, voyageData) => axiosClient.put(`/api/voyages/${id}`, voyageData),

  // Update voyage status
  updateStatus: (id, newStatus) =>
    axiosClient.put(`/api/voyages/${id}/statut`, null, {
      params: { newStatus },
    }),

  // Delete voyage by ID
  delete: (id) => axiosClient.delete(`/api/voyages/${id}`),

  // Assign resources to voyage
  assignChauffeur: (voyageId, chauffeurId) =>
    axiosClient.put(`/api/voyages/${voyageId}/chauffeur/${chauffeurId}`),

  assignCamion: (voyageId, camionId) =>
    axiosClient.put(`/api/voyages/${voyageId}/camion/${camionId}`),

  assignRemorque: (voyageId, remorqueId) =>
    axiosClient.put(`/api/voyages/${voyageId}/remorque/${remorqueId}`),

  // Get voyage statistics
  getStatistics: () => axiosClient.get("/api/voyages/statistics"),

  changeEtat: (voyageEtatDTO) =>
    axiosClient.put("/api/voyages/changeEtat", voyageEtatDTO),

  checkWarnings: (voyageId) =>
    axiosClient.get(`/api/voyages/warnings/${voyageId}`),
};

export default voyageService;
