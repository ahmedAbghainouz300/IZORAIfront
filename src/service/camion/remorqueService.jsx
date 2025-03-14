import axiosClient from "../axiosClient";

const remorqueService = {
  // Récupérer toutes les remorques
  getAll: () => axiosClient.get("/api/remorques"),

  // Récupérer une remorque par son immatriculation
  getById: (immatriculation) => axiosClient.get(`/api/remorques/${idRemorque}`),

  // Ajouter une nouvelle remorque
  create: (data) => axiosClient.post("/api/remorques", data),

  // Mettre à jour une remorque existante
  update: (immatriculation, data) => axiosClient.put(`/api/remorques/${idRemorque}`, data),

  // Supprimer une remorque par son immatriculation
  delete: (immatriculation) => axiosClient.delete(`/api/remorques/${idRemorque}`),

  // Récupérer les remorques disponibles
  getDisponibles: () => axiosClient.get("/api/remorques/disponibles"),
};

export default remorqueService;
