import axiosClient from "../axiosClient";

const adressService = {
  // Récupérer toutes les adresses
  getAll: () => axiosClient.get("/adresses"),
  
  // Récupérer une adresse par son ID
  getById: (id) => axiosClient.get(`/adresses/${id}`),
  
  // Créer une nouvelle adresse
  create: (data) => axiosClient.post("/adresses", data),
  
  // Mettre à jour une adresse existante
  update: (id, data) => axiosClient.put(`/adresses/${id}`, data),
  
  // Supprimer une adresse par son ID
  delete: (id) => axiosClient.delete(`/adresses/${id}`),
};

export default adressService;
