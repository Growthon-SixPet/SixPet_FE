import axios from "axios";

const publicAxios = axios.create({
  baseURL: "https://withtail.duckdns.org",
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicAxios;
