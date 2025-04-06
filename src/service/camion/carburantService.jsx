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
    // Consommation moyenne d'un camion
    getConsommationMoyenne: (immatriculationCamion) => axiosClient.get(`/api/carburants/consommation/${immatriculationCamion}`),

    // Coût total du carburant
    getCoutTotal: () => axiosClient.get("/api/carburants/cout-total"),

    // Distance totale parcourue
    getDistanceTotal: () => axiosClient.get("/api/carburants/distance-total"),

    // Quantité totale de carburant consommée
    getQuantityTotal: () => axiosClient.get("/api/carburants/quantite-total"),

    // Prix moyen du carburant
    getPrixMoyenne: () => axiosClient.get("/api/carburants/prix-moyen"),

    // Taux de consommation moyenne
    getTauxConsommation: () => axiosClient.get("/api/carburants/taux-consommation"),

  };

  export default carburantService;
