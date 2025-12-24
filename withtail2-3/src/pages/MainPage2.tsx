import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ 협업 컴포넌트 (경로는 프로젝트에 맞게 수정)
import Header from "../components/Header";
import Footer from "../components/Footer";

type SortOption = "RATING_DESC" | "REVIEWS_DESC";

type Specialty =
  | "전체"
  | "내과"
  | "외과"
  | "정형외과"
  | "안과"
  | "피부과"
  | "치과"
  | "영상의학"
  | "예방접종";

type Animal =
  | "전체"
  | "강아지"
  | "고양이"
  | "토끼"
  | "햄스터"
  | "앵무새"
  | "거미"
  | "거북이"
  | "기타";

type Hospital = {
  id: number;
  name: string;
  categoryLabel: string;
  address: string;
  hoursLabel: string;
  phone: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  specialty: Exclude<Specialty, "전체">;
  animals: Exclude<Animal, "전체">[];
  is24h: boolean;
  isNight: boolean;
};

const BRAND = "#2EAADC";
const PAGE_BG = "#FFFFFF";
const BOOKMARK_RED = "#FF0000";

const PER_PAGE = 5;        // ✅ 한 페이지에 5개
const WINDOW_SIZE = 4;     // ✅ 페이지 버튼은 최대 4개만 보이게(슬라이딩)

