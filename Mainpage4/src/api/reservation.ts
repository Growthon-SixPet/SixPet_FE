import axiosInstance from "./axios";

export const createReservation = (
  targetId: number,
  data: {
    ownerName: string;
    phoneNumber: string;
    petName: string;
    reservationDate: string;
    reservationTime: string; // 🔥 문자열
    visitReason: string;
  }
) => {
  return axiosInstance.post(
    "/reservations",
    data,
    {
      params: {
        targetType: "HOSPITAL",
        targetId,
      },
    }
  );
};
