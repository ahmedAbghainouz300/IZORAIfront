import axiosClient from "../axiosClient";

const physiqueService = {
  getAll: () => axiosClient.get("/api/physiques"),
  getById: (id) => axiosClient.get(`/api/physiques/${id}`),
  update: (id, data) => axiosClient.put(`/api/physiques/${id}`, data),
  create: (data) => axiosClient.post("/api/physiques", data),
  delete: (id) => axiosClient.delete(`/api/physiques/${id}`),
  getAdressesByPartenaire: (id) => axiosClient.get(`/api/physiques/${id}/adresses`),
  addAdresse: (id, data) => axiosClient.post(`/api/physiques/${id}/addAddresses`, data),
  
};

export default physiqueService;
