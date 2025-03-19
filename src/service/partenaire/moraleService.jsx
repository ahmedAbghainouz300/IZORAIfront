import axiosClient from "../axiosClient";

const moraleService = {
  // Récupérer toutes les personnes morales
  getAll: () => axiosClient.get("/api/morales"),
  
  // Récupérer une personne morale par son ID
  getById: (id) => axiosClient.get(`/api/morales/${id}`),
  
  // Créer une nouvelle personne morale
  create: (data) => axiosClient.post("/api/morales", data),
  
  // Mettre à jour une personne morale existante
  update: (id, data) => axiosClient.put(`/api/morales/${id}`, data),
  
  // Supprimer une personne morale par son ID
  delete: (id) => axiosClient.delete(`/api/morales/${id}`),

  getAdressesByPartenaire:(id)=>axiosClient.get(`/api/morales/${id}/addresses`),

  addAdresse:(id,data)=>axiosClient.post(`/api/morales/${id}/addAddresses`,data),
};

export default moraleService;