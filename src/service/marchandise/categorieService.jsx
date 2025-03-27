import axiosClient from "../axiosClient";

const categorieService = {
  // Get all categories
  getAll: () => axiosClient.get("/api/categories"),

  // Get category by ID
  getById: (id) => axiosClient.get(`/api/categories/${id}`),

  // Get category by name
  getByName: (name) => axiosClient.get(`/api/categories/nom/${name}`),

  // Create new category
  create: (data) => axiosClient.post("/api/categories", data),

  // Update existing category
  update: (id, data) => axiosClient.put(`/api/categories/${id}`, data),

  // Delete category by ID
  delete: (id) => axiosClient.delete(`/api/categories/${id}`),
};

export default categorieService;
