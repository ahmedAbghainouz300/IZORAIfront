import axiosClient from "../axiosClient";

const physiqueService = {
  getAll: () => axiosClient.get("/physiques"),
  getById: (id) => axiosClient.get(`/physiques/${id}`),
  create: (data) => axiosClient.post("/physiques", data),
  delete: (id) => axiosClient.delete(`/physiques/${id}`),
};

export default physiqueService;
