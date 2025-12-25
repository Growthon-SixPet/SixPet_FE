import { useEffect, useState } from "react";
import {
  getHospitalDetail,
  getHospitalHours,
  getHospitalNews,
} from "../api/hospital";
import { getReviews, createReview } from "../api/review";
import ReservationModal from "../components/ReservationModal";

/* ================= 타입 ================= */

type Hospital = {
  hospitalId: number;
  name: string;
  address: string;
  phone: string;
  description: string;
  ratingAvg: number;
  reviewCount: number;
  mainImageUrl: string | null;
};

type Hour = {
  day: string;
  openTime: string;
  closeTime: string;
};

type News = {
  newsId: number;
  title: string;
  content: string;
  createdAt: string;
};

type Review = {
  reviewId: number;
  rating: number;
  content: string;
  imageUrl: string | null;
  writerNickname: string;
  createdAt: string;
};

/* ================= 컴포넌트 ================= */

export default function HospitalDetail() {
  const hospitalId = 1;

  const [tab, setTab] = useState<"news" | "doctors" | "reviews">("news");

  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [hours, setHours] = useState<Hour[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [loading, setLoading] = useState(true);
  const [reviewLoaded, setReviewLoaded] = useState(false);
  const [openReservation, setOpenReservation] = useState(false);

  /* ===== 리뷰 작성 state (중요) ===== */
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  /* ===== 초기 로딩 ===== */
  useEffect(() => {
    Promise.all([
      getHospitalDetail(hospitalId),
      getHospitalHours(hospitalId),
      getHospitalNews(hospitalId),
    ])
      .then(([hRes, hrRes, nRes]) => {
        setHospital(hRes.data.result);
        setHours(hrRes.data.result ?? []);
        setNews(nRes.data.result ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ===== 리뷰 로딩 ===== */
  const loadReviews = async () => {
    if (reviewLoaded) return;
    const res = await getReviews(hospitalId);
    setReviews(res.data.result ?? []);
    setReviewLoaded(true);
  };

  /* ===== 리뷰 등록 ===== */
  const submitReview = async () => {
    if (!content.trim()) {
      alert("리뷰 내용을 입력하세요");
      return;
    }

    try {
      await createReview({
        targetType: "HOSPITAL",
        targetId: hospitalId,
        rating,
        content,
        imageFile, // 선택 안 하면 null → image 파트 전송 안 됨
      });

      alert("리뷰 등록 완료");
      setContent("");
      setRating(5);
      setImageFile(null);
      setReviewLoaded(false);
      loadReviews();
    } catch (e) {
      console.error("리뷰 등록 실패", e);
      alert("리뷰 등록 실패");
    }
  };

  if (loading || !hospital) return <div>로딩중...</div>;

  return (
    <>
      <div style={{ width: 800, margin: "0 auto", padding: 32 }}>
        {/* ===== 병원 정보 ===== */}
        <h2>{hospital.name}</h2>
        <p>{hospital.description}</p>
        <p>📍 {hospital.address}</p>
        <p>📞 {hospital.phone}</p>

        <button onClick={() => setOpenReservation(true)}>예약하기</button>

        {/* ===== 진료 시간 ===== */}
        <h3 style={{ marginTop: 32 }}>진료 시간</h3>
        {hours.map((h, i) => (
          <div key={i}>
            {h.day} : {h.openTime} ~ {h.closeTime}
          </div>
        ))}

        {/* ===== 탭 ===== */}
        <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
          <button onClick={() => setTab("news")}>병원소식</button>
          <button onClick={() => setTab("doctors")}>의료진</button>
          <button
            onClick={() => {
              setTab("reviews");
              loadReviews();
            }}
          >
            리뷰
          </button>
        </div>

        {/* ===== 탭 내용 ===== */}
        {tab === "news" &&
          news.map((n) => (
            <div key={n.newsId}>
              <h4>{n.title}</h4>
              <p>{n.content}</p>
            </div>
          ))}

        {tab === "doctors" && <div>의료진 연동 예정</div>}

        {tab === "reviews" && (
          <div style={{ marginTop: 24 }}>
            {/* 리뷰 작성 */}
            <h4>리뷰 작성</h4>

            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  ⭐ {n}
                </option>
              ))}
            </select>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="리뷰 내용을 입력하세요"
              style={{ width: "100%", height: 80, marginTop: 8 }}
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImageFile(e.target.files?.[0] ?? null)
              }
            />

            <button onClick={submitReview}>리뷰 등록</button>

            {/* 리뷰 목록 */}
            <div style={{ marginTop: 24 }}>
              {reviews.map((r) => (
                <div
                  key={r.reviewId}
                  style={{ border: "1px solid #ddd", padding: 12, marginBottom: 12 }}
                >
                  <strong>{r.writerNickname}</strong> ⭐ {r.rating}
                  <p>{r.content}</p>
                  {r.imageUrl && (
                    <img src={r.imageUrl} width={120} alt="" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {openReservation && (
        <ReservationModal
          hospitalId={hospitalId}
          onClose={() => setOpenReservation(false)}
        />
      )}
    </>
  );
}
