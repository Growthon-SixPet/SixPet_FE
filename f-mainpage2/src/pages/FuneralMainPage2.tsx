import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./MainPage2.module.css";

import { fetchFunerals } from "../api/funerals";

import type { RegionEnum, ApiResponse, Funeral, FuneralPage } from "../api/funerals";
import { useInterest } from "../contexts/InterestContext";

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

type UIFuneral = {
  id: number;
  name: string;
  categoryLabel: string;
  address: string;
  phone: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  blissStoneAvailable?: boolean;
};

function mapApiToUI(f: Funeral): UIFuneral {
  return {
    id: (f as any).id ?? (f as any).funeralId ?? 0,
    name: (f as any).name ?? "",
    categoryLabel: "장례식장",
    address: (f as any).address ?? "",
    phone: (f as any).phone ?? "",
    tags: Array.isArray((f as any).amenities) ? (f as any).amenities : [],
    rating: typeof (f as any).ratingAvg === "number" ? (f as any).ratingAvg : 0,
    reviewCount: typeof (f as any).reviewCount === "number" ? (f as any).reviewCount : 0,
    imageUrl: (f as any).mainImageUrl ?? "",
    blissStoneAvailable: typeof (f as any).blissStoneAvailable === "boolean" ? (f as any).blissStoneAvailable : undefined,
  };
}

function getToken() {
  const t = localStorage.getItem("accessToken");
  if (!t) return null;
  const v = t.trim();
  if (!v) return null;
  if (v === "null" || v === "undefined") return null;
  return v;
}

export default function FuneralMainPage2() {
  const navigate = useNavigate();
  const { isInterested, toggle, isLoggedIn } = useInterest();

  const [keywordInput, setKeywordInput] = useState("");
  const [regionOpen, setRegionOpen] = useState(false);
  const [region, setRegion] = useState<Region | "">("");

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState<Region | "">("");

  const [onlyMemorialStone, setOnlyMemorialStone] = useState(false);

  const [page, setPage] = useState(1);

  const [items, setItems] = useState<UIFuneral[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiPage = Math.max(0, page - 1);
  const apiRegion: RegionEnum | undefined = location ? REGION_MAP[location as Region] : undefined;

  const params = useMemo(() => {
    return {
      keyword: keyword.trim() ? keyword.trim() : undefined,
      region: apiRegion,
      blissStoneAvailable: onlyMemorialStone ? true : undefined,
      page: apiPage,
      size: PER_PAGE,
    };
  }, [keyword, apiRegion, onlyMemorialStone, apiPage]);

  const onSearch = () => {
    setKeyword(keywordInput);
    setLocation(region);
    setPage(1);
  };

  useEffect(() => {
    let ignore = false;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const res: ApiResponse<FuneralPage> = await fetchFunerals(params as any);

        if (!res?.isSuccess) {
          throw new Error(res?.message || "API 응답 실패");
        }

        const ui = (res.result?.content ?? []).map(mapApiToUI);

        if (!ignore) {
          setItems(ui);
          setTotalElements(res.result?.totalElements ?? ui.length);
          setTotalPages(Math.max(1, res.result?.totalPages ?? 1));
        }
      } catch (e) {
        if (!ignore) {
          setError("장례식장 목록을 불러오지 못했습니다.");
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
  }, [params]);

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
    navigate(`/funeral/${id}`);
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
                placeholder="장례식장명"
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

            <button type="button" className={styles.searchBtn} onClick={onSearch}>
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

            <div className={styles.filterSectionCompact}>
              <div className={styles.filterLabel}>메모리얼 스톤 유무</div>
              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={onlyMemorialStone}
                  onChange={(e) => {
                    setOnlyMemorialStone(e.target.checked);
                    setPage(1);
                  }}
                />
                <span>메모리얼 스톤</span>
              </label>
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
                {items.map((f) => (
                  <div key={f.id} className={styles.card}>
                    <div className={styles.cardLeft}>
                      <div className={styles.thumb}>
                        {f.imageUrl ? (
                          <img
                            src={f.imageUrl}
                            alt={f.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <div className={styles.thumbFallback}>IMG</div>
                        )}
                      </div>
                    </div>

                    <div className={styles.cardMid}>
                      <div className={styles.cardHeaderRow}>
                        <div className={styles.hName}>{f.name}</div>

                        <div className={styles.ratingWrap}>
                          <span className={styles.star}>★</span>
                          <span className={styles.ratingNum}>{f.rating.toFixed(1)}</span>
                          <span className={styles.reviewCnt}>({f.reviewCount})</span>
                        </div>
                      </div>

                      <div className={styles.category}>{f.categoryLabel}</div>

                      <div className={styles.infoRow}>
                        <span className={styles.infoIcon}>
                          <img src="../../images/tdesign_location.png" />
                        </span>
                        <span className={styles.infoText}>{f.address}</span>
                      </div>

                      <div className={styles.infoRow}>
                        <span className={styles.infoIcon}>
                          <img src="../../images/mingcute_time-line.png" />
                        </span>
                        <span className={styles.infoText}>
                          {f.blissStoneAvailable ? "메모리얼 스톤" : "메모리얼 스톤 없음"}
                        </span>
                      </div>

                      <div className={styles.infoRow}>
                        <span className={styles.infoIcon}>
                          <img src="../../images/tabler_phone.png" />
                        </span>
                        <span className={styles.infoText}>{f.phone}</span>
                      </div>

                      <div className={styles.tagsRow}>
                        <span className={styles.infoIcon}>
                          <img src="../../images/material-symbols_store.png" />
                        </span>
                        <span className={styles.tagsText}>
                          {f.tags.length ? f.tags.join(", ") : "정보 없음"}
                        </span>
                      </div>
                    </div>

                    <div className={styles.cardRight}>
                      <button
                        type="button"
                        onClick={async (e) => {
                          e.stopPropagation();

                          if (!isLoggedIn || !getToken()) {
                            alert("로그인이 필요한 서비스입니다.");
                            return;
                          }

                          try {
                            await toggle("FUNERAL", f.id);
                          } catch (err: any) {
                            if (err?.message === "LOGIN_REQUIRED") {
                              alert("로그인이 필요한 서비스입니다.");
                              return;
                            }
                            alert("즐겨찾기 처리에 실패했습니다.");
                          }
                        }}
                        className={styles.bookmarkBtn}
                        aria-label="bookmark"
                      >
                        <BookmarkIcon active={isInterested("FUNERAL", f.id)} />
                      </button>

                      <button type="button" className={styles.detailBtn} onClick={() => goDetail(f.id)}>
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
                  type="button"
                  className={styles.pageNavBtn}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ‹
                </button>

                {visiblePages.map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPage(p)}
                    className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ""}`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  type="button"
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
