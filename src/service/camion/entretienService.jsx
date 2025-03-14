import axiosClient from "../axiosClient";

const entretienService = {
  // Récupérer toutes les entrées d'entretien
  getAll: () => axiosClient.get("/api/entretiens"),

  // Récupérer une entrée d'entretien par son ID
  getById: (id) => axiosClient.get(`/api/entretiens/${id}`),

  // Créer une nouvelle entrée d'entretien
  create: (data) => axiosClient.post("/api/entretiens", data),

  // Mettre à jour une entrée d'entretien existante
  update: (id, data) => axiosClient.put(`/api/entretiens/${id}`, data),

  // Supprimer une entrée d'entretien par son ID
  delete: (id) => axiosClient.delete(`/api/entretiens/${id}`),

  // Récupérer les entretiens d'un camion par immatriculation
  getByCamion: (immatriculation) =>
    axiosClient.get(`/api/entretiens/camion/${immatriculation}`),

  // Récupérer les entretiens dans un intervalle de dates
  getByDateRange: (debut, fin) =>
    axiosClient.get("/api/entretiens/date-range", {
      params: { debut, fin },
    }),

  // Récupérer les entretiens par type
  getByType: (typeEntretien) =>
    axiosClient.get(`/api/entretiens/type/${typeEntretien}`),

  // Récupérer le coût total des entretiens d'un camion
  getCoutTotalByCamion: (immatriculation) =>
    axiosClient.get(`/api/entretiens/cout/camion/${immatriculation}`),

  // Récupérer le coût total des entretiens dans une période donnée
  getCoutTotalByPeriode: (debut, fin) =>
    axiosClient.get("/api/entretiens/cout/periode", {
      params: { debut, fin },
    }),

  // Calculer le coût total des entretiens d'un camion
  calculateCout: (immatriculation) =>
    axiosClient.get(`/api/entretiens/cout/camion/${immatriculation}/calculate`),
};

export default entretienService;
