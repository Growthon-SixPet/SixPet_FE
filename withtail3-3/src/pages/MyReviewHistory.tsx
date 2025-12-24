import React, { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./MyReviewHistory.css";

// import Header from "../components/Header";
// import Footer from "../components/Footer";

type Review = {
  id: number;
  writerName: string;
  petType: string; // ✅ 강아지/고양이만 유지
  rating: number;
  date: string;
  content: string;
};

const PAGE_SIZE = 3;

export default function MyReviewHistory() {
  const navigate = useNavigate();

  // ✅ 임시 더미 데이터 (강아지 유지, 외과수술 제거)
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      writerName: "김연지",
      petType: "강아지",
      rating: 5,
      date: "2025.11.20",
      content:
        "우리 강아지가 아팠을 때 정말 친절하게 치료해주셨어요. 24시간 응급실도 있어서 안심이 됩니다. 수술 후 관리도 꼼꼼하게 해주셔서 감사했습니다.",
    },
    {
      id: 2,
      writerName: "김연지",
      petType: "강아지",
      rating: 5,
      date: "2025.11.20",
      content:
        "우리 강아지가 아팠을 때 정말 친절하게 치료해주셨어요. 24시간 응급실도 있어서 안심이 됩니다. 수술 후 관리도 꼼꼼하게 해주셔서 감사했습니다.",
    },
    {
      id: 3,
      writerName: "김연지",
      petType: "강아지",
      rating: 5,
      date: "2025.11.20",
      content: "우리 강아지가 아팠을 때 정말 친절하게 치료해주셔서 감사했습니다.",
    },
    {
      id: 4,
      writerName: "김연지",
      petType: "강아지",
      rating: 4,
      date: "2025.11.18",
      content: "설명이 자세해서 믿음이 갔습니다.",
    },
  ]);

  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE));

  const pageReviews = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return reviews.slice(start, start + PAGE_SIZE);
  }, [reviews, page]);

  const handleDelete = (id: number) => {
    const ok = window.confirm("후기를 삭제하시겠습니까?");
    if (!ok) return;

    setReviews((prev) => prev.filter((r) => r.id !== id));

    setTimeout(() => {
      const newTotal = Math.max(1, Math.ceil((reviews.length - 1) / PAGE_SIZE));
      setPage((p) => Math.min(p, newTotal));
    }, 0);
  };

  const handleWithdraw = () => {
    const ok = window.confirm("정말 회원 탈퇴하시겠습니까?");
    if (!ok) return;

    alert("회원 탈퇴 처리되었습니다. (임시)");
    navigate("/");
  };

  return (
    <div className="wr-page">
      {/* <Header /> */}
      <div className="wr-header-placeholder" />

      <main className="wr-main">
        {/* ---------- Sidebar ---------- */}
        <aside className="wr-sidebar">
          <div className="wr-sidebar-title">마이페이지</div>

          <nav className="wr-nav">
            <NavLink
              to="/mypage/profile"
              className={({ isActive }) => `wr-nav-item ${isActive ? "active" : ""}`}
            >
              회원 정보
            </NavLink>

            <NavLink
              to="/mypage/reservations"
              className={({ isActive }) => `wr-nav-item ${isActive ? "active" : ""}`}
            >
              예약 내역 관리
            </NavLink>

            <NavLink
              to="/mypage/reviews"
              className={({ isActive }) => `wr-nav-item ${isActive ? "active" : ""}`}
            >
              후기 내역 관리
            </NavLink>

            <NavLink
              to="/mypage/my-hospitals"
              className={({ isActive }) => `wr-nav-item ${isActive ? "active" : ""}`}
            >
              나의 동물 병원
            </NavLink>

            <button className="wr-withdraw" onClick={handleWithdraw}>
              회원 탈퇴
            </button>
          </nav>
        </aside>

        {/* ---------- Content ---------- */}
        <section className="wr-content">
          <header className="wr-content-head">
            <h1 className="wr-title">후기 내역 관리</h1>
            <p className="wr-subtitle">고객님께서 입력하신 후기 내역 정보입니다.</p>
          </header>

          <div className="wr-list">
            {pageReviews.length === 0 ? (
              <div className="wr-empty">작성한 후기가 없습니다.</div>
            ) : (
              pageReviews.map((review) => (
                <article key={review.id} className="wr-card">
                  <button className="wr-delete" onClick={() => handleDelete(review.id)}>
                    삭제
                  </button>

                  <div className="wr-card-top">
                    <div className="wr-writer">{review.writerName}</div>

                    {/* ✅ 강아지 태그만 유지 */}
                    <span className="wr-tag">{review.petType}</span>
                  </div>

                  <div className="wr-meta">
                    <div className="wr-stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`wr-star ${i < review.rating ? "filled" : ""}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="wr-date">{review.date}</div>
                  </div>

                  <p className="wr-text">{review.content}</p>
                </article>
              ))
            )}
          </div>

          {reviews.length > 0 && (
            <div className="wr-pagination">
              <button
                className="wr-page-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ‹
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    className={`wr-page-num ${p === page ? "active" : ""}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                className="wr-page-btn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                ›
              </button>
            </div>
          )}
        </section>
      </main>

      {/* <Footer /> */}
      <div className="wr-footer-placeholder" />
    </div>
  );
}
