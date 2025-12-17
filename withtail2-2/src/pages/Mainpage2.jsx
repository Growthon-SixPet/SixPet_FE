import { useMemo, useState } from "react";
import "./MainPage2.css";

export default function MainPage2() {
  // 더미 데이터
  const hospitals = useMemo(
    () =>
      Array.from({ length: 104 }).map((_, i) => ({
        id: i + 1,
        name:
          i % 5 === 0
            ? "로얄 동물메디컬 센터"
            : i % 5 === 1
            ? "24시 사당동물메디컬센터"
            : i % 5 === 2
            ? "이즈동물종합병원"
            : i % 5 === 3
            ? "웨스턴 동물의료센터"
            : "24시 루시드동물메디컬센터 마이본점",
        phone: "0507-1495-7775",
        address: "서울 송파구 오금로 147 서울동물메디컬센터",
        hours: "24시간 진료 · 연중무휴",
        rating: "9.8",
        reviews: "1,862",
        price1: "22,000원",
        price2: "8,600원",
        imgUrl:
          "https://images.unsplash.com/photo-1580281657527-47f249e8f89b?auto=format&fit=crop&w=900&q=70",
      })),
    []
  );

  // 페이지네이션
  const PAGE_SIZE = 6;
  const totalPages = Math.ceil(hospitals.length / PAGE_SIZE);
  const [page, setPage] = useState(1);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return hospitals.slice(start, start + PAGE_SIZE);
  }, [page, hospitals]);

  const pageGroup = useMemo(() => {
    const groupSize = 5;
    const groupStart = Math.floor((page - 1) / groupSize) * groupSize + 1;
    const groupEnd = Math.min(groupStart + groupSize - 1, totalPages);
    return { groupStart, groupEnd };
  }, [page, totalPages]);

  const goDetail = (id) => {
    window.location.href = `/mainpage3/${id}`;
  };

  return (
    <div className="mp2">
      {/* 상단바 공간만 확보 */}
      <div className="mp2-header-placeholder" />

      <main className="mp2-shell">
        {/* 왼쪽 사이드 */}
        <aside className="mp2-left">
          <div className="mp2-mapCard">
            <div className="mp2-mapThumb">
              <button className="mp2-mapBtn">지도 보기</button>
            </div>

            <button className="mp2-filterBtn">
              <span className="mp2-filterIcon">☰</span>필터
            </button>
          </div>

          <div className="mp2-filterBox">
            <h4 className="mp2-filterTitle">동물 종류</h4>
            <label className="mp2-check">
              <input type="checkbox" /> 강아지
            </label>
            <label className="mp2-check">
              <input type="checkbox" /> 고양이
            </label>
            <label className="mp2-check">
              <input type="checkbox" /> 토끼
            </label>
            <label className="mp2-check">
              <input type="checkbox" /> 앵무새
            </label>
            <label className="mp2-check">
              <input type="checkbox" /> 기타
            </label>

            <div className="mp2-divider" />

            <h4 className="mp2-filterTitle">몸무게</h4>
            <label className="mp2-check">
              <input type="checkbox" /> 5kg 이하
            </label>
            <label className="mp2-check">
              <input type="checkbox" /> 6 ~ 10kg 이하
            </label>
            <label className="mp2-check">
              <input type="checkbox" /> 11 ~ 20kg 이하
            </label>
            <label className="mp2-check">
              <input type="checkbox" /> 21 ~ 30kg 이하
            </label>
          </div>
        </aside>

        {/* 오른쪽 리스트 */}
        <section className="mp2-right">
          <h2 className="mp2-title">‘서울’ 검색 결과 {hospitals.length}개</h2>

          <div className="mp2-list">
            {pageItems.map((h) => (
              <article className="mp2-card" key={h.id}>
                <div
                  className="mp2-photo"
                  onClick={() => goDetail(h.id)}
                >
                  <img src={h.imgUrl} alt={h.name} />
                </div>

                <div
                  className="mp2-info"
                  onClick={() => goDetail(h.id)}
                >
                  <div className="mp2-kind">동물병원</div>
                  <div className="mp2-name">{h.name}</div>

                  <div className="mp2-row">
                    <span className="mp2-dot">●</span>
                    <span className="mp2-text">{h.phone}</span>
                  </div>
                  <div className="mp2-row">
                    <span className="mp2-dot">●</span>
                    <span className="mp2-text">{h.address}</span>
                  </div>
                  <div className="mp2-row">
                    <span className="mp2-dot">●</span>
                    <span className="mp2-text">{h.hours}</span>
                  </div>

                  <div className="mp2-priceRow">
                    <div className="mp2-priceLine">
                      <span>초진비</span>
                      <span className="mp2-dash" />
                      <span>{h.price1}</span>
                    </div>
                    <div className="mp2-priceLine">
                      <span>재진비</span>
                      <span className="mp2-dash" />
                      <span>{h.price2}</span>
                    </div>
                  </div>

                  <div className="mp2-scoreRow">
                    <span className="mp2-scoreBadge">★ {h.rating}</span>
                    <span className="mp2-rev">{h.reviews}명 평가</span>
                  </div>
                </div>

                <button className="mp2-like">★</button>
              </article>
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="mp2-pagination">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))}>‹</button>

            {Array.from(
              { length: pageGroup.groupEnd - pageGroup.groupStart + 1 },
              (_, idx) => pageGroup.groupStart + idx
            ).map((n) => (
              <button
                key={n}
                className={n === page ? "active" : ""}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              ›
            </button>
          </div>
        </section>
      </main>

      {/* ✅ 푸터: 페이지 맨 아래 / 왼쪽 지도 아래까지 쭉 */}
      <footer className="mp2-footer">
        <div className="mp2-footerInner">
          <div className="mp2-footerGrid">
            <div>
              <div className="mp2-footerBrand">With Tail</div>
              <p className="mp2-footerText">
                반려동물과 함께하는 모든 순간을 소중하게 생각합니다.
              </p>
            </div>

            <div>
              <div className="mp2-footerTitle">서비스</div>
              <ul className="mp2-footerList">
                <li>동물병원 찾기</li>
                <li>장례식장 찾기</li>
                <li>리뷰 작성</li>
              </ul>
            </div>

            <div>
              <div className="mp2-footerTitle">정보</div>
              <ul className="mp2-footerList">
                <li>이용약관</li>
                <li>개인정보처리방침</li>
                <li>문의하기</li>
              </ul>
            </div>

            <div>
              <div className="mp2-footerTitle">연락처</div>
              <div className="mp2-footerText">Email: support@withtail.com</div>
              <div className="mp2-footerText">Phone: 1234-5678</div>
            </div>
          </div>

          <div className="mp2-footerBottom">
            © 2024 With Tail. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
