import axios from "axios";

export const publicApi = axios.create({
  baseURL: "https://withtail.duckdns.org",
  headers: {
    "Content-Type": "application/json",
  },
});
