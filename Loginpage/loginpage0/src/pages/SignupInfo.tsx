import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupInfo.css";

const SignupInfo = () => {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [address, setAddress] = useState("");

  const isActive =
    nickname.trim() !== "" &&
    password.trim() !== "" &&
    passwordCheck.trim() !== "" &&
    password === passwordCheck &&
    address.trim() !== "";

  return (
    <div className="page-bg">
      <div className="page-wrapper">
        {/* 헤더 */}
        <header className="top-header">
          🐾 With Tail&nbsp;&nbsp;반려동물과 함께하는 모든 순간
        </header>

        {/* 콘텐츠 */}
        <div className="info-content">
          <h1 className="title">회원가입</h1>
          <p className="subtitle">계정정보를 입력하세요</p>

          {/* 닉네임 */}
          <label className="label">닉네임</label>
          <input
            className="input"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
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

          {/* 비밀번호 확인 */}
          <label className="label">비밀번호 확인</label>
          <input
            className="input"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />

          {/* 주소 */}
          <label className="label">주소</label>
          <input
            className="input"
            placeholder="주소를 입력하세요"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          {/* 다음 버튼 */}
         <button
  className={`next-btn ${isActive ? "active" : "disabled"}`}
  disabled={!isActive}
  onClick={() => {
    sessionStorage.setItem(
      "signupStep1",
      JSON.stringify({
        nickname,
        password,
        address,
      })
    );
    navigate("/signup/verify");
  }}
>
  다음
</button>

          {/* 취소 */}
          <button className="cancel-btn" onClick={() => navigate("/")}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupInfo;
