import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyPageReservation.css";

type MyPageTab = "PROFILE" | "RESERVATIONS" | "REVIEWS" | "MY_HOSPITALS";
type ReservationStatus = "RESERVED" | "CANCELED";

type Reservation = {
  id: number;
  hospitalName: string;
  hospitalCategoryLabel: string;
  rating: number;
  reviewCount: number;
  reservationNumber: string;
  reservedDate: string;
  petName: string;
  petSpeciesSex: string;
  status: ReservationStatus;
  isFavorite: boolean;
};

/* ===== 북마크 아이콘 (원본 동일) ===== */
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
          strokeLinejoin="round"
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

export default function MyPageReservation() {
  const navigate = useNavigate();
  const activeTab: MyPageTab = "RESERVATIONS";

  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 1,
      hospitalName: "24시간 동물 응급센터",
      hospitalCategoryLabel: "24시간 응급 의료센터",
      rating: 4.9,
      reviewCount: 312,
      reservationNumber: "000000000000",
      reservedDate: "2025.10.25",
      petName: "몽몽이",
      petSpeciesSex: "골든리트리버(남)",
      status: "RESERVED",
      isFavorite: true,
    },
    {
      id: 2,
      hospitalName: "24시간 동물 응급센터",
      hospitalCategoryLabel: "24시간 응급 의료센터",
      rating: 4.9,
      reviewCount: 312,
      reservationNumber: "000000000001",
      reservedDate: "2025.10.25",
      petName: "몽몽이",
      petSpeciesSex: "골든리트리버(남)",
      status: "RESERVED",
      isFavorite: false,
    },
    {
      id: 3,
      hospitalName: "24시간 동물 응급센터",
      hospitalCategoryLabel: "24시간 응급 의료센터",
      rating: 4.9,
      reviewCount: 312,
      reservationNumber: "000000000002",
      reservedDate: "2025.10.25",
      petName: "몽몽이",
      petSpeciesSex: "골든리트리버(남)",
      status: "CANCELED",
      isFavorite: true,
    },
  ]);

  const PAGE_SIZE = 3;
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(reservations.length / PAGE_SIZE));

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return reservations.slice(start, start + PAGE_SIZE);
  }, [reservations, page]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleCancelReservation = (id: number) => {
    if (!window.confirm("정말 예약을 취소하시겠습니까?")) return;
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "CANCELED" } : r))
    );
  };

  const handleToggleBookmark = (id: number) => {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
      )
    );
  };

  const handleWithdraw = () => {
    if (!window.confirm("정말 회원 탈퇴하시겠습니까?")) return;
    navigate("/");
  };

  const goTab = (tab: MyPageTab) => {
    if (tab === "PROFILE") navigate("/mypage/profile");
    if (tab === "RESERVATIONS") navigate("/mypage/reservations");
    if (tab === "REVIEWS") navigate("/mypage/reviews");
    if (tab === "MY_HOSPITALS") navigate("/mypage/my-hospitals");
  };

  return (
    <div className="mypage-wrapper">
      <div className="mypage-inner">
        {/* 사이드바 */}
        <aside className="sidebar">
          <div className="sidebar-title">마이페이지</div>
          <div className="sidebar-divider" />

          <div
            className={`sidebar-item ${activeTab === "RESERVATIONS" ? "active" : ""}`}
            onClick={() => goTab("RESERVATIONS")}
          >
            예약 내역 관리
          </div>

          <div className="sidebar-item" onClick={() => goTab("PROFILE")}>
            회원 정보
          </div>

          <div className="sidebar-item" onClick={() => goTab("REVIEWS")}>
            후기 내역 관리
          </div>

          <div className="sidebar-item" onClick={() => goTab("MY_HOSPITALS")}>
            나의 동물 병원
          </div>

          <div className="sidebar-withdraw" onClick={handleWithdraw}>
            회원 탈퇴
          </div>
        </aside>

        {/* 메인 */}
        <main className="main">
          <h2>예약 내역 관리</h2>
          <div className="main-desc">
            법적 진료내역 보관 기간은 최소 1년입니다.
          </div>

          <div className="reservation-list">
            {pageItems.map((r) => (
              <div className="reservation-card" key={r.id}>
                <div className="card-image">IMAGE</div>

                <div className="card-info">
                  <div className="card-title">
                    <div className="card-hospital-name">{r.hospitalName}</div>

                    <div className="card-rating">
                      <StarIcon />
                      <span>{r.rating}</span>
                      <span className="card-reviewcount">
                        ({r.reviewCount})
                      </span>
                    </div>
                  </div>

                  <div className="card-sub">{r.hospitalCategoryLabel}</div>

                  <div className="card-line">
                    <div className="card-row">
                      <div className="card-label">예약번호</div>
                      <div className="card-value">{r.reservationNumber}</div>
                    </div>

                    <div className="card-row">
                      <div className="card-label">예약날짜</div>
                      <div className="card-value">{r.reservedDate}</div>
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
                    onClick={() => handleToggleBookmark(r.id)}
                  >
                    <BookmarkIcon filled={r.isFavorite} />
                  </div>

                  <button
                    className="cancel-btn"
                    onClick={() => handleCancelReservation(r.id)}
                    disabled={r.status === "CANCELED"}
                  >
                    예약취소
                  </button>
                </div>
              </div>
            ))}
          </div>

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
        </main>
      </div>
    </div>
  );
}
