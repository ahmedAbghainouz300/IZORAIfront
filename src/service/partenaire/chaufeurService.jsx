import axiosClient from "../axiosClient";

const chaufeurService = {
  // Créer un nouveau chauffeur
  create: (data) => axiosClient.post("/api/chauffeurs", data),
  
  // Récupérer un chauffeur par son ID
  getById: (id) => axiosClient.get(`/api/chauffeurs/${id}`),
  
  // Récupérer tous les chauffeurs
  getAll: () => axiosClient.get("/api/chauffeurs"),
  
  // Mettre à jour un chauffeur
  update: (id, data) => axiosClient.put(`/api/chauffeurs/${id}`, data),
  
  // Supprimer un chauffeur par son ID
  delete: (id) => axiosClient.delete(`/api/chauffeurs/${id}`),
};

export default chaufeurService;
