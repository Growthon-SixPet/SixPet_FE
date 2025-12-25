import axios from "axios";

const BASE_URL = "https://withtail.duckdns.org";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function isValidToken(token: string | null) {
  if (!token) return false;
  const t = token.trim();
  if (!t) return false;
  if (t === "null" || t === "undefined") return false;
  return true;
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (isValidToken(token)) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = token!.startsWith("Bearer ")
        ? token!
        : `Bearer ${token}`;
    } else {
      if (config.headers) {
        delete (config.headers as any).Authorization;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);
