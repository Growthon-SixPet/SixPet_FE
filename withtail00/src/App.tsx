import Header from "./components/Header";
import CategoryCard from "./components/CategoryCard";
import "./styles.css";

export default function App() {
  return (
    <div className="appRoot">
      <div className="frame1280">
        <Header />

        <div className="pageScroll">
          <section className="hero">
            <h1 className="question">어디를 찾으시나요?</h1>

            <div className="cardsRow">
              <CategoryCard
                title="동물병원"
                subtitle="내 주변 동물병원 찾기"
                variant="hospital"
                onClick={() => console.log("hospital")}
              />

              <CategoryCard
                title="반려동물 장례식장"
                subtitle="내 주변 장례식장 찾기"
                variant="funeral"
                onClick={() => console.log("funeral")}
              />
            </div>
          </section>

          {/* ✅ 프레임 내부 스크롤 확인용 */}
          <div className="bottomSpacer" />
        </div>
      </div>
    </div>
  );
}
