import axiosClient from "../axiosClient";

const carteGriseService = {
  // Récupérer toutes les cartes grises
  getAll: () => axiosClient.get("/api/cartegrises"),

  // Récupérer une carte grise par son ID
  getById: (id) => axiosClient.get(`/api/cartegrises/${id}`),

  // Ajouter une nouvelle carte grise
  create: (data) => axiosClient.post("/api/cartegrises", data),

  // Mettre à jour une carte grise existante
  update: (id, data) => axiosClient.put(`/api/cartegrises/${id}`, data),

  // Supprimer une carte grise par son ID
  delete: (id) => axiosClient.delete(`/api/cartegrises/${id}`),
};

export default carteGriseService;
