import axiosClient from "../axiosClient";

const demandeCotationService = {
  getAll: () => axiosClient.get("/api/demandes-cotation"),
  
  getById: (id) => axiosClient.get(`/api/demandes-cotation/${id}`),
  
  create: (data) => axiosClient.post("/api/demandes-cotation", data),
  
  update: (id, data) => axiosClient.put(`/api/demandes-cotation/${id}`, data),
  
  delete: (id) => axiosClient.delete(`/api/demandes-cotation/${id}`),
  
  updateStatus: (id, newStatus) => 
    axiosClient.patch(`/api/demandes-cotation/${id}/status?newStatus=${newStatus}`),
  
  getByStatus: (status) => 
    axiosClient.get(`/api/demandes-cotation/by-status?status=${status}`),
  
  searchByTypeMarchandise: (type) => 
    axiosClient.get(`/api/demandes-cotation/search?type=${type}`),
  
  getStatistics: () => axiosClient.get("/api/demandes-cotation/stats"),
  
  assignPhysique: (id, physiqueId) => 
    axiosClient.put(`/api/demandes-cotation/${id}/assign-physique?physiqueId=${physiqueId}`),
  
  updateChargementAddress: (id, newAddress) => 
    axiosClient.put(`/api/demandes-cotation/${id}/chargement-address`, newAddress),
  
  updateDechargementAddress: (id, newAddress) => 
    axiosClient.put(`/api/demandes-cotation/${id}/dechargement-address`, newAddress)
};

export default demandeCotationService;