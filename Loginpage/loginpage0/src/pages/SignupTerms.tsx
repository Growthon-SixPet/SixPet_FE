import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupTerms.css";

const SignupTerms = () => {
  const navigate = useNavigate();

  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeService, setAgreeService] = useState(false); // 필수
  const [agreePrivacy, setAgreePrivacy] = useState(false); // 필수
  const [agreeMarketing, setAgreeMarketing] = useState(false); // 선택

  const isRequiredChecked = agreeService && agreePrivacy;

  const handleAgreeAll = (checked: boolean) => {
    setAgreeAll(checked);
    setAgreeService(checked);
    setAgreePrivacy(checked);
    setAgreeMarketing(checked);
  };

  const handleSingleCheck = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    value: boolean
  ) => {
    setter(value);

    if (!value) {
      setAgreeAll(false);
    } else {
      if (
        (setter === setAgreeService && agreePrivacy && agreeMarketing) ||
        (setter === setAgreePrivacy && agreeService && agreeMarketing) ||
        (setter === setAgreeMarketing && agreeService && agreePrivacy)
      ) {
        setAgreeAll(true);
      }
    }
  };

  return (
    <div className="page-bg">
      <div className="page-wrapper">
        {/* 헤더 */}
        <header className="top-header">
          🐾 With Tail&nbsp;&nbsp;반려동물과 함께하는 모든 순간
        </header>

        <div className="terms-content">
          <h1 className="title">회원가입</h1>
          <p className="subtitle">개인정보 수집 및 이용 동의</p>

          {/* 전체 동의 */}
          <label className="agree-all">
            <input
              type="checkbox"
              checked={agreeAll}
              onChange={(e) => handleAgreeAll(e.target.checked)}
            />
            <span>전체 동의</span>
          </label>

          {/* 개별 동의 */}
          <div className="agree-list">
            <label>
              <input
                type="checkbox"
                checked={agreeService}
                onChange={(e) =>
                  handleSingleCheck(setAgreeService, e.target.checked)
                }
              />
              <span>
                <b className="required">[필수]</b> 이용약관 동의
              </span>
            </label>

            <label>
              <input
                type="checkbox"
                checked={agreePrivacy}
                onChange={(e) =>
                  handleSingleCheck(setAgreePrivacy, e.target.checked)
                }
              />
              <span>
                <b className="required">[필수]</b> 개인정보 수집 및 이용 동의
              </span>
            </label>

            <label>
              <input
                type="checkbox"
                checked={agreeMarketing}
                onChange={(e) =>
                  handleSingleCheck(setAgreeMarketing, e.target.checked)
                }
              />
              <span>[선택] 마케팅 정보 수신 동의</span>
            </label>
          </div>

          {/* 버튼 */}
          <button
            className={`next-btn ${
              isRequiredChecked ? "active" : "disabled"
            }`}
            disabled={!isRequiredChecked}
            onClick={() => navigate("/signup/info")}
          >
            다음
          </button>

          <button className="cancel-btn" onClick={() => navigate("/")}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupTerms;
