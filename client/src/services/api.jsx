import axios from "axios";
import data from "../../json/host.json"

const api = axios.create({
    baseURL: data.ip,
});

export default api;