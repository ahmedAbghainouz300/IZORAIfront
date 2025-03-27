import axiosClient from "../axiosClient";

const marchandiseService = {
  // Get all marchandises
  getAll: () => axiosClient.get("/api/marchandises"),

  // Get marchandise by ID
  getById: (id) => axiosClient.get(`/api/marchandises/${id}`),

  // Get marchandise by code
  getByCode: (code) => axiosClient.get(`/api/marchandises/code/${code}`),

  // Create new marchandise
  create: (data) => axiosClient.post("/api/marchandises", data),

  // Update existing marchandise
  update: (id, data) => axiosClient.put(`/api/marchandises/${id}`, data),

  // Delete marchandise by ID
  delete: (id) => axiosClient.delete(`/api/marchandises/${id}`),
};

export default marchandiseService;
