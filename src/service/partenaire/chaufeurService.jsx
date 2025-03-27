  import axiosClient from "../axiosClient";

  const chaufeurService = {
    // Créer un nouveau chauffeur
    create: (data) => axiosClient.post("/api/chauffeurs", data),
    
    // Récupérer un chauffeur par son ID
    getById: (id) => axiosClient.get(`/api/chauffeurs/${id}`),
    
    // Récupérer tous les chauffeurs
    getAll: () => axiosClient.get("/api/chauffeurs"),
    
    // Mettre à jour un chauffeur
    update: (id, data) => axiosClient.put(`/api/chauffeurs/${id}`, data),
    
    // Supprimer un chauffeur par son ID
    delete: (id) => axiosClient.delete(`/api/chauffeurs/${id}`),
    // Gestion disponibilité
    getAvailableDrivers: () => axiosClient.get("/api/chauffeurs/available"),
      
    toggleAvailability: (idChauffeur) => 
      axiosClient.patch(`/api/chauffeurs/${idChauffeur}/availability`),

    // Gestion permis/assurance
    checkPermisValidity: (idChauffeur) => 
      axiosClient.get(`/api/chauffeurs/${idChauffeur}/permis/valid`),

    getWithExpiredPermis: () => 
      axiosClient.get("/api/chauffeurs/permis/expired"),

    updatePermisExpiration: (idChauffeur, newDate) => 
      axiosClient.patch(`/api/chauffeurs/${idChauffeur}/permis`, null, {
        params: { newExpirationDate: newDate }
      }),

    // Statistiques
    getActiveDriversCount: () => axiosClient.get("/api/chauffeurs/stats/active"),

    getDriversOnMissionCount: () => 
      axiosClient.get("/api/chauffeurs/stats/on-mission"),

    // Méthode optionnelle (si implémentée côté backend)
    unassign: (idChauffeur) => 
      axiosClient.post(`/api/chauffeurs/${idChauffeur}/unassign`),

    getPermisPhoto: (idChauffeur) =>
      axiosClient.get(`/api/chauffeurs/${idChauffeur}/permis`), 

  };

  export default chaufeurService;
