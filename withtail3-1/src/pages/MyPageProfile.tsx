import { useRef, useState } from "react";
import "./MyPageProfile.css";

type MenuKey = "profile" | "reservation" | "review" | "hospital";

export default function MyPageProfile() {
  const [activeMenu, setActiveMenu] = useState<MenuKey>("profile");

  const [profile, setProfile] = useState({
    nickname: "bbikgu",
    name: "김규빈",
    birth: "2001.09.27",
    gender: "남성",
    phone: "010-8282-1004",
    address: "서울 구로구",
  });

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleWithdraw = () => {
    if (window.confirm("정말 회원 탈퇴하시겠습니까?")) {
      alert("회원 탈퇴 처리 (백엔드 연동 예정)");
    }
  };

  const onSaveProfile = () => {
    alert("저장 (백엔드 연동 예정)");
  };

  return (
    <div className="mp-page">
      <div className="mp-wrap">
        <div className="mp-stage">
          {/* Sidebar */}
          <aside className="mp-sidebar">
            <div className="mp-sidebar-title">마이페이지</div>

            <button
              className={`mp-side-item ${activeMenu === "profile" ? "active" : ""}`}
              onClick={() => setActiveMenu("profile")}
              type="button"
            >
              회원 정보
            </button>

            <button
              className={`mp-side-item ${activeMenu === "reservation" ? "active" : ""}`}
              onClick={() => setActiveMenu("reservation")}
              type="button"
            >
              예약 내역 관리
            </button>

            <button
              className={`mp-side-item ${activeMenu === "review" ? "active" : ""}`}
              onClick={() => setActiveMenu("review")}
              type="button"
            >
              후기 내역 관리
            </button>

            <button
              className={`mp-side-item ${activeMenu === "hospital" ? "active" : ""}`}
              onClick={() => setActiveMenu("hospital")}
              type="button"
            >
              나의 동물 병원
            </button>

            <button
              className="mp-side-item withdraw"
              onClick={handleWithdraw}
              type="button"
            >
              회원 탈퇴
            </button>
          </aside>

          {/* Content */}
          <main className="mp-main">
            <div className="mp-main-header">
              <h2 className="mp-title">회원 정보</h2>
              <p className="mp-subtitle">
                고객님께서 가입하신 With Tail의 회원 정보입니다.
              </p>
            </div>

            <div className="mp-top-line" />

            {/* 프로필 정보 제목 + 아래 선 */}
            <div className="mp-profile-head">
              <div className="mp-profile-head-left">프로필 정보</div>
              <div className="mp-profile-head-line" />
            </div>

            <div className="mp-content">
              {/* left */}
              <div className="mp-profile-col">
                <div className="mp-avatar">
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

                <button
                  className="mp-outline-btn"
                  type="button"
                  onClick={() => setShowProfileModal(true)}
                >
                  프로필 수정
                </button>
              </div>

              {/* right */}
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
                  <input
                    className="mp-input"
                    value={profile.birth}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, birth: e.target.value }))
                    }
                  />
                </div>

                <div className="mp-row">
                  <div className="mp-label">성별</div>
                  <input
                    className="mp-input"
                    value={profile.gender}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, gender: e.target.value }))
                    }
                  />
                </div>

                <div className="mp-row">
                  <div className="mp-label">전화번호</div>
                  <input
                    className="mp-input"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, phone: e.target.value }))
                    }
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
          </main>
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
      </div>
    </div>
  );
}
