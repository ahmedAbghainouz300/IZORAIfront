import axiosClient from "../axiosClient";

const partenaireService = {
  // Créer un nouveau partenaire
  create: (data) => axiosClient.post("/api/partenaires", data),
  
  // Récupérer un partenaire par son ID
  getById: (id) => axiosClient.get(`/api/partenaires/${id}`),
  
  // Supprimer un partenaire par son ID
  delete: (id) => axiosClient.delete(`/api/partenaires/${id}`),
};

export default partenaireService;
