import axiosInstance from "./publicAxios";

export const getHospitalDetail = (hospitalId: number) => {
  return axiosInstance.get(`/hospitals/${hospitalId}`);
};

export const getHospitalHours = (hospitalId: number) => {
  return axiosInstance.get(`/hospitals/${hospitalId}/hours`);
};

export const getHospitalNews = (hospitalId: number) => {
  return axiosInstance.get(`/hospitals/${hospitalId}/news`);
};
