import axiosClient from "../axiosClient";

const typeCarburantService = {
  // Récupérer tous les types de carburant
  getAll: () => axiosClient.get("/api/typeCarburants"),

  // Récupérer un type de carburant par son ID
  getById: (id) => axiosClient.get(`/api/typeCarburants/${id}`),

  // Ajouter un nouveau type de carburant
  create: (data) => axiosClient.post("/api/typeCarburants", data),

  // Mettre à jour un type de carburant existant
  update: (id, data) => axiosClient.put(`/api/typeCarburants/${id}`, data),

  // Supprimer un type de carburant par son ID
  delete: (id) => axiosClient.delete(`/api/typeCarburants/${id}`),

  // Récupérer les types de carburant disponibles (si applicable)
  getDisponibles: () => axiosClient.get("/api/typeCarburants/disponibles"),
};

export default typeCarburantService;
