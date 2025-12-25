import { api } from "./client";

type ApiEnvelope<T> = {
  isSuccess: boolean;
  statusCode: string;
  message: string;
  result: T;
  success: boolean;
};

export type TargetType = "HOSPITAL" | "FUNERAL";

export type MyReviewApi = {
  reviewId: number;
  targetType: TargetType;
  targetId: number;
  targetName: string;
  rating: number;
  content: string;
  imageUrl?: string | null;
  writerNickname: string;
  createdAt: string;
  updatedAt: string;
  isMine: boolean;
};

const formatYYYYMMDD = (iso: string) =>
  iso ? iso.slice(0, 10).replaceAll("-", ".") : "";

export async function fetchMyReviews(): Promise<MyReviewApi[]> {
  const res = await api.get<ApiEnvelope<MyReviewApi[]>>("/reviews/user");
  return res.data.result ?? [];
}

export async function deleteMyReview(reviewId: number): Promise<void> {
  await api.delete(`/reviews/${reviewId}`);
}

export function mapReviewToUI(r: MyReviewApi) {
  return {
    id: r.reviewId,
    writerName: r.writerNickname,
    rating: r.rating,
    date: formatYYYYMMDD(r.createdAt),
    hospitalName: r.targetName,
    content: r.content,
  };
}
