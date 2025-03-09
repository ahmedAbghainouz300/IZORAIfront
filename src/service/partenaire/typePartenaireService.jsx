import axiosClient from "../axiosClient";

const typePartenaireService = {
  // Récupérer tous les types de partenaires
  getAll: () => axiosClient.get("/typePartenaires"),
  
  // Récupérer un type de partenaire par son ID
  getById: (id) => axiosClient.get(`/typePartenaires/${id}`),
  
  // Créer un nouveau type de partenaire
  create: (data) => axiosClient.post("/typePartenaires", data),
  
  // Mettre à jour un type de partenaire existant
  update: (id, data) => axiosClient.put(`/typePartenaires/${id}`, data),
  
  // Supprimer un type de partenaire par son ID
  delete: (id) => axiosClient.delete(`/typePartenaires/${id}`),
};

export default typePartenaireService;
