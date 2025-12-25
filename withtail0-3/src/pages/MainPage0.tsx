import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./MainPage0.css";

export default function MainPage0() {
  return (
    <div className="mp0-root">
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
              <div className="mp0-iconCircle mp0-iconCircle--blue">
                <img src="../../images/Vector.png" />
              </div>
              <h2 className="mp0-cardTitle">동물병원 찾기</h2>
              <p className="mp0-cardDesc">
                반려동물의 건강을 위한 최고의 동물병원을
                <br />
                찾아보세요
              </p>
              <Link to="/hospital" className="mp0-btn mp0-btn--blue">
                검색하기
              </Link>
            </article>

            <article className="mp0-card">
              <div className="mp0-iconCircle mp0-iconCircle--purple">
                <img src="../../images/mdi_flower-outline.png" />
              </div>
              <h2 className="mp0-cardTitle">장례식장 찾기</h2>
              <p className="mp0-cardDesc">
                소중한 반려동물을 위한 따뜻한 장례식장을
                <br />
                찾아보세요
              </p>
              <Link to="/funeral" className="mp0-btn mp0-btn--purple">
                검색하기
              </Link>
            </article>
          </section>

          <section className="mp0-about">
            <h3 className="mp0-aboutTitle">WithTail에 대해</h3>
            <p className="mp0-aboutText">
              WithTail은 반려동물과 보호자의 삶 전반을 함께하는 플랫폼입니다.
              <br />
              질병과 치료가 필요한 순간에는 믿을 수 있는 동물병원을,
              <br />
              이별의 순간에는 정성 어린 장례식장을 안내합니다.
              <br />
              정보의 혼란 속에서 고민하지 않도록 WithTail이 가장 필요한 선택을
              돕습니다.
              <br />
            </p>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
