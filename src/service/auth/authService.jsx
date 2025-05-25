import axiosClient from "../axiosClient";

const authService = { 
    
  login: async (username, password) => {
    try {
      const response = await axiosClient.post("/auth/login", {
        username,
        password,
      });

      const { access_token } = response.data;
      
      // Stockage du token
      localStorage.setItem("jwtToken", access_token);
      
      // Configuration du header Axios par défaut
      // axiosClient.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      
      return access_token;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Échec de l'authentification"
        );
      } else if (error.request) {
        throw new Error("Serveur inaccessible");
      } else {
        throw new Error("Erreur de configuration de la requête");
      }
    }
  },

  getProfile: async () => {
    try {
      const response = await axiosClient.get("/auth/profile");
      return response.data;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("jwtToken");
    delete axiosClient.defaults.headers.common["Authorization"];
    window.location.href = "/login"; // Redirection vers la page de login
  },

  handleAuthError: (error) => {
    if (error.response?.status === 401) {
      // Token invalide/expiré
      this.logout();
    }
  },

  // Initialisation au chargement de l'app
  // init: () => {
  //   const token = localStorage.getItem("jwtToken");
  //   if (token) {
  //     axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  //   }
  // },
};

// Initialiser les headers au démarrage
// authService.init();

export default authService;