import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./MainPage2.module.css";

import {
  fetchHospitals, 
  fetchHospitalsBasic,
} from "../api/hospitals";

import type {
  RegionEnum,
  Hospital,
  ApiResponse,
  HospitalPage,
} from "../api/hospitals";

import { useInterest } from "../contexts/InterestContext";

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

const REGION_MAP: Record<Region, RegionEnum> = {
  서울: "SEOUL",
  "인천/경기": "INCHEON_GYEONGGI",
  강원: "GANGWON",
  "충남/충북": "CHUNGCHEONG",
  "전남/전북": "JEOLLA",
  "경북/경남": "GYEONGSANG",
  제주: "JEJU",
};

const PER_PAGE = 5; 
const WINDOW_SIZE = 4;

type UIHospital = {
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
};

function buildHoursLabel(h: Hospital) {
  const openText = h.isOpenNow ? "진료중" : "진료종료";
  if (h.open24h) return `${openText} · 24시간운영`;
  if (h.nightCare) return `${openText} · 야간운영`;
  return openText;
}

function mapApiToUI(h: Hospital): UIHospital {
  return {
    id: h.hospitalId,
    name: h.name,
    categoryLabel: "동물병원",
    address: h.address,
    hoursLabel: buildHoursLabel(h),
    phone: h.phone,
    tags: Array.isArray(h.amenities) ? h.amenities : [],
    rating: typeof h.ratingAvg === "number" ? h.ratingAvg : 0,
    reviewCount: typeof h.reviewCount === "number" ? h.reviewCount : 0,
    imageUrl: h.mainImageUrl ?? "",
  };
}

type Mode = "BASIC" | "FILTER";

