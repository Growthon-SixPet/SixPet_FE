import React, { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./MyReviewHistory.css";

// ✅ 협업 Header/Footer (프로젝트 경로에 맞게 바꿔줘)
// import Header from "../components/Header";
// import Footer from "../components/Footer";

type Review = {
  id: number;
  writerName: string;
  petType: string; // 강아지/고양이...
  category: string; // 외과수술/내과...
  rating: number; // 1~5
  date: string; // YYYY.MM.DD
  content: string;
};

const PAGE_SIZE = 3;

export default function MyReviewHistory() {
  const navigate = useNavigate();

  // ✅ 백엔드 붙기 전 임시 더미 데이터
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 101,
      writerName: "김연지",
      petType: "강아지",
      category: "외과수술",
      rating: 5,
      date: "2025.11.20",
      content:
        "우리 강아지가 아팠을 때 정말 친절하게 치료해주셨어요. 24시간 응급실도 있어서 안심이 됩니다. 수술 후 관리도 꼼꼼하게 해주셔서 감사했습니다.",
    },
    {
      id: 102,
      writerName: "김연지",
      petType: "강아지",
      category: "외과수술",
      rating: 5,
      date: "2025.11.20",
      content:
        "우리 강아지가 아팠을 때 정말 친절하게 치료해주셨어요. 24시간 응급실도 있어서 안심이 됩니다. 수술 후 관리도 꼼꼼하게 해주셔서 감사했습니다.",
    },
    {
      id: 103,
      writerName: "김연지",
      petType: "강아지",
      category: "외과수술",
      rating: 5,
      date: "2025.11.20",
      content:
        "우리 강아지가 아팠을 때 정말 친절하게 치료해주셨어요. 24시간 응급실도 있어서 안심이 됩니다. 수술 후 관리도 꼼꼼하게 해주셔서 감사했습니다.",
    },
    {
      id: 104,
      writerName: "김연지",
      petType: "강아지",
      category: "외과수술",
      rating: 4,
      date: "2025.11.18",
      content: "대기시간은 조금 있었지만 설명이 자세해서 좋았어요.",
    },
  ]);

  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE));

  const pageReviews = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return reviews.slice(start, start + PAGE_SIZE);
  }, [reviews, page]);

  const goPage = (next: number) => {
    if (next < 1 || next > totalPages) return;
    setPage(next);
  };

  const handleDelete = (id: number) => {
    const ok = window.confirm("후기를 삭제하시겠습니까?");
    if (!ok) return;

    // ✅ 백엔드 연동 시: DELETE /reviews/:id 호출 후 성공하면 setReviews
    setReviews((prev) => prev.filter((r) => r.id !== id));

    // 삭제 후 페이지가 비면 이전 페이지로 이동 (UX)
    setTimeout(() => {
      const newTotalPages = Math.max(1, Math.ceil((reviews.length - 1) / PAGE_SIZE));
      setPage((p) => Math.min(p, newTotalPages));
    }, 0);
  };

  const handleWithdraw = () => {
    const ok = window.confirm("정말 회원 탈퇴하시겠습니까?");
    if (!ok) return;

    // ✅ 백엔드 연동 시: 회원탈퇴 API 호출 후 로그아웃/리다이렉트
    // await fetch(...)

    alert("회원 탈퇴 처리되었습니다. (임시)");
    navigate("/"); // 원하는 경로로 수정
  };

  return (
    <div className="wr-page">
      {/* ✅ 협업 컴포넌트 들어오면 아래 주석 해제 */}
      {/* <Header /> */}
      <div className="wr-header-placeholder" />

      <main className="wr-main">
        <aside className="wr-sidebar">
          <div className="wr-sidebar-title">마이페이지</div>

          <nav className="wr-nav">
            <NavLink
              to="/mypage/profile"
              className={({ isActive }) =>
                `wr-nav-item ${isActive ? "active" : ""}`
              }
            >
              회원 정보
            </NavLink>

            <NavLink
              to="/mypage/reservations"
              className={({ isActive }) =>
                `wr-nav-item ${isActive ? "active" : ""}`
              }
            >
              예약 내역 관리
            </NavLink>

            <NavLink
              to="/mypage/reviews"
              className={({ isActive }) =>
                `wr-nav-item ${isActive ? "active" : ""}`
              }
            >
              후기 내역 관리
            </NavLink>

            <NavLink
              to="/mypage/my-hospitals"
              className={({ isActive }) =>
                `wr-nav-item ${isActive ? "active" : ""}`
              }
            >
              나의 동물 병원
            </NavLink>

            <button type="button" className="wr-withdraw" onClick={handleWithdraw}>
              회원 탈퇴
            </button>
          </nav>
        </aside>

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
                  <button
                    type="button"
                    className="wr-delete"
                    onClick={() => handleDelete(review.id)}
                    aria-label="후기 삭제"
                  >
                    삭제
                  </button>

                  <div className="wr-card-top">
                    <div className="wr-writer">{review.writerName}</div>

                    <div className="wr-tags">
                      <span className="wr-tag">{review.petType}</span>
                      <span className="wr-tag">{review.category}</span>
                    </div>
                  </div>

                  <div className="wr-meta">
                    <div className="wr-stars" aria-label={`평점 ${review.rating}점`}>
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
                type="button"
                className="wr-page-btn"
                onClick={() => goPage(page - 1)}
                disabled={page === 1}
                aria-label="이전 페이지"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const p = idx + 1;
                return (
                  <button
                    key={p}
                    type="button"
                    className={`wr-page-num ${p === page ? "active" : ""}`}
                    onClick={() => goPage(p)}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                type="button"
                className="wr-page-btn"
                onClick={() => goPage(page + 1)}
                disabled={page === totalPages}
                aria-label="다음 페이지"
              >
                ›
              </button>
            </div>
          )}
        </section>
      </main>

      {/* ✅ 협업 컴포넌트 들어오면 아래 주석 해제 */}
      {/* <Footer /> */}
      <div className="wr-footer-placeholder" />
    </div>
  );
}
