import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./MainPage0.css";

export default function MainPage0() {
  return (
    <div className="mp0-root">
      {/* 1280 x 832 고정 + 내부 스크롤 */}
      <div className="mp0-viewport">
        <Header />

        <main className="mp0-frame">
          <section className="mp0-hero">
            <h1 className="mp0-title">무엇을 찾고계신가요?</h1>
            <p className="mp0-subtitle">
              반려 동물을 위한 최고의 서비스를 찾아보세요.
            </p>
          </section>

          <section className="mp0-cards">
            <article className="mp0-card">
              <div className="mp0-iconCircle mp0-iconCircle--blue">❤️</div>
              <h2 className="mp0-cardTitle">동물병원 찾기</h2>
              <p className="mp0-cardDesc">
                반려동물의 건강을 위한 최고의 동물병원을<br />
                찾아보세요
              </p>
              <Link to="/hospital" className="mp0-btn mp0-btn--blue">
                검색하기
              </Link>
            </article>

            <article className="mp0-card">
              <div className="mp0-iconCircle mp0-iconCircle--purple">🌸</div>
              <h2 className="mp0-cardTitle">장례식장 찾기</h2>
              <p className="mp0-cardDesc">
                소중한 반려동물을 위한 따뜻한 장례식장을<br />
                찾아보세요
              </p>
              <Link to="/funeral" className="mp0-btn mp0-btn--purple">
                검색하기
              </Link>
            </article>
          </section>

          {/* WithTail 소개 영역 */}
          <section className="mp0-about">
            <h3 className="mp0-aboutTitle">WithTail에 대해</h3>
            <p className="mp0-aboutText">
              함께하는 꼬리로 어쩌구 저쩌구
            </p>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
