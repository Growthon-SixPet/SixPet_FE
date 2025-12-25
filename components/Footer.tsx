import "./Footer.css";

export default function Footer() {
  return (
    <footer className="wt-footer">
      <div className="wt-footer-inner">
        <div className="wt-footer-grid">
          <div className="wt-footer-brand">
            <div className="wt-footer-brandTitle">
              <span className="wt-footer-heart">♡</span>
              <span className="wt-footer-brandName">WithTail</span>
            </div>
            <p className="wt-footer-brandDesc">
              반려동물을 위한 최고의 동물병원을
              <br />
              찾아드립니다.
            </p>
          </div>

          <div className="wt-footer-col">
            <div className="wt-footer-colTitle">서비스</div>
            <ul className="wt-footer-list">
              <li>병원찾기</li>
              <li>후기보기</li>
              <li>병원등록</li>
            </ul>
          </div>

          <div className="wt-footer-col">
            <div className="wt-footer-colTitle">고객지원</div>
            <ul className="wt-footer-list">
              <li>자주 묻는 질문</li>
              <li>고객센터</li>
              <li>이용약관</li>
            </ul>
          </div>

          <div className="wt-footer-col wt-footer-contact">
            <div className="wt-footer-colTitle">연락처</div>
            <div className="wt-footer-contactText">
              이메일: help@petcarefinder.com
              <br />
              전화: 1588-0000
              <br />
              운영시간: 평일 9:00-18:00
            </div>
          </div>
        </div>

        <div className="wt-footer-divider" />

        <div className="wt-footer-copy">
          © 2024 펫케어파인더. Allrights reserved.
        </div>
      </div>
    </footer>
  );
}
