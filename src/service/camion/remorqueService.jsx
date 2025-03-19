import axiosClient from "../axiosClient";

const remorqueService = {
  // Récupérer toutes les remorques
  getAll: () => axiosClient.get("/api/remorques"),

  // Récupérer une remorque par son immatriculation
  getById: (idRemorque) => axiosClient.get(`/api/remorques/${idRemorque}`),

  // Ajouter une nouvelle remorque
  create: (data) => axiosClient.post("/api/remorques", data),

  // Mettre à jour une remorque existante
  update: (idRemorque, data) =>
    axiosClient.put(`/api/remorques/${idRemorque}`, data),

  // Supprimer une remorque par son immatriculation
  delete: (idRemorque) => axiosClient.delete(`/api/remorques/${idRemorque}`),

  // Récupérer les remorques disponibles
  getDisponibles: () => axiosClient.get("/api/remorques/disponibles"),
};

export default remorqueService;
