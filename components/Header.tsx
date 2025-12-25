import { useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import { api } from "../api/client";

import brandLogo from "./brandimage/brand-logo.png";
import brandText from "./brandimage/brand-text.png";
import userIcon from "./brandimage/user-icon.png";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("token");

  const isLoggedIn = Boolean(token);
  const isMyPage = location.pathname.startsWith("/mypage");

  const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("token");
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", null, { withCredentials: true });
    } catch (e) {
    } finally {
      clearTokens();
      navigate("/", { replace: true });
    }
  };

  return (
    <header className="wt-header">
      <div className="wt-header-inner">
        <button
          className="wt-header-left"
          type="button"
          onClick={() => navigate("/")}
        >
          <img className="wt-left-logo" src={brandLogo} alt="brand logo" />
          <img className="wt-brand-text-img" src={brandText} alt="WithTail" />
        </button>

        <div className="wt-header-actions">
          {isLoggedIn ? (
            isMyPage ? (
              <button className="wt-action-btn" type="button" onClick={handleLogout}>
                <img className="wt-action-icon" src={userIcon} alt="logout" />
                <span className="wt-action-text">로그아웃</span>
              </button>
            ) : (
              <>
                <button className="wt-action-btn" type="button" onClick={handleLogout}>
                  <img className="wt-action-icon" src={userIcon} alt="logout" />
                  <span className="wt-action-text">로그아웃</span>
                </button>

                <button
                  className="wt-action-btn"
                  type="button"
                  onClick={() => navigate("/mypage/profile")}
                >
                  <img className="wt-action-icon" src={userIcon} alt="mypage" />
                  <span className="wt-action-text">마이페이지</span>
                </button>
              </>
            )
          ) : (
            <button
              className="wt-action-btn"
              type="button"
              onClick={() => navigate("/login")}
            >
              <img className="wt-action-icon" src={userIcon} alt="login" />
              <span className="wt-action-text">로그인</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
