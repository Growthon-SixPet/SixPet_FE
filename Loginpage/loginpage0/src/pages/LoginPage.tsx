import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [keepLogin, setKeepLogin] = useState(false);
  const navigate = useNavigate();

  const isActive = phone.trim() !== "" && password.trim() !== "";

  return (
    <div className="page-bg">
      <div className="page-wrapper">
        {/* 헤더 */}
        <header className="top-header">
          <div className="header-left">
            <span className="logo">🐾 With Tail</span>
          </div>
          <div className="header-right">
            반려동물과 함께하는 모든 순간
          </div>
        </header>

        {/* 본문 */}
        <div className="login-content">
          <h1 className="title">로그인</h1>
          <p className="subtitle">계정에 로그인하세요</p>

          {/* 휴대폰 번호 */}
          <label className="label">휴대폰 번호</label>
          <input
            className="input"
            type="tel"
            placeholder="010-0000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {/* 비밀번호 */}
          <label className="label">비밀번호</label>
          <input
            className="input"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* 로그인 상태 유지 */}
          <div className="keep-login">
            <input
              type="checkbox"
              checked={keepLogin}
              onChange={(e) => setKeepLogin(e.target.checked)}
            />
            <span>로그인 상태 유지</span>
          </div>

          {/* 로그인 버튼 */}
          <button
            className={`login-btn ${isActive ? "active" : "disabled"}`}
            disabled={!isActive}
          >
            로그인
          </button>

          {/* 회원가입 */}
          <div className="signup-row">
            <span>계정이 없으신가요?</span>
            <button
              className="signup-link"
              onClick={() => navigate("/signup/terms")}
            >
              회원가입
            </button>
          </div>

          {/* 구분선 */}
          <div className="divider">
  <div className="divider-line" />
  <span className="divider-text">또는</span>
  <div className="divider-line" />
</div>


          {/* 구글 로그인 (소셜 로그인용 UI) */}
          <button className="google-btn">
            G 구글 계정으로 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
