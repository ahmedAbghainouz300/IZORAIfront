import axiosClient from "../axiosClient";

const TypeRemorqueService = {
  // Récupérer tous les types de remorques
  getAll: () => axiosClient.get("/api/typeRemorques"),

  // Récupérer un type de remorque par son ID
  getById: (id) => axiosClient.get(`/api/typeRemorques/${id}`),

  // Ajouter un nouveau type de remorque
  create: (data) => axiosClient.post("/api/typeRemorques", data),

  // Mettre à jour un type de remorque existant
  update: (id, data) => axiosClient.put(`/api/typeRemorques/${id}`, data),

  // Supprimer un type de remorque par son ID
  delete: (id) => axiosClient.delete(`/api/typeRemorques/${id}`),

  // Récupérer les types de remorques disponibles (si applicable)
  getDisponibles: () => axiosClient.get("/api/typeRemorques/disponibles"),
};

export default TypeRemorqueService;
