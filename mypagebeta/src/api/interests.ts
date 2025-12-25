import { api } from "./client";

type ApiEnvelope<T> = {
  isSuccess: boolean;
  statusCode: string;
  message: string;
  result: T;
  success: boolean;
};

export type TargetType = "HOSPITAL" | "FUNERAL";

export type ApiInterest = {
  interestId: number;
  targetType: TargetType;
  targetId: number;
  targetName: string;
  address: string;
  ratingAvg: number;
  reviewCount: number;
  openNow: boolean;
  open24h: boolean;
  nightCare: boolean;
  mainImageUrl: string;
};

export async function fetchMyInterests(): Promise<ApiInterest[]> {
  const res = await api.get<ApiEnvelope<ApiInterest[]>>("/interests/user");
  return res.data.result ?? [];
}

export async function createInterest(input: {
  targetType: TargetType;
  targetId: number;
}) {
  const res = await api.post<ApiEnvelope<unknown>>("/interests", input);
  return res.data;
}

export async function deleteInterest(interestId: number) {
  const res = await api.delete<ApiEnvelope<unknown>>(`/interests/${interestId}`);
  return res.data;
}
