import { useRef, useState } from "react";
import "./MyPageProfile.css";

type GenderUI = "남성" | "여성";
type GenderAPI = "MALE" | "FEMALE";

const pad2 = (n: number) => String(n).padStart(2, "0");

// 화면표시(점) -> 전송(하이픈)
const dotToDash = (v: string) => v.replaceAll(".", "-");

// "YYYY-MM-DD" -> "YYYY.MM.DD"
const dateToDot = (v: string) => {
  if (!v) return "";
  const [y, m, d] = v.split("-");
  if (!y || !m || !d) return "";
  return `${y}.${pad2(Number(m))}.${pad2(Number(d))}`;
};

export default function MyPageProfile() {
  // ✅ birth는 화면 표시용(점)으로 들고 있음: "2001.09.27"
  const [profile, setProfile] = useState({
    nickname: "bbikgu",
    name: "김규빈",
    birth: "2001.09.27",
    phone: "010-8282-1004", // ✅ 인증된 번호(수정 불가)
    address: "서울 구로구",
  });

  // ✅ 성별 UI는 라디오(남성/여성)
  const [genderUI, setGenderUI] = useState<GenderUI>("남성");

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // ✅ date picker input
  const birthPickerRef = useRef<HTMLInputElement | null>(null);

  const onSaveProfile = () => {
    const genderApi: GenderAPI = genderUI === "남성" ? "MALE" : "FEMALE";

    const payload = {
      nickname: profile.nickname,
      name: profile.name,
      birth: dotToDash(profile.birth), // ✅ "2001.01.01" -> "2001-01-01"
      gender: genderApi, // ✅ "남성/여성" -> "MALE/FEMALE"
      phone: profile.phone, // ✅ 그대로 전송(수정 불가)
      address: profile.address,
    };

    console.log("백엔드로 보낼 payload:", payload);
    alert("저장 (백엔드 연동 예정)");
  };

  return (
    <section className="mp-main profile">
      <div className="mp-main-top">
      <header className="mp-main-header">
        <h2 className="mp-title">회원 정보</h2>
        <p className="mp-subtitle">
          고객님께서 가입하신 With Tail의 회원 정보입니다.
        </p>
      </header>
      <div className="mp-top-line" />
      </div>
      <div className="mp-profile-head">
        <div className="mp-profile-head-left">프로필 정보</div>
        <div className="mp-profile-head-line" />
      </div>
      <div className="mp-profile-content">
        <div className="mp-profile-col">
          <div className="mp-avatar">
            {profileImage ? (
              <img className="mp-avatar-img" src={profileImage} alt="profile" />
            ) : (
              <div className="mp-avatar-placeholder" />
            )}
          </div>

          <button
            className="mp-outline-btn"
            type="button"
            onClick={() => setShowProfileModal(true)}
          >
            프로필 수정
          </button>
        </div>

        <div className="mp-info-col">
          <div className="mp-row">
            <div className="mp-label">닉네임</div>
            <input
              className="mp-input"
              value={profile.nickname}
              onChange={(e) =>
                setProfile((p) => ({ ...p, nickname: e.target.value }))
              }
            />
          </div>

          <div className="mp-row">
            <div className="mp-label">이름</div>
            <input
              className="mp-input"
              value={profile.name}
              onChange={(e) =>
                setProfile((p) => ({ ...p, name: e.target.value }))
              }
            />
          </div>

          <div className="mp-row">
            <div className="mp-label">생일</div>

            <div className="mp-birth-inline">
              <span className="mp-birth-text">{profile.birth}</span>

              <button
                type="button"
                className="mp-calendar-btn"
                aria-label="calendar"
                onClick={() => birthPickerRef.current?.showPicker?.()}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 2v3M17 2v3M3.5 9h17"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6.5 5h11A3 3 0 0 1 20.5 8v11a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
              </button>

              <input
                ref={birthPickerRef}
                className="mp-date-hidden"
                type="date"
                onChange={(e) => {
                  const dot = dateToDot(e.target.value);
                  if (!dot) return;
                  setProfile((p) => ({ ...p, birth: dot }));
                }}
              />
            </div>
          </div>

          {/* 성별 */}
          <div className="mp-row">
            <div className="mp-label">성별</div>
            <div className="mp-gender">
              <label className="mp-radio">
                <input
                  type="radio"
                  name="gender"
                  checked={genderUI === "남성"}
                  onChange={() => setGenderUI("남성")}
                />
                <span>남성</span>
              </label>

              <label className="mp-radio">
                <input
                  type="radio"
                  name="gender"
                  checked={genderUI === "여성"}
                  onChange={() => setGenderUI("여성")}
                />
                <span>여성</span>
              </label>
            </div>
          </div>

          {/*전화번호*/}
          <div className="mp-row">
            <div className="mp-label">전화번호</div>
            <input
              className="mp-input mp-readonly"
              value={profile.phone}
              readOnly
              tabIndex={-1}
            />
          </div>

          <div className="mp-row">
            <div className="mp-label">주소</div>
            <input
              className="mp-input"
              value={profile.address}
              onChange={(e) =>
                setProfile((p) => ({ ...p, address: e.target.value }))
              }
            />
          </div>

          {/* bottom */}
          <div className="mp-bottom">
            <button
              className="mp-outline-btn"
              type="button"
              onClick={() => setShowPasswordModal(true)}
            >
              비밀번호 수정
            </button>

            <button
              className="mp-primary-btn"
              type="button"
              onClick={onSaveProfile}
            >
              저장
            </button>
          </div>
        </div>
      </div>

      {/* 프로필 수정 모달 */}
      {showProfileModal && (
        <div className="mp-modal-overlay" role="dialog" aria-modal="true">
          <div className="mp-modal">
            <div className="mp-modal-header">
              <div className="mp-modal-title">프로필 수정</div>
              <button
                className="mp-modal-x"
                type="button"
                onClick={() => setShowProfileModal(false)}
              >
                ×
              </button>
            </div>
            <div className="mp-modal-divider" />

            <div className="mp-modal-body center">
              <div className="mp-modal-avatar">
                {profileImage ? (
                  <img
                    className="mp-avatar-img"
                    src={profileImage}
                    alt="profile"
                  />
                ) : (
                  <div className="mp-avatar-placeholder" />
                )}
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="mp-file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setProfileImage(URL.createObjectURL(file));
                }}
              />

              <button
                className="mp-outline-btn"
                type="button"
                onClick={() => fileRef.current?.click()}
              >
                이미지 변경
              </button>

              <div className="mp-modal-actions">
                <button
                  className="mp-outline-btn"
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                >
                  취소
                </button>
                <button
                  className="mp-primary-btn"
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 비밀번호 수정 모달 */}
      {showPasswordModal && (
        <div className="mp-modal-overlay" role="dialog" aria-modal="true">
          <div className="mp-modal">
            <div className="mp-modal-header">
              <div className="mp-modal-title">비밀번호 수정</div>
              <button
                className="mp-modal-x"
                type="button"
                onClick={() => setShowPasswordModal(false)}
              >
                ×
              </button>
            </div>
            <div className="mp-modal-divider" />

            <div className="mp-modal-body">
              <input
                className="mp-modal-input"
                type="password"
                placeholder="현재 비밀번호"
              />
              <input
                className="mp-modal-input"
                type="password"
                placeholder="새 비밀번호"
              />
              <input
                className="mp-modal-input"
                type="password"
                placeholder="새 비밀번호 확인"
              />

              <div className="mp-modal-actions">
                <button
                  className="mp-outline-btn"
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                >
                  취소
                </button>
                <button
                  className="mp-primary-btn"
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
