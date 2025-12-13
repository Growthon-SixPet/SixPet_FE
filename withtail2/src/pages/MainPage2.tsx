import { useMemo, useState } from "react";
import styles from "./MainPage2.module.css";

type Item = {
  id: number;
  name: string;
  phone: string;
  address: string;
  hours: string;
  score: number;
  reviews: number;
};

const DATA: Item[] = Array.from({ length: 60 }).map((_, idx) => ({
  id: idx + 1,
  name: `로얄 동물 메디컬 센터 ${idx + 1}`,
  phone: "0507-1234-5678",
  address: "서울 ○○구 ○○로 12",
  hours: "24시간 진료 · 일요일 휴무",
  score: 9.8,
  reviews: 1862,
}));

export default function MainPage2() {
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.ceil(DATA.length / pageSize);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return DATA.slice(start, start + pageSize);
  }, [page]);

  const go = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const visible = 5;
  const start = Math.max(
    1,
    Math.min(page - Math.floor(visible / 2), totalPages - visible + 1)
  );
  const end = Math.min(totalPages, start + visible - 1);
  const pages = [];
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <div className={styles.page}>
      {/* HEADER (나중에 컴포넌트 교체) */}
      <div className={styles.header}>With Tail Header</div>

      {/* ✅ 1280 고정 프레임 */}
      <div className={styles.frame}>
        <div className={styles.layout}>
          {/* LEFT FILTER */}
          <aside className={styles.filter}>
            <button className={styles.mapBtn}>지도 보기</button>

            <div className={styles.filterBlock}>
              <h4>동물 종류</h4>
              <label>
                <input type="checkbox" /> 강아지
              </label>
              <label>
                <input type="checkbox" /> 고양이
              </label>
              <label>
                <input type="checkbox" /> 기타
              </label>
            </div>

            <div className={styles.filterBlock}>
              <h4>몸무게</h4>
              <label>
                <input type="checkbox" /> 5kg 이하
              </label>
              <label>
                <input type="checkbox" /> 6~10kg
              </label>
              <label>
                <input type="checkbox" /> 11~20kg
              </label>
            </div>
          </aside>

          {/* RIGHT LIST */}
          <section className={styles.listSection}>
            <h2 className={styles.resultTitle}>서울 · 검색 결과 104개</h2>

            <div className={styles.cardList}>
              {pageItems.map((it) => (
                <div key={it.id} className={styles.card}>
                  <div className={styles.thumbnail} />
                  <div className={styles.cardInfo}>
                    <h3>{it.name}</h3>
                    <p>📞 {it.phone}</p>
                    <p>📍 {it.address}</p>
                    <p>⏰ {it.hours}</p>

                    <div className={styles.rating}>
                      <span className={styles.score}>⭐ {it.score}</span>
                      <span className={styles.review}>
                        {it.reviews.toLocaleString()}명 평가
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={() => go(page - 1)}
                disabled={page === 1}
              >
                ‹
              </button>

              {pages.map((p) => (
                <button
                  key={p}
                  className={`${styles.pageNum} ${
                    p === page ? styles.active : ""
                  }`}
                  onClick={() => go(p)}
                >
                  {p}
                </button>
              ))}

              <button
                className={styles.pageBtn}
                onClick={() => go(page + 1)}
                disabled={page === totalPages}
              >
                ›
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* FOOTER (1280 프레임 안에) */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div>
            <h4>With Tail</h4>
            <p>반려동물과 함께하는 모든 순간을 소중하게</p>
          </div>

          <div>
            <h4>서비스</h4>
            <p>동물병원 찾기</p>
            <p>리뷰 작성</p>
          </div>

          <div>
            <h4>연락처</h4>
            <p>Email: support@withtail.com</p>
            <p>Phone: 1234-5678</p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          © 2024 With Tail. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
