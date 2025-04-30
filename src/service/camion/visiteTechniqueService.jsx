import axiosClient from "../axiosClient";

const visiteTechniqueService = {
  // Create a new technical visit
  create: (visiteTechnique, file) => {
    const formData = new FormData();
    formData.append("visite", new Blob([JSON.stringify(visiteTechnique)], { 
      type: "application/json" 
    }));
    
    if (file) {
      formData.append("file", file);
    }

    return axiosClient.post("/api/visites-techniques", formData, {  // Send formData instead of visiteTechnique
      headers: {
        "Content-Type": "multipart/form-data",
      },  
    });
  },

  // Get a technical visit by ID
  getById: (id) => 
    axiosClient.get(`/api/visites-techniques/${id}`),

  getDocument: async (id) => {
    try {
      const response = await axiosClient.get(`/api/visites-techniques/${id}/document`, {
        responseType: 'blob' // Important for file downloads
      });
      
      // Create object URL for the downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      return {
        data: url,
        filename: response.headers['content-disposition']
          ? response.headers['content-disposition'].split('filename=')[1].replace(/"/g, '')
          : 'document'
      };
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  },

  // Get all technical visits
  getAll: () => 
    axiosClient.get("/api/visites-techniques"),

  // Get technical visits by truck license plate
  getByCamion: (immatriculation) => 
    axiosClient.get(`/api/visites-techniques/camion/${immatriculation}`),

  // Get technical visits expiring in 30 days
  getExpirant: () => 
    axiosClient.get("/api/visites-techniques/expirant"),

  // Update a technical visit with optional file
update: (id, visiteTechnique, file) => {
  const formData = new FormData();
  formData.append("visite", new Blob([JSON.stringify(visiteTechnique)], { type: "application/json" }));
  
  if (file) {
    formData.append("file", file);
  }

  return axiosClient.put(`/api/visites-techniques/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
},

  // Delete a technical visit
  delete: (id) => 
    axiosClient.delete(`/api/visites-techniques/${id}`),
};

export default visiteTechniqueService;