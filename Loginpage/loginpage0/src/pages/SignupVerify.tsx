import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupVerify.css";

/* 전화번호 자동 하이픈 (백엔드 인증 必)*/
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

  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");

  const [requested, setRequested] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);

  const [code, setCode] = useState("");
  const [isCodeError, setIsCodeError] = useState(false);

  /* 버튼 활성 조건 */
  const canRequest = phone.trim() !== "";
  const canConfirm = code.length > 0 && timeLeft > 0;
  const canSubmit =
    name &&
    birthYear &&
    birthMonth &&
    birthDay &&
    gender &&
    phone &&
    requested &&
    code;

  /* 인증번호 3분 카운트다운 */
  useEffect(() => {
    if (!requested || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [requested, timeLeft]);

  /* 생년월일 데이터 */
  const years = Array.from(
    { length: 2026 - 1950 + 1 },
    (_, i) => 1950 + i
  );
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

          {/* 이름 */}
          <label className="label">이름</label>
          <input
            className="input"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* 생년월일 */}
          <label className="label">생년월일</label>
          <div className="birth-row">
            <select value={birthYear} onChange={(e) => setBirthYear(e.target.value)}>
              <option value="">연도</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <select value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)}>
              <option value="">월</option>
              {months.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <select value={birthDay} onChange={(e) => setBirthDay(e.target.value)}>
              <option value="">일</option>
              {days.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* 성별 */}
          <label className="label">성별</label>
          <div className="gender-row">
            <label>
              <input type="radio" name="gender" onChange={() => setGender("M")} />
              남성
            </label>
            <label>
              <input type="radio" name="gender" onChange={() => setGender("F")} />
              여성
            </label>
          </div>

          {/* 전화번호 */}
          <label className="label">전화번호</label>
          <div className="phone-row">
            <input
              className="input"
              placeholder="010-0000-0000"
              value={phone}
              maxLength={13}
              onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            />

            <button
                className={`request-btn ${canRequest ? "active" : "disabled"}`}
                disabled={!canRequest}
                onClick={() => {
                 if (!requested) {
                    alert("인증 번호가 전송되었습니다");
                 } else {
                  alert("인증번호가 재전송되었습니다");
                }

    setRequested(true);
    setTimeLeft(180);
    setCode("");
    setIsCodeError(false);
  }}
>
  {requested ? "재전송" : "인증요청"}
</button>

          </div>

          {/* 인증번호 */}
          {requested && (
            <>
              <label className="label">
                인증번호
                <span style={{ marginLeft: 8, color: "#ef4444", fontSize: 14 }}>
                  {formatTime(timeLeft)}
                </span>
              </label>

              <div className="phone-row">
                <input
                  className="input"
                  placeholder="인증번호를 입력하세요"
                  value={code}
                  maxLength={6}
                  onChange={(e) => {
                    const onlyNumber = e.target.value.replace(/\D/g, "");
                    setCode(onlyNumber);
                    setIsCodeError(false);
                  }}
                />

                <button
                  className={`confirm-btn ${canConfirm ? "active" : "disabled"}`}
                  disabled={!canConfirm}
                  onClick={() => {
                    // ❗ 임시 로직 (백엔드 연동 시 교체)
                    if (code !== "123456") {
                      setIsCodeError(true);
                      return;
                    }
                    setIsCodeError(false);
                    alert("인증 성공 (임시)");
                  }}
                >
                  확인
                </button>
              </div>

              {isCodeError && (
                <p style={{ color: "#ef4444", fontSize: 14 }}>
                  인증번호가 올바르지 않습니다.
                </p>
              )}

              {timeLeft <= 0 && (
                <p style={{ color: "#ef4444", fontSize: 14 }}>
                  인증 시간이 만료되었습니다. 다시 요청해주세요.
                </p>
              )}
            </>
          )}

          {/* 가입 완료 */}
          <button
            className={`complete-btn ${canSubmit ? "active" : "disabled"}`}
            disabled={!canSubmit}
          >
            가입완료
          </button>

          <button className="cancel-btn" onClick={() => navigate(-1)}>
            이전
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupVerify;
