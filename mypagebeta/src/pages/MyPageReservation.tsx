import React, { useMemo, useState, useEffect } from "react";
import "./MyPageReservation.css";

import {
  fetchMyReservations,
  cancelReservation,
  type ApiReservation,
} from "../api/reservations";

import { useInterest } from "../contexts/InterestContext";

type ReservationStatus = "RESERVED" | "CANCELED";


type Reservation = {
  id: number;

  targetType: "HOSPITAL" | "FUNERAL";
  targetId: number;

  hospitalName: string;
  hospitalCategoryLabel: string;
  rating: number;
  reviewCount: number;

  reservationNumber: string;
  reservedDate: string;
  petName: string;
  petSpeciesSex: string;

  status: ReservationStatus;
};

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24">
      {filled ? (
        <path
          d="M6 3.5C6 2.67157 6.67157 2 7.5 2H16.5C17.3284 2 18 2.67157 18 3.5V22L12 18.5L6 22V3.5Z"
          fill="#FF0000"
        />
      ) : (
        <path
          d="M7.5 2.75H16.5C16.9142 2.75 17.25 3.08579 17.25 3.5V20.692L12 17.639L6.75 20.692V3.5C6.75 3.08579 7.08579 2.75 7.5 2.75Z"
          fill="none"
          stroke="#000000"
          strokeWidth="1.8"
        />
      )}
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24">
      <path
        d="M12 2l2.92 6.62 7.08.62-5.35 4.64 1.6 6.96L12 17.77 5.75 20.84l1.6-6.96L2 9.24l7.08-.62L12 2z"
        fill="#FBBF24"
      />
    </svg>
  );
}

function dashToDot(date: string) {
  return date ? date.replaceAll("-", ".") : "";
}

function mapApiReservationToUI(api: ApiReservation): Reservation {
  return {
    id: api.reservationId,

    targetType: api.targetType,
    targetId: api.targetId,

    hospitalName: api.targetName ?? "-",
    hospitalCategoryLabel:
      api.targetType === "HOSPITAL" ? "동물병원" : "장례식장",

    rating: (api as any).ratingAvg ?? 0,
    reviewCount: (api as any).reviewCount ?? 0,

    reservationNumber: api.reservationNumber ?? "-",
    reservedDate: dashToDot(api.reservationDate),

    petName: api.petName ?? "-",
    petSpeciesSex: (api as any).petSpeciesSex ?? "-",

    status: "RESERVED",
  };
}

export default function MyPageReservation() {
  const { isInterested, toggle } = useInterest();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  const PAGE_SIZE = 3;
  const [page, setPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(reservations.length / PAGE_SIZE)
  );

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return reservations.slice(start, start + PAGE_SIZE);
  }, [reservations, page]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchMyReservations();
        setReservations((data ?? []).map(mapApiReservationToUI));
      } catch (e) {
        console.error(e);
        setReservations([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCancelReservation = async (id: number) => {
    const ok = window.confirm("정말 예약을 취소하시겠습니까?");
    if (!ok) return;

    try {
      await cancelReservation(id);
      setReservations((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "CANCELED" } : r
        )
      );
    } catch (e) {
      console.error(e);
      alert("예약 취소에 실패했습니다.");
    }
  };

  const handleToggleBookmark = async (r: Reservation) => {
    try {
      await toggle(r.targetType, r.targetId);
    } catch (e) {
      console.error(e);
      alert("즐겨찾기 처리에 실패했습니다.");
    }
  };

  return (
    <section className="mp-main reservationBox">
      <div className="mp-box">
        <div className="mpr-header">
          <h2 className="mpr-title">예약 내역 관리</h2>
          <p className="mpr-desc">
            법적 진료내역 보관 기간은 최소 1년입니다.
          </p>
        </div>
        <div className="mpr-divider" />
      </div>

      {loading ? (
        <div className="reservation-list">
          <div className="wr-empty">불러오는 중...</div>
        </div>
      ) : reservations.length === 0 ? (
        <div className="reservation-list">
          <div className="wr-empty">예약 내역이 없습니다.</div>
        </div>
      ) : (
        <div className="reservation-list">
          {pageItems.map((r) => (
            <div className="reservation-card" key={r.id}>
              <div className="card-image">IMAGE</div>

              <div className="card-info">
                <div className="card-title">
                  <div className="card-hospital-name">
                    {r.hospitalName}
                  </div>

                  <div className="card-rating">
                    <StarIcon />
                    <span>{r.rating}</span>
                    <span className="card-reviewcount">
                      ({r.reviewCount})
                    </span>
                  </div>
                </div>

                <div className="card-sub">
                  {r.hospitalCategoryLabel}
                </div>

                <div className="card-line">
                  <div className="card-row">
                    <div className="card-label">예약번호</div>
                    <div className="card-value">
                      {r.reservationNumber}
                    </div>
                  </div>

                  <div className="card-row">
                    <div className="card-label">예약날짜</div>
                    <div className="card-value">
                      {r.reservedDate}
                    </div>
                  </div>

                  <div className="card-row">
                    <div className="card-label">반려동물</div>
                    <div className="card-value">
                      {r.petName} / {r.petSpeciesSex}
                    </div>
                  </div>

                  <div className="card-row">
                    <div className="card-label">상태</div>
                    <div
                      className={`card-status ${
                        r.status === "RESERVED"
                          ? "reserved"
                          : "canceled"
                      }`}
                    >
                      {r.status === "RESERVED"
                        ? "예약완료"
                        : "예약취소"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-actions">
                <div
                  className="bookmark"
                  onClick={() => handleToggleBookmark(r)}
                >
                  <BookmarkIcon
                    filled={isInterested(
                      r.targetType,
                      r.targetId
                    )}
                  />
                </div>

                <button
                  className="cancel-btn"
                  onClick={() =>
                    handleCancelReservation(r.id)
                  }
                  disabled={r.status === "CANCELED"}
                >
                  예약취소
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {reservations.length > 0 && (
        <div className="pagination">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`page-btn ${
                page === i + 1 ? "active" : ""
              }`}
              onClick={() => setPage(i + 1)}
              type="button"
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
