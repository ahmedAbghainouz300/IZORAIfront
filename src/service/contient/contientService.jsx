import axiosClient from "../axiosClient";

const contientService = {
  // Get all contient records
  getAll: () => axiosClient.get("/api/contients"),

  // Get contient by ID
  getById: (id) => axiosClient.get(`/api/contients/${id}`),

  // Get contients by voyage ID
  getByVoyage: (voyageId) =>
    axiosClient.get(`/api/contients/voyage/${voyageId}`),

  // Get contients by marchandise ID
  getByMarchandise: (marchandiseId) =>
    axiosClient.get(`/api/contients/marchandise/${marchandiseId}`),

  // Create new contient record
  create: (contientData) => axiosClient.post("/api/contients", contientData),

  // Update existing contient record
  update: (id, contientData) =>
    axiosClient.put(`/api/contients/${id}`, contientData),

  // Delete contient record
  delete: (id) => axiosClient.delete(`/api/contients/${id}`),

  // Get contients with quantity greater than
  getByMinQuantity: (minQuantity) =>
    axiosClient.get("/api/contients/quantity", {
      params: { min: minQuantity },
    }),

  // Get contients within quantity range
  getByQuantityRange: (minQuantity, maxQuantity) =>
    axiosClient.get("/api/contients/quantity-range", {
      params: { min: minQuantity, max: maxQuantity },
    }),
};

export default contientService;
