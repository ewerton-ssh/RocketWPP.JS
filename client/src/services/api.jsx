import axios from "axios";
import data from "../../public/host.json"

const api = axios.create({
    baseURL: data.ip,
});

export default api;