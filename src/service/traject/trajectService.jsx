import axiosClient from "../axiosClient";

const trajectService = {
  // REST API endpoints
  updateLocation: (locationDto) => axiosClient.post("/api/location", locationDto),

  getActiveDrivers: () => axiosClient.get("/api/drivers/active"),

  getDriverHistory: (cni, startTime = null) => {
    const params = {};
    if (startTime) {
      params.startTime = startTime.toISOString();
    }
    return axiosClient.get(`/api/drivers/${cni}/history`, { params });
  },

  // WebSocket avec reconnexion automatique
  initializeWebSocket: (onLocationUpdate) => {
    let socket;
    let reconnectTimeout;

    const connect = () => {
      socket = new WebSocket("ws://localhost:8080/ws/websocket");

      socket.onopen = () => {
        console.log("WebSocket connecté !");
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onLocationUpdate(data);
      };

      socket.onclose = () => {
        console.warn("WebSocket fermé. Tentative de reconnexion dans 3s...");
        reconnectTimeout = setTimeout(() => {
          connect(); // 🔁 Reconnecte automatiquement
        }, 3000);
      };

      socket.onerror = (error) => {
        console.error("Erreur WebSocket :", error);
        socket.close(); // Force le onclose pour déclencher la reconnexion
      };
    };

    connect();

    return {
      disconnect: () => {
        clearTimeout(reconnectTimeout);
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      },
    };
  },
};

export default trajectService;