export default function MainPage2() {
  const navigate = useNavigate();

  // ✅ 검색 입력(프론트용)
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  // ✅ 필터 상태
  const [sort, setSort] = useState<SortOption>("RATING_DESC");
  const [specialty, setSpecialty] = useState<Specialty>("전체");
  const [animal, setAnimal] = useState<Animal>("전체");
  const [only24h, setOnly24h] = useState(false);
  const [onlyNight, setOnlyNight] = useState(false);

  // ✅ 페이지
  const [page, setPage] = useState(1);

  // ✅ 북마크
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>({});

  // ✅ 더미 병원 데이터 (백엔드 연결 전)
  const hospitals: Hospital[] = useMemo(
    () => [
      {
        id: 1,
        name: "그레이스 고양이 병원",
        categoryLabel: "동물병원",
        address: "서울 강남구 선릉로 152길 17 아시아첨단부티크 3층",
        hoursLabel: "진료중 · 24시간운영",
        phone: "0507-1395-5569",
        tags: ["반려동물환자", "예약", "무선인터넷", "주차"],
        rating: 4.9,
        reviewCount: 312,
        imageUrl: "",
        specialty: "치과",
        animals: ["고양이"],
        is24h: true,
        isNight: true,
      },
      {
        id: 2,
        name: "SD동물의료센터 서울점",
        categoryLabel: "동물병원",
        address: "서울 중구 왕십리로 407 신당파인힐하나부로",
        hoursLabel: "진료중 · 24시간운영",
        phone: "0507-1329-0303",
        tags: ["반려동물환자", "예약", "무선인터넷", "주차"],
        rating: 4.9,
        reviewCount: 312,
        imageUrl: "",
        specialty: "내과",
        animals: ["강아지", "고양이"],
        is24h: true,
        isNight: true,
      },
      {
        id: 3,
        name: "오복동물치과병원",
        categoryLabel: "동물병원",
        address: "서울 마포구 독막로 257 1층",
        hoursLabel: "진료중 · 24시간운영",
        phone: "0507-1487-6118",
        tags: ["반려동물환자", "예약", "무선인터넷", "주차"],
        rating: 4.9,
        reviewCount: 312,
        imageUrl: "",
        specialty: "치과",
        animals: ["강아지"],
        is24h: true,
        isNight: false,
      },
      {
        id: 4,
        name: "힐링동물병원",
        categoryLabel: "동물병원",
        address: "서울 마포구 백범로31길 7 101동 104호",
        hoursLabel: "진료중 · 24시간운영",
        phone: "02-716-8275",
        tags: ["반려동물환자", "예약", "무선인터넷", "주차"],
        rating: 4.8,
        reviewCount: 500,
        imageUrl: "",
        specialty: "외과",
        animals: ["강아지", "토끼"],
        is24h: true,
        isNight: true,
      },
      {
        id: 5,
        name: "링크 동물의료센터",
        categoryLabel: "동물병원",
        address: "서울 서대문구 신촌로 209",
        hoursLabel: "진료중 · 24시간운영",
        phone: "02-393-7577",
        tags: ["반려동물환자", "예약", "무선인터넷", "주차"],
        rating: 4.7,
        reviewCount: 210,
        imageUrl: "",
        specialty: "영상의학",
        animals: ["강아지", "고양이", "거북이"],
        is24h: true,
        isNight: true,
      },
      // ✅ 페이지 슬라이딩 테스트용 더미 (25개처럼 늘려도 자동 동작)
      ...Array.from({ length: 20 }, (_, i) => {
        const id = 6 + i;
        return {
          id,
          name: `테스트 동물병원 ${id}`,
          categoryLabel: "동물병원",
          address: `서울 어딘가 ${id}번지`,
          hoursLabel: i % 2 === 0 ? "진료중 · 24시간운영" : "진료중 · 야간운영",
          phone: `02-000-${String(id).padStart(4, "0")}`,
          tags: ["예약", "주차"],
          rating: 4.0 + (i % 10) * 0.1,
          reviewCount: 50 + i * 7,
          imageUrl: "",
          specialty: (["내과", "외과", "치과", "피부과"] as const)[i % 4],
          animals: (i % 3 === 0 ? ["강아지", "고양이"] : ["강아지"]) as any,
          is24h: i % 2 === 0,
          isNight: true,
        } as Hospital;
      }),
    ],
    []
  );

  // ✅ 검색 버튼 누르는 효과(현재는 프론트만: page 1로 리셋)
  const onSearch = () => {
    setPage(1);
  };

  // ✅ 필터/정렬 적용
  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    const loc = location.trim().toLowerCase();

    let list = hospitals.filter((h) => {
      const matchKeyword =
        kw.length === 0 ||
        h.name.toLowerCase().includes(kw) ||
        h.tags.some((t) => t.toLowerCase().includes(kw));

      const matchLocation =
        loc.length === 0 || h.address.toLowerCase().includes(loc);

      const matchSpecialty =
        specialty === "전체" || h.specialty === specialty;

      const matchAnimal =
        animal === "전체" || h.animals.includes(animal as any);

      const match24h = !only24h || h.is24h;
      const matchNight = !onlyNight || h.isNight;

      return (
        matchKeyword &&
        matchLocation &&
        matchSpecialty &&
        matchAnimal &&
        match24h &&
        matchNight
      );
    });

    if (sort === "RATING_DESC") {
      list = list.sort((a, b) => b.rating - a.rating);
    } else {
      list = list.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return list;
  }, [hospitals, keyword, location, specialty, animal, only24h, onlyNight, sort]);

  // ✅ 총 페이지(제한 없음): 25개면 5페이지, 100개면 20페이지
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  }, [filtered.length]);

  // ✅ page 범위 자동 보정
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  // ✅ 현재 페이지 데이터
  const pageItems = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, page]);

  // ✅ 슬라이딩 페이지 버튼(1234 -> 2345)
  const visiblePages = useMemo(() => {
    const maxStart = Math.max(1, totalPages - WINDOW_SIZE + 1);
    const start = Math.min(Math.max(1, page), maxStart);
    const end = Math.min(totalPages, start + WINDOW_SIZE - 1);

    const arr: number[] = [];
    for (let p = start; p <= end; p++) arr.push(p);
    return arr;
  }, [page, totalPages]);

  const toggleBookmark = (id: number) => {
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ✅ 상세보기 이동(상세 페이지는 다른 사람이 제작)
  const goDetail = (id: number) => {
    // 팀 라우트 규칙이 다르면 여기만 바꾸면 됨
    navigate(`/hospital/${id}`);
  };

  return (
    <div style={styles.stage}>
      <Header />

      {/* ✅ 본문: 높이 832 안에서 스크롤 */}
      <div style={styles.bodyScroll}>
        {/* ✅ 검색 바 영역 */}
        <div style={styles.searchWrap}>
          <div style={styles.searchBar}>
            <div style={styles.searchInputGroup}>
              <span style={styles.icon}>🔍</span>
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="진료과목 / 병원명"
                style={styles.searchInput}
              />
            </div>

            <div style={styles.searchInputGroup}>
              <span style={styles.icon}>📍</span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="지역"
                style={styles.searchInput}
              />
            </div>

            <button style={styles.searchBtn} onClick={onSearch}>
              검색
            </button>
          </div>
        </div>

        {/* ✅ 메인 2컬럼 */}
        <div style={styles.mainGrid}>
          {/* 왼쪽 필터 */}
          <aside style={styles.filterCard}>
            <div style={styles.filterTitleRow}>
              <span style={styles.filterIcon}>⏷</span>
              <span style={styles.filterTitle}>필터</span>
            </div>

            <div style={styles.filterSection}>
              <div style={styles.filterLabel}>정렬 기준</div>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as SortOption);
                  setPage(1);
                }}
                style={styles.select}
              >
                <option value="RATING_DESC">평점 높은 순</option>
                <option value="REVIEWS_DESC">후기 많은 순</option>
              </select>
            </div>

            <div style={styles.filterSection}>
              <div style={styles.filterLabel}>전문 분야</div>
              <select
                value={specialty}
                onChange={(e) => {
                  setSpecialty(e.target.value as Specialty);
                  setPage(1);
                }}
                style={styles.select}
              >
                <option value="전체">전체</option>
                <option value="내과">내과</option>
                <option value="외과">외과</option>
                <option value="정형외과">정형외과</option>
                <option value="안과">안과</option>
                <option value="피부과">피부과</option>
                <option value="치과">치과</option>
                <option value="영상의학">영상의학</option>
                <option value="예방접종">예방접종</option>
              </select>
            </div>

            <div style={styles.filterSection}>
              <div style={styles.filterLabel}>운영 시간</div>

              <label style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={only24h}
                  onChange={(e) => {
                    setOnly24h(e.target.checked);
                    setPage(1);
                  }}
                />
                <span>24시간 운영</span>
              </label>

              <label style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={onlyNight}
                  onChange={(e) => {
                    setOnlyNight(e.target.checked);
                    setPage(1);
                  }}
                />
                <span>야간 운영</span>
              </label>
            </div>

            <div style={styles.filterSection}>
              <div style={styles.filterLabel}>동물 종</div>
              <select
                value={animal}
                onChange={(e) => {
                  setAnimal(e.target.value as Animal);
                  setPage(1);
                }}
                style={styles.select}
              >
                <option value="전체">전체</option>
                <option value="강아지">강아지</option>
                <option value="고양이">고양이</option>
                <option value="토끼">토끼</option>
                <option value="햄스터">햄스터</option>
                <option value="앵무새">앵무새</option>
                <option value="거미">거미</option>
                <option value="거북이">거북이</option>
                <option value="기타">기타</option>
              </select>
            </div>
          </aside>

          {/* 오른쪽 리스트 */}
          <section style={styles.listArea}>
            <div style={styles.resultTitle}>검색 결과 ({filtered.length})</div>

            {filtered.length === 0 ? (
              <div style={styles.empty}>검색 결과가 없습니다.</div>
            ) : (
              <div style={styles.cards}>
                {pageItems.map((h) => (
                  <div key={h.id} style={styles.card}>
                    <div style={styles.cardLeft}>
                      <div style={styles.thumb}>
                        <div style={styles.thumbFallback}>IMG</div>
                      </div>
                    </div>

                    <div style={styles.cardMid}>
                      <div style={styles.cardHeaderRow}>
                        <div style={styles.hName}>{h.name}</div>

                        <div style={styles.ratingWrap}>
                          <span style={styles.star}>★</span>
                          <span style={styles.ratingNum}>
                            {h.rating.toFixed(1)}
                          </span>
                          <span style={styles.reviewCnt}>({h.reviewCount})</span>
                        </div>
                      </div>

                      <div style={styles.category}>{h.categoryLabel}</div>

                      <div style={styles.infoRow}>
                        <span style={styles.infoIcon}>📍</span>
                        <span style={styles.infoText}>{h.address}</span>
                      </div>

                      <div style={styles.infoRow}>
                        <span style={styles.infoIcon}>🕒</span>
                        <span style={styles.infoText}>{h.hoursLabel}</span>
                      </div>

                      <div style={styles.infoRow}>
                        <span style={styles.infoIcon}>📞</span>
                        <span style={styles.infoText}>{h.phone}</span>
                      </div>

                      <div style={styles.tagsRow}>
                        <span style={styles.infoIcon}>🏢</span>
                        <span style={styles.tagsText}>{h.tags.join(", ")}</span>
                      </div>
                    </div>

                    <div style={styles.cardRight}>
                      {/* ✅ 북마크 */}
                      <button
                        onClick={() => toggleBookmark(h.id)}
                        style={styles.bookmarkBtn}
                        aria-label="bookmark"
                      >
                        <BookmarkIcon
                          active={!!bookmarks[h.id]}
                          activeColor={BOOKMARK_RED}
                        />
                      </button>

                      {/* ✅ 상세보기: 페이지 이동만 */}
                      <button
                        style={styles.detailBtn}
                        onClick={() => goDetail(h.id)}
                      >
                        상세보기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ✅ 페이지네이션: 4개만 보이되 슬라이딩 */}
            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button
                  style={styles.pageNavBtn}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  title="이전"
                >
                  ‹
                </button>

                {visiblePages.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{
                      ...styles.pageBtn,
                      ...(p === page ? styles.pageBtnActive : {}),
                    }}
                  >
                    {p}
                  </button>
                ))}

                <button
                  style={styles.pageNavBtn}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  title="다음"
                >
                  ›
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function BookmarkIcon({
  active,
  activeColor,
}: {
  active: boolean;
  activeColor: string;
}) {
  const fill = active ? activeColor : "transparent";
  const stroke = active ? activeColor : "#111";

  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 3h12a1 1 0 0 1 1 1v18l-7-4-7 4V4a1 1 0 0 1 1-1z"
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const styles: Record<string, React.CSSProperties> = {
  stage: {
    width: "1280px",
    height: "832px",
    background: PAGE_BG,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    border: "1px solid #ddd",
    margin: "0 auto",
  },

  bodyScroll: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    background: "#f7f7f7",
  },

  searchWrap: {
    padding: "18px 0 10px",
    display: "flex",
    justifyContent: "center",
  },

  searchBar: {
    width: "860px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    padding: "14px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  searchInputGroup: {
    flex: 1,
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "10px 12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#fff",
  },

  icon: { opacity: 0.7 },

  searchInput: {
    width: "100%",
    border: "none",
    outline: "none",
    fontSize: "14px",
  },

  searchBtn: {
    width: "150px",
    height: "42px",
    border: "none",
    borderRadius: "10px",
    background: BRAND,
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },

  mainGrid: {
  width: "1000px",                 // ✅ 전체 폭 살짝 넓혀서 와이어프레임 느낌
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "180px 1fr", // ✅ 필터폭에 맞게 줄임 (거리 확 줄어듦)
  gap: "12px",                      // ✅ 간격도 더 좁게
  padding: "12px 0 28px",
  },


  filterCard: {
  background: "#fff",
  borderRadius: "12px",
  border: "1px solid #e5e5e5",
  padding: "10px",
  height: "350px",
  width: "100%",     // ✅ 컬럼 폭 꽉 채우기
  boxSizing: "border-box",
  },


  filterTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
  },

  filterIcon: { fontSize: "16px", opacity: 0.8 },
  filterTitle: { fontWeight: 800 },

  filterSection: { marginTop: "14px" },

  filterLabel: {
    fontSize: "12px",
    color: "#666",
    fontWeight: 700,
    marginBottom: "6px",
  },

  select: {
    width: "100%",
    height: "38px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    padding: "0 10px",
    outline: "none",
    background: "#fff",
  },

  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    marginTop: "8px",
  },

  listArea: { minHeight: "500px" },

  resultTitle: { fontWeight: 800, margin: "8px 0 10px" },

  empty: {
    background: "#fff",
    border: "1px solid #e5e5e5",
    borderRadius: "12px",
    padding: "20px",
    color: "#666",
  },

  cards: { display: "flex", flexDirection: "column", gap: "14px" },

  card: {
    background: "#fff",
    border: "1px solid #e5e5e5",
    borderRadius: "12px",
    padding: "14px",
    display: "grid",
    gridTemplateColumns: "130px 1fr 120px",
    gap: "14px",
    alignItems: "stretch",
  },

  cardLeft: { display: "flex" },

  thumb: {
    width: "130px",
    height: "110px",
    borderRadius: "10px",
    overflow: "hidden",
    background: "#f0f0f0",
    border: "1px solid #e5e5e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  thumbFallback: { fontWeight: 900, color: "#999" },

  cardMid: { display: "flex", flexDirection: "column", gap: "6px" },

  cardHeaderRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },

  hName: { fontSize: "16px", fontWeight: 900 },

  ratingWrap: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    whiteSpace: "nowrap",
  },

  star: { color: "#f5b301", fontSize: "16px" },
  ratingNum: { fontWeight: 900 },
  reviewCnt: { color: "#666", fontSize: "13px" },

  category: { color: "#666", fontSize: "13px", marginTop: "2px" },

  infoRow: { display: "flex", gap: "8px", alignItems: "center" },
  infoIcon: { opacity: 0.75 },
  infoText: { fontSize: "13px", color: "#333" },

  tagsRow: { display: "flex", gap: "8px", alignItems: "center" },
  tagsText: { fontSize: "12px", color: "#555" },

  cardRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  bookmarkBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: "0",
  },

  detailBtn: {
    width: "92px",
    height: "38px",
    border: "none",
    borderRadius: "10px",
    background: BRAND,
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },

  pagination: {
    marginTop: "18px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    alignItems: "center",
  },

  pageNavBtn: {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 900,
    opacity: 1,
  },

  pageBtn: {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 800,
  },

  pageBtnActive: {
    borderColor: BRAND,
    color: BRAND,
  },
};
