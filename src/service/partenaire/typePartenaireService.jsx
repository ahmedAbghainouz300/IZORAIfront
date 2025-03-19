import axiosClient from "../axiosClient";

const typePartenaireService = {
  // Récupérer tous les types de partenaires
  getAll: () => axiosClient.get("/api/typePartenaires"),
  
  // Récupérer un type de partenaire par son ID
  getById: (id) => axiosClient.get(`/api/typePartenaires/${id}`),
  
  // Créer un nouveau type de partenaire
  create: (data) => axiosClient.post("/api/typePartenaires", data),
  
  // Mettre à jour un type de partenaire existant
  update: (id, data) => axiosClient.put(`/api/typePartenaires/${id}`, data),
  
  // Supprimer un type de partenaire par son ID
  delete: (id) => axiosClient.delete(`/api/typePartenaires/${id}`),

  getAllByNoms: () =>axiosClient.get("/api/typePartenaires/noms"),
  
  getByNom : (nom) => axiosClient.get(`/api/typePartenaires/nom/${nom}`,nom)
};

export default typePartenaireService;
