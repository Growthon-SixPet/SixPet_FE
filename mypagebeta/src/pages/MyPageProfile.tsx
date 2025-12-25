import { useEffect, useMemo, useRef, useState } from "react";
import "./MyPageProfile.css";
import {
  changeMyPassword,
  fetchMyProfile,
  updateMyProfile,
  uploadProfileImage,
  type GenderAPI,
} from "../api/user"; 

type GenderUI = "남성" | "여성";

const pad2 = (n: number) => String(n).padStart(2, "0");

const dotToDash = (v: string) => v.replaceAll(".", "-");

const dateToDot = (v: string) => {
  if (!v) return "";
  const [y, m, d] = v.split("-");
  if (!y || !m || !d) return "";
  return `${y}.${pad2(Number(m))}.${pad2(Number(d))}`;
};

const apiGenderToUi = (g: GenderAPI): GenderUI => (g === "MALE" ? "남성" : "여성");
const uiGenderToApi = (g: GenderUI): GenderAPI => (g === "남성" ? "MALE" : "FEMALE");

export default function MyPageProfile() {
  const [profile, setProfile] = useState({
    nickname: "",
    name: "",
    birth: "",
    phone: "", 
    address: "",
  });

  const [genderUI, setGenderUI] = useState<GenderUI>("남성");

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const birthPickerRef = useRef<HTMLInputElement | null>(null);

  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const me = await fetchMyProfile();

        setProfile({
          nickname: me.nickname ?? "",
          name: me.result?.name ?? me.name ?? "", 
          birth: dateToDot(me.birthDate ?? ""),
          phone: me.phoneNumber ?? "",
          address: me.address ?? "",
        });

        setGenderUI(apiGenderToUi(me.gender));
        setProfileImage(me.profileImage ?? null);
      } catch (e) {
        console.error(e);
        alert("프로필 조회에 실패했습니다. (로그인/토큰 확인)");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSaveProfile = async () => {
    const genderApi = uiGenderToApi(genderUI);

    const body = {
      nickname: profile.nickname,
      name: profile.name,
      birthDate: dotToDash(profile.birth),
      gender: genderApi,
      address: profile.address,
    };

    try {
      setLoading(true);
      const updated = await updateMyProfile(body);

      setProfile((p) => ({
        ...p,
        nickname: updated.nickname ?? p.nickname,
        birth: dateToDot(updated.birthDate ?? dotToDash(p.birth)),
        phone: updated.phoneNumber ?? p.phone,
        address: updated.address ?? p.address,
      }));
      setGenderUI(apiGenderToUi(updated.gender));
      setProfileImage(updated.profileImage ?? null);

      alert("저장 완료");
    } catch (e) {
      console.error(e);
      alert("저장 실패 (입력값/토큰/서버 응답 확인)");
    } finally {
      setLoading(false);
    }
  };

  const onSavePassword = async () => {
    if (!curPw) return alert("현재 비밀번호를 입력하세요.");
    if (!newPw) return alert("새 비밀번호를 입력하세요.");
    if (newPw !== newPw2) return alert("새 비밀번호 확인이 일치하지 않습니다.");

    try {
      setLoading(true);
      await changeMyPassword({
        currentPassword: curPw,
        newPassword: newPw,
        newPasswordConfirm: newPw2,
      });

      alert("비밀번호가 변경되었습니다.");
      setShowPasswordModal(false);
      setCurPw("");
      setNewPw("");
      setNewPw2("");
    } catch (e) {
      console.error(e);
      alert("비밀번호 변경 실패 (현재 비밀번호 확인)");
    } finally {
      setLoading(false);
    }
  };

  const onPickImage = () => fileRef.current?.click();

  const onChangeImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);
    setProfileImage(URL.createObjectURL(file));
  };

  const onSaveProfileImage = async () => {
    if (!selectedImageFile) {
      alert("이미지를 선택해주세요.");
      return;
    }

    try {
      setLoading(true);
      const updated = await uploadProfileImage(selectedImageFile);

      setProfileImage(updated.profileImage ?? null);
      setSelectedImageFile(null);
      setShowProfileModal(false);

      alert("프로필 이미지가 변경되었습니다.");
    } catch (e) {
      console.error(e);
      alert("이미지 업로드 실패");
    } finally {
      setLoading(false);
    }
  };

  const birthText = useMemo(() => profile.birth || "YYYY.MM.DD", [profile.birth]);

  return (
    <section className="mp-main profile">
      <div className="mp-main-top">
        <header className="mp-main-header">
          <h2 className="mp-title">회원 정보</h2>
          <p className="mp-subtitle">고객님께서 가입하신 With Tail의 회원 정보입니다.</p>
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
            disabled={loading}
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
              onChange={(e) => setProfile((p) => ({ ...p, nickname: e.target.value }))}
              disabled={loading}
            />
          </div>

          <div className="mp-row">
            <div className="mp-label">이름</div>
            <input
              className="mp-input"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              disabled={loading}
            />
          </div>

          <div className="mp-row">
            <div className="mp-label">생일</div>

            <div className="mp-birth-inline">
              <span className="mp-birth-text">{birthText}</span>

              <button
                type="button"
                className="mp-calendar-btn"
                aria-label="calendar"
                onClick={() => birthPickerRef.current?.showPicker?.()}
                disabled={loading}
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
                disabled={loading}
              />
            </div>
          </div>

          <div className="mp-row">
            <div className="mp-label">성별</div>
            <div className="mp-gender">
              <label className="mp-radio">
                <input
                  type="radio"
                  name="gender"
                  checked={genderUI === "남성"}
                  onChange={() => setGenderUI("남성")}
                  disabled={loading}
                />
                <span>남성</span>
              </label>

              <label className="mp-radio">
                <input
                  type="radio"
                  name="gender"
                  checked={genderUI === "여성"}
                  onChange={() => setGenderUI("여성")}
                  disabled={loading}
                />
                <span>여성</span>
              </label>
            </div>
          </div>

          <div className="mp-row">
            <div className="mp-label">전화번호</div>
            <input className="mp-input mp-readonly" value={profile.phone} readOnly tabIndex={-1} />
          </div>

          <div className="mp-row">
            <div className="mp-label">주소</div>
            <input
              className="mp-input"
              value={profile.address}
              onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
              disabled={loading}
            />
          </div>

          <div className="mp-bottom">
            <button
              className="mp-outline-btn"
              type="button"
              onClick={() => setShowPasswordModal(true)}
              disabled={loading}
            >
              비밀번호 수정
            </button>

            <button className="mp-primary-btn" type="button" onClick={onSaveProfile} disabled={loading}>
              저장
            </button>
          </div>
        </div>
      </div>

      {showProfileModal && (
        <div className="mp-modal-overlay" role="dialog" aria-modal="true">
          <div className="mp-modal">
            <div className="mp-modal-header">
              <div className="mp-modal-title">프로필 수정</div>
              <button
                className="mp-modal-x"
                type="button"
                onClick={() => {
                  setShowProfileModal(false);
                  setSelectedImageFile(null);
                }}
                disabled={loading}
              >
                ×
              </button>
            </div>
            <div className="mp-modal-divider" />

            <div className="mp-modal-body center">
              <div className="mp-modal-avatar">
                {profileImage ? (
                  <img className="mp-avatar-img" src={profileImage} alt="profile" />
                ) : (
                  <div className="mp-avatar-placeholder" />
                )}
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="mp-file"
                onChange={onChangeImageFile}
              />

              <button className="mp-outline-btn" type="button" onClick={onPickImage} disabled={loading}>
                이미지 변경
              </button>

              <div className="mp-modal-actions">
                <button
                  className="mp-outline-btn"
                  type="button"
                  onClick={() => {
                    setShowProfileModal(false);
                    setSelectedImageFile(null);
                  }}
                  disabled={loading}
                >
                  취소
                </button>
                <button className="mp-primary-btn" type="button" onClick={onSaveProfileImage} disabled={loading}>
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="mp-modal-overlay" role="dialog" aria-modal="true">
          <div className="mp-modal">
            <div className="mp-modal-header">
              <div className="mp-modal-title">비밀번호 수정</div>
              <button
                className="mp-modal-x"
                type="button"
                onClick={() => setShowPasswordModal(false)}
                disabled={loading}
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
                value={curPw}
                onChange={(e) => setCurPw(e.target.value)}
                disabled={loading}
              />
              <input
                className="mp-modal-input"
                type="password"
                placeholder="새 비밀번호"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                disabled={loading}
              />
              <input
                className="mp-modal-input"
                type="password"
                placeholder="새 비밀번호 확인"
                value={newPw2}
                onChange={(e) => setNewPw2(e.target.value)}
                disabled={loading}
              />

              <div className="mp-modal-actions">
                <button
                  className="mp-outline-btn"
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={loading}
                >
                  취소
                </button>
                <button className="mp-primary-btn" type="button" onClick={onSavePassword} disabled={loading}>
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
