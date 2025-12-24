import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

import styles from "./MainPage2.module.css";

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

type Region =
  | "서울"
  | "인천/경기"
  | "강원"
  | "충남/충북"
  | "전남/전북"
  | "경북/경남"
  | "제주";

const REGIONS: Region[] = [
  "서울",
  "인천/경기",
  "강원",
  "충남/충북",
  "전남/전북",
  "경북/경남",
  "제주",
];

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

const PER_PAGE = 5;
const WINDOW_SIZE = 4;

export default function MainPage2() {
  const navigate = useNavigate();

  // ✅ 검색 입력(타이핑용)
  const [keywordInput, setKeywordInput] = useState("");

  // ✅ 지역(선택용)
  const [regionOpen, setRegionOpen] = useState(false);
  const [region, setRegion] = useState<Region | "">("");

  // ✅ 검색 적용값(검색 버튼 눌렀을 때만 바뀜)
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState(""); // region 문자열이 들어감

  // ✅ 필터 상태(즉시 적용)
  const [sort, setSort] = useState<SortOption>("RATING_DESC");
  const [specialty, setSpecialty] = useState<Specialty>("전체");
  const [animal, setAnimal] = useState<Animal>("전체");
  const [only24h, setOnly24h] = useState(false);
  const [onlyNight, setOnlyNight] = useState(false);

  // ✅ 페이지
  const [page, setPage] = useState(1);

  // ✅ 북마크
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>({});

  // ✅ 더미 병원 데이터
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
      ...Array.from({ length: 20 }, (_, i) => {
        const id = 6 + i;
        const regionLabel =
          i % 7 === 0
            ? "서울"
            : i % 7 === 1
            ? "인천/경기"
            : i % 7 === 2
            ? "강원"
            : i % 7 === 3
            ? "충남/충북"
            : i % 7 === 4
            ? "전남/전북"
            : i % 7 === 5
            ? "경북/경남"
            : "제주";

        return {
          id,
          name: `테스트 동물병원 ${id}`,
          categoryLabel: "동물병원",
          address: `${regionLabel} 어딘가 ${id}번지`,
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

  // ✅ 검색 버튼: 입력값을 적용값으로 반영
  const onSearch = () => {
    setKeyword(keywordInput);
    setLocation(region);
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
        h.tags.some((t) => t.toLowerCase().includes(kw)) ||
        h.specialty.toLowerCase().includes(kw);

      const matchLocation =
        loc.length === 0 || h.address.toLowerCase().includes(loc);

      const matchSpecialty = specialty === "전체" || h.specialty === specialty;

      const matchAnimal = animal === "전체" || h.animals.includes(animal as any);

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
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else {
      list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return list;
  }, [hospitals, keyword, location, specialty, animal, only24h, onlyNight, sort]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filtered.length / PER_PAGE)),
    [filtered.length]
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, page]);

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

  const goDetail = (id: number) => {
    navigate(`/hospital/${id}`);
  };

  // ✅ 바깥 클릭하면 지역 드롭다운 닫기
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-region-wrap='true']")) setRegionOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className={styles.stage}>
      <Header />

      <div className={styles.bodyScroll}>
        {/* ✅ 검색바: mainGrid와 같은 폭/기준선 */}
        <div className={styles.searchWrap}>
          <div className={styles.searchBar}>
            <div className={styles.searchInputGroup}>
              <span className={styles.icon}><img src="../../images/ri_search-line.png"></img></span>
              <input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="진료과목/병원명"
                className={styles.searchInput}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
              />
            </div>

            {/* ✅ 지역: 선택만 가능(스르륵 드롭다운) */}
            <div
              className={styles.searchInputGroup}
              style={{ position: "relative" }}
              data-region-wrap="true"
            >
              <span className={styles.icon}><img src="../../images/tdesign_location.png"></img></span>

              <button
                type="button"
                className={styles.regionTrigger}
                onClick={() => setRegionOpen((v) => !v)}
              >
                {region ? region : "지역"}
                <span className={styles.regionChevron}>▾</span>
              </button>

              <div
                className={`${styles.regionDropdown} ${
                  regionOpen ? styles.regionDropdownOpen : ""
                }`}
              >
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={styles.regionItem}
                    onClick={() => {
                      setRegion(r);
                      setRegionOpen(false);
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button className={styles.searchBtn} onClick={onSearch}>
              검색
            </button>
          </div>
        </div>

        <div className={styles.mainGrid}>
          {/* 왼쪽 필터 */}
          <aside className={styles.filterCard}>
            <div className={styles.filterTitleRow}>
              <span className={styles.filterIcon}>⏷</span>
              <span className={styles.filterTitle}>필터</span>
            </div>

            <div className={styles.filterSection}>
              <div className={styles.filterLabel}>정렬 기준</div>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as SortOption);
                  setPage(1);
                }}
                className={styles.select}
              >
                <option value="RATING_DESC">평점 높은 순</option>
                <option value="REVIEWS_DESC">후기 많은 순</option>
              </select>
            </div>

            <div className={styles.filterSection}>
              <div className={styles.filterLabel}>전문 분야</div>
              <select
                value={specialty}
                onChange={(e) => {
                  setSpecialty(e.target.value as Specialty);
                  setPage(1);
                }}
                className={styles.select}
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

            <div className={styles.filterSection}>
              <div className={styles.filterLabel}>운영 시간</div>

              <label className={styles.checkboxRow}>
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

              <label className={styles.checkboxRow}>
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

            <div className={styles.filterSection}>
              <div className={styles.filterLabel}>동물 종</div>
              <select
                value={animal}
                onChange={(e) => {
                  setAnimal(e.target.value as Animal);
                  setPage(1);
                }}
                className={styles.select}
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
          <section className={styles.listArea}>
            <div className={styles.resultTitle}>검색 결과 ({filtered.length})</div>

            {filtered.length === 0 ? (
              <div className={styles.empty}>검색 결과가 없습니다.</div>
            ) : (
              <div className={styles.cards}>
                {pageItems.map((h) => (
                  <div key={h.id} className={styles.card}>
                    <div className={styles.cardLeft}>
                      <div className={styles.thumb}>
                        <div className={styles.thumbFallback}>IMG</div>
                      </div>
                    </div>

                    <div className={styles.cardMid}>
                      <div className={styles.cardHeaderRow}>
                        <div className={styles.hName}>{h.name}</div>

                        <div className={styles.ratingWrap}>
                          <span className={styles.star}>★</span>
                          <span className={styles.ratingNum}>
                            {h.rating.toFixed(1)}
                          </span>
                          <span className={styles.reviewCnt}>({h.reviewCount})</span>
                        </div>
                      </div>

                      <div className={styles.category}>{h.categoryLabel}</div>

                      <div className={styles.infoRow}>
                        <span className={styles.infoIcon}><img src="../../images/tdesign_location.png"></img></span>
                        <span className={styles.infoText}>{h.address}</span>
                      </div>

                      <div className={styles.infoRow}>
                        <span className={styles.infoIcon}><img src="../../images/mingcute_time-line.png"></img></span>
                        <span className={styles.infoText}>{h.hoursLabel}</span>
                      </div>

                      <div className={styles.infoRow}>
                        <span className={styles.infoIcon}><img src="../../images/tabler_phone.png"></img></span>
                        <span className={styles.infoText}>{h.phone}</span>
                      </div>

                      <div className={styles.tagsRow}>
                        <span className={styles.infoIcon}><img src="../../images/material-symbols_store.png"></img></span>
                        <span className={styles.tagsText}>{h.tags.join(", ")}</span>
                      </div>
                    </div>

                    <div className={styles.cardRight}>
                      <button
                        onClick={() => toggleBookmark(h.id)}
                        className={styles.bookmarkBtn}
                        aria-label="bookmark"
                      >
                        <BookmarkIcon active={!!bookmarks[h.id]} />
                      </button>

                      <button
                        className={styles.detailBtn}
                        onClick={() => goDetail(h.id)}
                      >
                        상세보기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageNavBtn}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ‹
                </button>

                {visiblePages.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`${styles.pageBtn} ${
                      p === page ? styles.pageBtnActive : ""
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  className={styles.pageNavBtn}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
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

function BookmarkIcon({ active }: { active: boolean }) {
  const fill = active ? "#FF0000" : "transparent";
  const stroke = active ? "#FF0000" : "#111";

  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill={fill}>
      <path
        d="M6 3h12a1 1 0 0 1 1 1v18l-7-4-7 4V4a1 1 0 0 1 1-1z"
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
