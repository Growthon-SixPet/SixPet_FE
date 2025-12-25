import { useEffect, useState } from "react";
import {
  getHospitalDetail,
  getHospitalHours,
  getHospitalNews,
} from "../api/hospital";
import { getReviews, createReview } from "../api/review";
import ReservationModal from "../components/ReservationModal";
import "./HospitalDetail.css";

/* ================= 타입 ================= */

type Hospital = {
  hospitalId: number;
  name: string;
  address: string;
  phone: string;
  description: string;
  isOpenNow: boolean;
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
  const [reviewLoaded, setReviewLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openReservation, setOpenReservation] = useState(false);

  /* ✅ 리뷰 작성 상태 */
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

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

  const loadReviews = async () => {
    if (reviewLoaded) return;
    const res = await getReviews(hospitalId);
    setReviews(res.data.result ?? []);
    setReviewLoaded(true);
  };

  /* ✅ 리뷰 등록 */
  const submitReview = async () => {
    if (!rating || !content) {
      alert("별점과 내용을 입력하세요");
      return;
    }

    const formData = new FormData();

    const req = {
      targetType: "HOSPITAL",
      targetId: hospitalId,
      rating,
      content,
    };

    formData.append(
      "req",
      new Blob([JSON.stringify(req)], { type: "application/json" })
    );

    if (imageFile) {
      formData.append("image", imageFile);
    }

    await createReview(formData);

    setRating(0);
    setContent("");
    setImageFile(null);
    setReviewLoaded(false);
    loadReviews();
  };

  if (loading || !hospital) return <div>로딩중...</div>;

  return (
    <>
      <div className="page-wrapper">
        <div className="page">
          {/* 상단 병원 정보 */}
          <div className="top-card">
            <div className="image-box">
              {hospital.mainImageUrl ? (
                <img src={hospital.mainImageUrl} />
              ) : (
                <div className="image-placeholder">이미지 없음</div>
              )}
            </div>

            <div className="info-box">
              <div className="title-row">
                <h2>{hospital.name}</h2>
                <span className="rating">
                  ⭐ {hospital.ratingAvg} ({hospital.reviewCount})
                </span>
              </div>

              <p className="desc">{hospital.description}</p>
              <p className="sub">📍 {hospital.address}</p>
              <p className="sub">📞 {hospital.phone}</p>

              <button
                className="reserve-btn"
                onClick={() => setOpenReservation(true)}
              >
                예약하기
              </button>
            </div>
          </div>

          {/* 진료 시간 */}
          <section>
            <h3>진료 시간</h3>
            <div className="hours-row">
              {hours.map((h, i) => (
                <div key={i} className="hour-card">
                  <strong>{h.day}</strong>
                  <div>
                    {h.openTime} ~ {h.closeTime}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 탭 */}
          <div className="tab-row">
            <button
              className={tab === "news" ? "tab active" : "tab"}
              onClick={() => setTab("news")}
            >
              병원소식
            </button>
            <button
              className={tab === "doctors" ? "tab active" : "tab"}
              onClick={() => setTab("doctors")}
            >
              의료진
            </button>
            <button
              className={tab === "reviews" ? "tab active" : "tab"}
              onClick={() => {
                setTab("reviews");
                loadReviews();
              }}
            >
              리뷰
            </button>
          </div>

          {/* 탭 내용 */}
          <section>
            {tab === "news" &&
              news.map((n) => (
                <div key={n.newsId} className="news-card">
                  <div className="news-thumb" />
                  <div>
                    <h4>{n.title}</h4>
                    <p>{n.content}</p>
                    <small>{n.createdAt}</small>
                  </div>
                </div>
              ))}

            {tab === "doctors" && <div>의료진 연동 예정</div>}

            {tab === "reviews" && (
              <>
                {/* ✅ 리뷰 작성 UI (디자인 망치지 않게 최소) */}
                <div className="review-card">
                  <div style={{ marginBottom: 8 }}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span
                        key={n}
                        onClick={() => setRating(n)}
                        style={{
                          cursor: "pointer",
                          color: n <= rating ? "#f5b301" : "#ddd",
                          fontSize: 20,
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="리뷰를 작성해주세요"
                    style={{ width: "100%" }}
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setImageFile(e.target.files?.[0] ?? null)
                    }
                  />

                  <button onClick={submitReview}>리뷰 등록</button>
                </div>

                {/* 기존 리뷰 목록 */}
                {reviews.map((r) => (
                  <div key={r.reviewId} className="review-card">
                    <div className="review-top">
                      <strong>{r.writerNickname}</strong>
                      <span>⭐ {r.rating}</span>
                    </div>
                    <p>{r.content}</p>
                    <small>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                ))}
              </>
            )}
          </section>
        </div>
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
