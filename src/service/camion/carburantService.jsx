import axiosClient from "../axiosClient";

const carburantService = {
  // Récupérer toutes les entrées de carburant
  getAll: () => axiosClient.get("/api/carburants"),

  // Récupérer une entrée de carburant par son ID
  getById: (id) => axiosClient.get(`/api/carburants/${id}`),

  // Créer une nouvelle entrée de carburant
  create: (data) => axiosClient.post("/api/carburants", data),

  // Mettre à jour une entrée de carburant existante
  update: (id, data) => axiosClient.put(`/api/carburants/${id}`, data),

  // Supprimer une entrée de carburant par son ID
  delete: (id) => axiosClient.delete(`/api/carburants/${id}`),

  // Récupérer les carburants associés à un camion
  getByCamion: (immatriculationCamion) =>
    axiosClient.get(`/api/carburants/camion/${immatriculationCamion}`),

  // Récupérer les carburants dans un intervalle de dates
  getByDateRange: (debut, fin) =>
    axiosClient.get("/api/carburants/date-range", {
      params: { debut, fin },
    }),

  // Récupérer la consommation moyenne d'un camion
  getConsommationMoyenneByCamion: (immatriculationCamion) =>
    axiosClient.get(
      `/api/carburants/consommation-moyenne/${immatriculationCamion}`
    ),

  // Récupérer le coût total de carburant d'un camion
  getCoutTotalCarburant: (immatriculationCamion) =>
    axiosClient.get(`/api/carburants/cout-total/${immatriculationCamion}`),
};

export default carburantService;
