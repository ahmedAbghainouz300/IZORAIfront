import axiosClient from "../axiosClient";

const uniteService = {
  // Get all unites
  getAll: () => axiosClient.get("/api/unites"),

  // Get unite by ID
  getById: (id) => axiosClient.get(`/api/unites/${id}`),

  // Get unite by name
  getByName: (name) => axiosClient.get(`/api/unites/nom/${name}`),

  // Create new unite
  create: (data) => axiosClient.post("/api/unites", data),

  // Update existing unite
  update: (id, data) => axiosClient.put(`/api/unites/${id}`, data),

  // Delete unite by ID
  delete: (id) => axiosClient.delete(`/api/unites/${id}`),
};

export default uniteService;
