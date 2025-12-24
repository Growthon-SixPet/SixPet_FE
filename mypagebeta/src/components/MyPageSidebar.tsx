import { useLocation, useNavigate } from "react-router-dom";
import "./MyPageSidebar.css";

export default function MyPageSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const active =
    pathname.includes("/mypage/reservation")
      ? "reservation"
      : pathname.includes("/mypage/review")
      ? "review"
      : pathname.includes("/mypage/favorites")
      ? "favorites"
      : "profile";

  const handleWithdraw = () => {
    const ok = window.confirm("정말 회원 탈퇴하시겠습니까?");
    if (!ok) return;
    navigate("/", { replace: true });
  };

  return (
    <aside className="mp-sb">
      <div className="mp-sb-title">마이페이지</div>

      <button
        className={`mp-sb-item ${active === "profile" ? "active" : ""}`}
        onClick={() => navigate("/mypage/profile")}
        type="button"
      >
        회원 정보
      </button>

      <button
        className={`mp-sb-item ${active === "reservation" ? "active" : ""}`}
        onClick={() => navigate("/mypage/reservation")}
        type="button"
      >
        예약 내역 관리
      </button>

      <button
        className={`mp-sb-item ${active === "review" ? "active" : ""}`}
        onClick={() => navigate("/mypage/review")}
        type="button"
      >
        후기 내역 관리
      </button>

      <button
        className={`mp-sb-item ${active === "favorites" ? "active" : ""}`}
        onClick={() => navigate("/mypage/favorites")}
        type="button"
      >
        나의 즐겨찾기
      </button>

      <button className="mp-sb-item withdraw" onClick={handleWithdraw} type="button">
        회원 탈퇴
      </button>
    </aside>
  );
}
