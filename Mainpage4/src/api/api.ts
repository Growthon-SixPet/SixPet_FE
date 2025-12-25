import axios from "axios";

export const api = axios.create({
  baseURL: "https://withtail.duckdns.org",  // 실제 base URL
  headers: {
    "Content-Type": "application/json",
  }
});

// 예: 병원 진료시간 가져오기
export async function getHospitalHours(hospitalId: number) {
  const resp = await api.get(`/hospitals/${hospitalId}/hours`);
  return resp.data;
}
