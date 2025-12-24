import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./MyPageLayout.css";

type MenuKey = "profile" | "reservation" | "review" | "favorites";

export default function MyPageLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveMenu = (): MenuKey => {
    const path = location.pathname;

    if (path.startsWith("/mypage/profile")) return "profile";
    if (path.startsWith("/mypage/reservation")) return "reservation";
    if (path.startsWith("/mypage/review")) return "review";
    if (path.startsWith("/mypage/favorites")) return "favorites";

    // 기본
    return "profile";
  };

  const activeMenu = getActiveMenu();

  const handleWithdraw = () => {
    const ok = window.confirm("정말 회원 탈퇴하시겠습니까?");
    if (!ok) return;
    alert("회원탈퇴 처리 (백엔드 연동 예정)");
  };

  return (
    <div className="mp-page">
      <Header />

      <div className="mp-body">
        <div className="mp-wrap">
          <div className="mp-stage">
            <aside className="mp-sidebar">
              <div className="mp-sidebar-title">마이페이지</div>

              <button
                className={`mp-side-item ${activeMenu === "profile" ? "active" : ""}`}
                onClick={() => navigate("/mypage/profile")}
                type="button"
              >
                회원 정보
              </button>

              <button
                className={`mp-side-item ${activeMenu === "reservation" ? "active" : ""}`}
                onClick={() => navigate("/mypage/reservation")}
                type="button"
              >
                예약 내역 관리
              </button>

              <button
                className={`mp-side-item ${activeMenu === "review" ? "active" : ""}`}
                onClick={() => navigate("/mypage/review")}
                type="button"
              >
                후기 내역 관리
              </button>

              <button
                className={`mp-side-item ${activeMenu === "favorites" ? "active" : ""}`}
                onClick={() => navigate("/mypage/favorites")}
                type="button"
              >
                나의 즐겨찾기
              </button>

              <button className="mp-side-item withdraw" onClick={handleWithdraw} type="button">
                회원 탈퇴
              </button>
            </aside>
            <Outlet />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
