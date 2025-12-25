import axios from "axios";

export const api = axios.create({
  baseURL: "https://withtail.duckdns.org",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("token");


  if (token) {
    const value = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    if (config.headers && typeof (config.headers as any).set === "function") {
      (config.headers as any).set("Authorization", value);
    } else {
      config.headers = {
        ...(config.headers || {}),
        Authorization: value,
      } as any;
    }
  }

  return config;
});
