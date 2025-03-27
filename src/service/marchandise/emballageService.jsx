import axiosClient from "../axiosClient";

const emballageService = {
  // Get all emballages
  getAll: () => axiosClient.get("/api/emballages"),

  // Get emballage by ID
  getById: (id) => axiosClient.get(`/api/emballages/${id}`),

  // Get emballage by name
  getByName: (name) => axiosClient.get(`/api/emballages/nom/${name}`),

  // Create new emballage
  create: (data) => axiosClient.post("/api/emballages", data),

  // Update existing emballage
  update: (id, data) => axiosClient.put(`/api/emballages/${id}`, data),

  // Delete emballage by ID
  delete: (id) => axiosClient.delete(`/api/emballages/${id}`),
};

export default emballageService;
