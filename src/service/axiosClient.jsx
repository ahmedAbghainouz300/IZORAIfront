import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/",
  headers: {
    "Content-Type": "application/json"
    // "bearer": localStorage.getItem("token"),
  },
});

export default axiosClient;
