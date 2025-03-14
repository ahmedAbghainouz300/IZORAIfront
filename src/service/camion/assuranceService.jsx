import axiosClient from "../axiosClient";

const assuranceService = {
  // Récupérer toutes les assurances
  getAll: () => axiosClient.get("/api/assurances"),

  // Récupérer une assurance par son numéro de contrat
  getById: (numeroContrat) => axiosClient.get(`/api/assurances/${numeroContrat}`),

  // Créer une nouvelle assurance
  create: (data) => axiosClient.post("/api/assurances", data),

  // Mettre à jour une assurance existante
  update: (numeroContrat, data) => axiosClient.put(`/api/assurances/${numeroContrat}`, data),

  // Supprimer une assurance par son numéro de contrat
  delete: (numeroContrat) => axiosClient.delete(`/api/assurances/${numeroContrat}`),

  // Récupérer l'assurance associée à un camion en fonction de son immatriculation
  getByCamion: (immatriculation) => axiosClient.get(`/api/assurances/camion/${immatriculation}`),

  // Renouveler une assurance avec une nouvelle date
  renouveler: (numeroContrat, nouvelleDate) =>
    axiosClient.put(`/api/assurances/${numeroContrat}/renouveler`, null, {
      params: { nouvelleDate },
    }),

  // Récupérer le total des primes annuelles des assurances actives
  getTotalPrimesAnnuelles: () => axiosClient.get("/api/assurances/total-primes-annuelles"),

  // Vérifier l'expiration des assurances et envoyer des alertes
  checkExpiration: () => axiosClient.get("/api/assurances/check-expiration"),

  // Récupérer les assurances expirant dans les 30 jours
  getAssurancesExpirantDans30Jours: () => axiosClient.get("/api/assurances/expirant-dans-30-jours"),
};

export default assuranceService;
