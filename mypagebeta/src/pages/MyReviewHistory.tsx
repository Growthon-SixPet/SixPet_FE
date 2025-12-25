import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyReviewHistory.css";

import {
  fetchMyReviews,
  deleteMyReview,
  mapReviewToUI,
  type MyReviewApi,
} from "../api/reviews";

type Review = {
  id: number;
  writerName: string;
  rating: number;
  date: string;
  hospitalName: string;
  content: string;
};

const PAGE_SIZE = 3;

export default function MyReviewHistory() {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        const list: MyReviewApi[] = await fetchMyReviews();

        if (!alive) return;

        const uiList: Review[] = list.map((r) => ({
          ...mapReviewToUI(r)
        }));

        setReviews(uiList);
        setPage(1);
      } catch (e: any) {
        if (!alive) return;
        const status = e?.response?.status;
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          "후기 목록 조회에 실패했습니다.";
        setErrorMsg(status ? `${msg} (status: ${status})` : msg);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE));

  const pageReviews = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return reviews.slice(start, start + PAGE_SIZE);
  }, [reviews, page]);

  const handleDelete = async (id: number) => {
    const ok = window.confirm("후기를 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await deleteMyReview(id);

      setReviews((prev) => prev.filter((r) => r.id !== id));

      setTimeout(() => {
        setPage((p) => {
          const newTotal = Math.max(1, Math.ceil((reviews.length - 1) / PAGE_SIZE));
          return Math.min(p, newTotal);
        });
      }, 0);
    } catch (e: any) {
      const status = e?.response?.status;
      const msg =
        e?.response?.data?.message || e?.message || "후기 삭제에 실패했습니다.";
      alert(status ? `${msg} (status: ${status})` : msg);
    }
  };

  return (
    <section className="wr-content">
      <div className="wr-box">
        <header className="wr-content-head">
          <h1 className="wr-title">후기 내역 관리</h1>
          <p className="wr-subtitle">
            고객님께서 입력하신 후기 내역 정보입니다.
          </p>
        </header>
      </div>

      {loading && <div className="wr-empty">불러오는 중...</div>}
      {!loading && errorMsg && <div className="wr-empty">{errorMsg}</div>}

      <div className="wr-list">
        {!loading && !errorMsg && pageReviews.length === 0 ? (
          <div className="wr-empty">작성한 후기가 없습니다.</div>
        ) : (
          !loading &&
          !errorMsg &&
          pageReviews.map((review) => (
            <article key={review.id} className="wr-card">
              <button className="wr-delete" onClick={() => handleDelete(review.id)}>
                삭제
              </button>

              <div className="wr-card-top">
                <div className="wr-writer">{review.writerName}</div>
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
                <span className="wr-date">{review.date}</span>
                <span className="wr-hospital">{review.hospitalName}</span>
              </div>

              <p className="wr-text">{review.content}</p>
            </article>
          ))
        )}
      </div>

      {!loading && !errorMsg && reviews.length > 0 && (
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
  );
}
