import axiosClient from "../axiosClient";

const adressService = {
  // Récupérer toutes les adresses
  getAll: () => axiosClient.get("/api/adresses"),
  
  // Récupérer une adresse par son ID
  getById: (id) => axiosClient.get(`/api/adresses/${id}`),
  
  // Créer une nouvelle adresse
  create: (data) => axiosClient.post("/api/adresses", data),
  
  // Mettre à jour une adresse existante
  update: (id, data) => axiosClient.put(`/api/adresses/${id}`, data),
  
  // Supprimer une adresse par son ID
  delete: (id) => axiosClient.delete(`/api/adresses/${id}`),
};

export default adressService;