export default function MainPage2() {
  const navigate = useNavigate();

  const { isInterested, toggle } = useInterest();

  const [keywordInput, setKeywordInput] = useState("");

  const [regionOpen, setRegionOpen] = useState(false);
  const [region, setRegion] = useState<Region | "">("");

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState<Region | "">("");

  const [sort, setSort] = useState<SortOption>("RATING_DESC");
  const [specialty, setSpecialty] = useState<Specialty>("전체");
  const [animal, setAnimal] = useState<Animal>("전체");
  const [only24h, setOnly24h] = useState(false);
  const [onlyNight, setOnlyNight] = useState(false);

  const [page, setPage] = useState(1);

  const [items, setItems] = useState<UIHospital[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<Mode>("BASIC");

  const onSearch = () => {
    setKeyword(keywordInput);
    setLocation(region);
    setPage(1);
    setMode("BASIC");
  };

  const switchToFilterMode = () => {
    setPage(1);
    setMode("FILTER");
  };

  const apiPage = Math.max(0, page - 1);
  const apiRegion: RegionEnum | undefined = location
    ? REGION_MAP[location as Region]
    : undefined;

  const basicParams = useMemo(() => {
    return {
      keyword: keyword.trim() ? keyword.trim() : undefined,
      region: apiRegion,
      page: apiPage,
      size: PER_PAGE,
    };
  }, [keyword, apiRegion, apiPage]);

  const filterParams = useMemo(() => {
    return {
      keyword: keyword.trim() ? keyword.trim() : undefined,
      region: apiRegion,
      specialty: specialty !== "전체" ? specialty : undefined,
      animalType: animal !== "전체" ? animal : undefined,
      open24h: only24h ? true : undefined,
      nightCare: onlyNight ? true : undefined,
      sortType: sort,
      page: apiPage,
      size: PER_PAGE,
    };
  }, [keyword, apiRegion, specialty, animal, only24h, onlyNight, sort, apiPage]);

  useEffect(() => {
    let ignore = false;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        let res: ApiResponse<HospitalPage>;

        if (mode === "BASIC") {
          console.log("[API] BASIC -> GET /hospitals/search", basicParams);
          res = await fetchHospitalsBasic(basicParams as any);
        } else {
          console.log("[API] FILTER -> GET /hospitals", filterParams);
          res = await fetchHospitals(filterParams as any);
        }

        if (!res?.isSuccess) {
          throw new Error(res?.message || "API 응답 실패");
        }

        const ui = res.result.content.map(mapApiToUI);

        if (!ignore) {
          setItems(ui);
          setTotalElements(res.result.totalElements ?? ui.length);
          setTotalPages(Math.max(1, res.result.totalPages ?? 1));
        }
      } catch (e) {
        console.error(e);
        if (!ignore) {
          setError("병원 목록을 불러오지 못했습니다.");
          setItems([]);
          setTotalElements(0);
          setTotalPages(1);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    run();
    return () => {
      ignore = true;
    };
  }, [mode, basicParams, filterParams]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const visiblePages = useMemo(() => {
    const maxStart = Math.max(1, totalPages - WINDOW_SIZE + 1);
    const start = Math.min(Math.max(1, page), maxStart);
    const end = Math.min(totalPages, start + WINDOW_SIZE - 1);

    const arr: number[] = [];
    for (let p = start; p <= end; p++) arr.push(p);
    return arr;
  }, [page, totalPages]);

  const goDetail = (id: number) => {
    navigate(`/hospital/${id}`);
  };

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
        <div className={styles.searchWrap}>
          <div className={styles.searchBar}>
            <div className={styles.searchInputGroup}>
              <span className={styles.icon}>
                <img src="../../images/ri_search-line.png" />
              </span>
              <input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="진료과목/병원명"
                className={styles.searchInput}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
              />
            </div>

            <div
              className={styles.searchInputGroup}
              style={{ position: "relative" }}
              data-region-wrap="true"
            >
              <span className={styles.icon}>
                <img src="../../images/tdesign_location.png" />
              </span>

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
                  switchToFilterMode();
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
                  switchToFilterMode();
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
                    switchToFilterMode();
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
                    switchToFilterMode();
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
                  switchToFilterMode();
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

          <section className={styles.listArea}>
            <div className={styles.resultTitle}>검색 결과 ({totalElements})</div>

            {loading ? (
              <div className={styles.empty}>불러오는 중...</div>
            ) : error ? (
              <div className={styles.empty}>{error}</div>
            ) : items.length === 0 ? (
              <div className={styles.empty}>검색 결과가 없습니다.</div>
            ) : (
              <div className={styles.cards}>
                {items.map((h) => (
                  <div key={h.id} className={styles.card}>
                    <div className={styles.cardLeft}>
                      <div className={styles.thumb}>
                        {h.imageUrl ? (
                          <img
                            src={h.imageUrl}
                            alt={h.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div className={styles.thumbFallback}>IMG</div>
                        )}
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
                          <span className={styles.reviewCnt}>
                            ({h.reviewCount})
                          </span>
                        </div>
                      </div>

                      <div className={styles.category}>{h.categoryLabel}</div>

                      <div className={styles.infoRow}>
                        <span className={styles.infoIcon}>
                          <img src="../../images/tdesign_location.png" />
                        </span>
                        <span className={styles.infoText}>{h.address}</span>
                      </div>

                      <div className={styles.infoRow}>
                        <span className={styles.infoIcon}>
                          <img src="../../images/mingcute_time-line.png" />
                        </span>
                        <span className={styles.infoText}>{h.hoursLabel}</span>
                      </div>

                      <div className={styles.infoRow}>
                        <span className={styles.infoIcon}>
                          <img src="../../images/tabler_phone.png" />
                        </span>
                        <span className={styles.infoText}>{h.phone}</span>
                      </div>

                      <div className={styles.tagsRow}>
                        <span className={styles.infoIcon}>
                          <img src="../../images/material-symbols_store.png" />
                        </span>
                        <span className={styles.tagsText}>
                          {h.tags.length ? h.tags.join(", ") : "정보 없음"}
                        </span>
                      </div>
                    </div>

                    <div className={styles.cardRight}>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await toggle("HOSPITAL", h.id);
                          } catch (err) {
                            console.error(err);
                            alert("즐겨찾기 처리에 실패했습니다.");
                          }
                        }}
                        className={styles.bookmarkBtn}
                        aria-label="bookmark"
                      >
                        <BookmarkIcon active={isInterested("HOSPITAL", h.id)} />
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
