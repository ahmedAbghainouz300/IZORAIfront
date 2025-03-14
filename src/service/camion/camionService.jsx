import axiosClient from "../axiosClient";

const camionService = {
  // Récupérer tous les camions
  getAll: () => axiosClient.get("/api/camions"),

  // Récupérer un camion par son immatriculation
  getById: (immatriculation) => axiosClient.get(`/api/camions/${immatriculation}`),

  // Créer un nouveau camion
  create: (data) => axiosClient.post("/api/camions", data),

  // Mettre à jour un camion existant
  update: (immatriculation, data) => axiosClient.put(`/api/camions/${immatriculation}`, data),

  // Supprimer un camion par son immatriculation
  delete: (immatriculation) => axiosClient.delete(`/api/camions/${immatriculation}`),
};

export default camionService;
