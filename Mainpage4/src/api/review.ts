import authAxios from "./authAxios";

/* 리뷰 조회 */
export const getReviews = (targetId: number) => {
  return authAxios.get("/reviews", {
    params: {
      targetType: "HOSPITAL",
      targetId,
    },
  });
};

/* 리뷰 작성 */
export const createReview = async (params: {
  targetType: "HOSPITAL" | "FUNERAL";
  targetId: number;
  rating: number;
  content: string;
  imageFile?: File | null;
}) => {
  const formData = new FormData();

  // req (필수)
  const req = {
    targetType: params.targetType,
    targetId: params.targetId,
    rating: params.rating,
    content: params.content,
  };

  formData.append(
    "req",
    new Blob([JSON.stringify(req)], { type: "application/json" })
  );

  // image (선택) → 없으면 append 자체를 안 함
  if (params.imageFile) {
    formData.append("image", params.imageFile);
  }

  // ❗ Content-Type 직접 지정하지 말 것
  return authAxios.post("/reviews", formData);
};
