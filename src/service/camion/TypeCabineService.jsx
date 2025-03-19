import axiosClient from "../axiosClient";

const TypeCabineService = {
  // Récupérer tous les types de cabine
  getAll: () => axiosClient.get("/api/typeCamions"),

  // Récupérer un type de cabine par son ID
  getById: (id) => axiosClient.get(`/api/typeCamions/${id}`),

  // Ajouter un nouveau type de cabine
  create: (data) => axiosClient.post("/api/typeCamions", data),

  // Mettre à jour un type de cabine existant
  update: (id, data) => axiosClient.put(`/api/typeCamions/${id}`, data),

  // Supprimer un type de cabine par son ID
  delete: (id) => axiosClient.delete(`/api/typeCamions/${id}`),

  // Récupérer les types de cabine disponibles (si applicable)
  getDisponibles: () => axiosClient.get("/api/typeCamions/disponibles"),
};

export default TypeCabineService;
