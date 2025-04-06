import axiosClient from "../axiosClient";

const stationService = {
  // Récupérer toutes les stations
  getAll: () => axiosClient.get("/api/stations"),

  // Récupérer une station par son ID
  getById: (idStation) => axiosClient.get(`/api/stations/${idStation}`),

  // Ajouter une nouvelle station
  create: (data) => axiosClient.post("/api/stations", data),

  // Mettre à jour une station existante
  update: (idStation, data) => axiosClient.put(`/api/stations/${idStation}`, data),

  // Supprimer une station par son ID
  delete: (idStation) => axiosClient.delete(`/api/stations/${idStation}`),
};

export default stationService;
