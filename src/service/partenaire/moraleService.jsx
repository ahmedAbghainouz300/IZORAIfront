import axiosClient from "../axiosClient";

const moraleService = {
  // Récupérer toutes les personnes morales
  getAll: () => axiosClient.get("/morales"),
  
  // Récupérer une personne morale par son ID
  getById: (id) => axiosClient.get(`/morales/${id}`),
  
  // Créer une nouvelle personne morale
  create: (data) => axiosClient.post("/morales", data),
  
  // Mettre à jour une personne morale existante
  update: (id, data) => axiosClient.put(`/morales/${id}`, data),
  
  // Supprimer une personne morale par son ID
  delete: (id) => axiosClient.delete(`/morales/${id}`),
};

export default moraleService;
