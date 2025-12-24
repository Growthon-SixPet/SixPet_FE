import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupVerify.css";
import { signupUser } from "../api/user";
import { sendPhoneCode, verifyPhoneCode } from "../api/phoneAuth";

/* 전화번호 자동 하이픈 */
const formatPhoneNumber = (value: string) => {
  const numbersOnly = value.replace(/\D/g, "");
  if (numbersOnly.length <= 3) return numbersOnly;
  if (numbersOnly.length <= 7)
    return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
  return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
};

const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const SignupVerify = () => {
  const navigate = useNavigate();

  /* Step1 데이터 */
  const step1Data = sessionStorage.getItem("signupStep1");
  const parsedStep1 = JSON.parse(sessionStorage.getItem("signupStep1")!)


  useEffect(() => {
    if (!parsedStep1) {
      alert("잘못된 접근입니다.");
      navigate("/signup");
    }
  }, [parsedStep1, navigate]);

  /* 기본 정보 */
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [gender, setGender] = useState("");

  /* 전화 인증 */
  const [phone, setPhone] = useState("");
  const [requested, setRequested] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [code, setCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isCodeError, setIsCodeError] = useState(false);

  /* 버튼 활성 조건 */
  const canRequest = phone.length === 13;
  const canConfirm = code.length > 0 && timeLeft > 0 && !isVerified;
  const canSubmit =
    name &&
    birthYear &&
    birthMonth &&
    birthDay &&
    gender &&
    isVerified;

  /* 타이머 */
  useEffect(() => {
    if (!requested || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [requested, timeLeft]);

  /* 전화번호 바뀌면 인증 상태 초기화 */
  useEffect(() => {
    setRequested(false);
    setIsVerified(false);
    setCode("");
    setIsCodeError(false);
    setTimeLeft(180);
  }, [phone]);

  /* 날짜 데이터 */
  const years = Array.from({ length: 2026 - 1950 + 1 }, (_, i) => 1950 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="page-bg">
      <div className="page-wrapper">
        <header className="top-header">
          🐾 With Tail&nbsp;&nbsp;반려동물과 함께하는 모든 순간
        </header>

        <div className="verify-content">
          <h1 className="title">회원가입</h1>
          <p className="subtitle">본인 인증 정보를 입력하세요</p>

          <label className="label">이름</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />

          <label className="label">생년월일</label>
          <div className="birth-row">
            <select value={birthYear} onChange={(e) => setBirthYear(e.target.value)}>
              <option value="">연도</option>
              {years.map((y) => <option key={y}>{y}</option>)}
            </select>
            <select value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)}>
              <option value="">월</option>
              {months.map((m) => <option key={m}>{m}</option>)}
            </select>
            <select value={birthDay} onChange={(e) => setBirthDay(e.target.value)}>
              <option value="">일</option>
              {days.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>

          <label className="label">성별</label>
          <div className="gender-row">
            <label><input type="radio" name="gender" onChange={() => setGender("M")} /> 남성</label>
            <label><input type="radio" name="gender" onChange={() => setGender("F")} /> 여성</label>
          </div>

          <label className="label">전화번호</label>
          <div className="phone-row">
            <input
              className="input"
              value={phone}
              maxLength={13}
              placeholder="010-0000-0000"
              onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            />
            <button
              className={`request-btn ${canRequest ? "active" : "disabled"}`}
              disabled={!canRequest}
              onClick={async () => {
                try {
                  await sendPhoneCode(phone);
                  alert(requested ? "인증번호가 재전송되었습니다." : "인증번호가 전송되었습니다.");
                  setRequested(true);
                  setTimeLeft(180);
                } catch {
                  alert("인증번호 전송 실패");
                }
              }}
            >
              {requested ? "재전송" : "인증요청"}
            </button>
          </div>

          {requested && (
            <>
              <label className="label">
                인증번호 <span style={{ marginLeft: 8, color: "#ef4444" }}>{formatTime(timeLeft)}</span>
              </label>

              <div className="phone-row">
                <input
                  className="input"
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, ""));
                    setIsCodeError(false);
                  }}
                />
                <button
                  className={`confirm-btn ${canConfirm ? "active" : "disabled"}`}
                  disabled={!canConfirm}
                  onClick={async () => {
                    try {
                      await verifyPhoneCode(phone, code);
                      setIsVerified(true);
                      alert("인증 완료");
                    } catch {
                      setIsCodeError(true);
                    }
                  }}
                >
                  확인
                </button>
              </div>

              {isCodeError && <p style={{ color: "#ef4444" }}>인증번호가 올바르지 않습니다.</p>}
              {timeLeft <= 0 && <p style={{ color: "#ef4444" }}>인증 시간이 만료되었습니다.</p>}
            </>
          )}

          <button
            className={`complete-btn ${canSubmit ? "active" : "disabled"}`}
            disabled={!canSubmit}
            onClick={async () => {
              try {
                await signupUser({
                  phoneNumber: phone,
                  password: parsedStep1.password,
                  nickname: parsedStep1.nickname,
                  address: parsedStep1.address,
                  name,
                  birthDate: `${birthYear}-${birthMonth.padStart(2, "0")}-${birthDay.padStart(2, "0")}`,
                  gender: gender === "M" ? "MALE" : "FEMALE",
                });

                sessionStorage.removeItem("signupStep1");
                alert("회원가입 완료");
                navigate("/");
              } catch {
                alert("회원가입 실패");
              }
            }}
          >
            가입완료
          </button>

          <button className="cancel-btn" onClick={() => navigate(-1)}>이전</button>
        </div>
      </div>
    </div>
  );
};

export default SignupVerify;
