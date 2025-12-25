import { api } from "./client";

type ApiEnvelope<T> = {
  isSuccess: boolean;
  statusCode: string;
  message: string;
  result: T;
  success: boolean;
};

export type ApiReservation = {
  reservationId: number;
  reservationNumber: string;
  ownerName: string;
  phoneNumber: string;
  targetType: "HOSPITAL" | "FUNERAL";
  targetId: number;
  targetName: string;
  petName: string;
  reservationDate: string; 
  reservationTime: {
    hour: number;
    minute: number;
  };
  visitReason: string;
};

export async function fetchMyReservations(): Promise<ApiReservation[]> {
  const res = await api.get<ApiEnvelope<ApiReservation[]>>("/reservations/user");
  return res.data.result ?? [];
}

export async function cancelReservation(reservationId: number): Promise<void> {
  await api.delete(`/reservations/${reservationId}`);
}
