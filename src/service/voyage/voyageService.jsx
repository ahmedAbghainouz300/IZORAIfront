import axiosClient from "../axiosClient";

const voyageService = {
  // Get all voyages
  getAll: () => axiosClient.get("/api/voyages"),

  // Get voyage by ID
  getById: (id) => axiosClient.get(`/api/voyages/${id}`),

  // Get voyage by reference
  getByReference: (reference) =>
    axiosClient.get(`/api/voyages/reference/${reference}`),

  // Get voyages by date range
  getByDateRange: (start, end) =>
    axiosClient.get("/api/voyages/periode", {
      params: { start, end },
    }),

  // Get voyages by status
  getByStatus: (status) => axiosClient.get(`/api/voyages/statut/${status}`),

  // Create new voyage
  create: (data) => axiosClient.post("/api/voyages", data),

  // Update existing voyage
  update: (id, data) => axiosClient.put(`/api/voyages/${id}`, data),

  // Delete voyage by ID
  delete: (id) => axiosClient.delete(`/api/voyages/${id}`),
};

export default voyageService;
