import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyFavoritesPage.module.css";

import { useInterest } from "../contexts/InterestContext";
import type { ApiInterest } from "../api/interests";

type FavoritePlaceType = "HOSPITAL" | "FUNERAL";

export type FavoritePlace = {
  id: number; 
  type: FavoritePlaceType; 
  interestId: number; 

  name: string;
  rating: number;
  reviewCount: number;

  address: string;
  businessHoursText: string;

  isOpenNow?: boolean;
  is24Hours?: boolean;
  nightCare?: boolean;

  imageUrl?: string;
};

const ITEMS_PER_PAGE = 4;

function getTypeLabel(type: FavoritePlaceType) {
  return type === "HOSPITAL" ? "동물병원" : "장례식장";
}

function buildBizText(it: ApiInterest) {
  if (it.open24h) return "24시간운영";
  if (it.nightCare) return "야간운영";
  return "운영정보";
}

function mapInterestToPlace(it: ApiInterest): FavoritePlace {
  return {
    id: it.targetId,
    type: it.targetType,
    interestId: it.interestId,

    name: it.targetName,
    rating: typeof it.ratingAvg === "number" ? it.ratingAvg : 0,
    reviewCount: typeof it.reviewCount === "number" ? it.reviewCount : 0,

    address: it.address,
    businessHoursText: buildBizText(it),

    isOpenNow: it.openNow,
    is24Hours: it.open24h,
    nightCare: it.nightCare,

    imageUrl: it.mainImageUrl,
  };
}

export default function MyFavoritesPage() {
  const navigate = useNavigate();
  const { interests, refresh, removeByInterestId } = useInterest();

  const [page, setPage] = useState(1);


  const favorites: FavoritePlace[] = useMemo(() => {
    return interests.map(mapInterestToPlace);
  }, [interests]);


  useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(favorites.length / ITEMS_PER_PAGE));
  }, [favorites.length]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return favorites.slice(start, start + ITEMS_PER_PAGE);
  }, [favorites, page]);

  const onToggleBookmark = async (place: FavoritePlace) => {
    if (!window.confirm("즐겨찾기를 해제하시겠습니까?")) return;

    try {
      await removeByInterestId(place.interestId);
    } catch (e) {
      alert("즐겨찾기 해제에 실패했습니다.");
    }
  };

  const goPlaceDetail = (place: FavoritePlace) => {
    if (place.type === "HOSPITAL") navigate(`/hospitals/${place.id}`);
    if (place.type === "FUNERAL") navigate(`/funerals/${place.id}`);
  };

  return (
    <section className={styles.content}>
      <div className={styles.graybox}>
        <div className={styles.contentHeader}>
          <h1 className={styles.contentTitle}>나의 즐겨찾기</h1>
          <p className={styles.contentDesc}>고객님께서 즐겨찾기한 장소 목록입니다.</p>
        </div>
        <div className={styles.contentDivider} />
      </div>

      <div className={styles.grid}>
        {pageItems.map((p) => {
          const isOpen = !!p.isOpenNow;

          return (
            <div
              key={`${p.type}-${p.id}`}
              className={styles.card}
              role="button"
              tabIndex={0}
              onClick={() => goPlaceDetail(p)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") goPlaceDetail(p);
              }}
            >
              <div className={styles.cardImage}>
                {p.imageUrl ? (
                  <img className={styles.cardImageImg} src={p.imageUrl} alt={p.name} />
                ) : (
                  <div className={styles.cardImagePlaceholder} />
                )}
              </div>

              <div className={styles.cardBody}>
                <div className={styles.typeBadge}>{getTypeLabel(p.type)}</div>

                <div className={styles.titleRow}>
                  <div className={styles.placeName}>{p.name}</div>

                  <button
                    type="button"
                    className={styles.bookmarkInlineBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(p);
                    }}
                    aria-label="즐겨찾기 해제"
                    title="즐겨찾기 해제"
                  >
                    <BookmarkIcon />
                  </button>
                </div>

                <div className={styles.ratingRow}>
                  <StarIcon />
                  <span className={styles.ratingText}>
                    {p.rating.toFixed(1)} ({p.reviewCount})
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <PinIcon />
                  <div className={styles.infoText}>
                    <div>{p.address}</div>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <ClockIcon />
                  <div className={styles.infoText}>
                    {isOpen ? (
                      <div>
                        <span className={styles.openLabel}>진료중</span>
                        <span className={styles.hoursText}> • {p.businessHoursText}</span>
                      </div>
                    ) : (
                      <div>
                        <span className={styles.closedLabel}>진료 종료</span>
                        <span className={styles.hoursText}> • {p.businessHoursText}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.pagination}>
        <button
          type="button"
          className={styles.pageBtn}
          onClick={() => setPage((v) => Math.max(1, v - 1))}
          disabled={page === 1}
          aria-label="이전 페이지"
        >
          ‹
        </button>

        {Array.from({ length: totalPages }).map((_, idx) => {
          const p = idx + 1;
          return (
            <button
              key={p}
              type="button"
              className={[styles.pageNum, p === page ? styles.pageNumActive : ""].join(" ")}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          );
        })}

        <button
          type="button"
          className={styles.pageBtn}
          onClick={() => setPage((v) => Math.min(totalPages, v + 1))}
          disabled={page === totalPages}
          aria-label="다음 페이지"
        >
          ›
        </button>
      </div>
    </section>
  );
}


function BookmarkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 3.5C6 2.67 6.67 2 7.5 2H16.5C17.33 2 18 2.67 18 3.5V21L12 17.5L6 21V3.5Z"
        stroke="#FF0000"
        strokeWidth="2"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#F5B301">
      <path d="M12 2L14.9 8.6L22 9.3L16.7 13.8L18.3 21L12 17.3L5.7 21L7.3 13.8L2 9.3L9.1 8.6L12 2Z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 22s7-4.5 7-12a7 7 0 1 0-14 0c0 7.5 7 12 7 12Z"
        stroke="#AAB2B8"
        strokeWidth="2"
      />
      <circle cx="12" cy="10" r="2.5" fill="#AAB2B8" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#AAB2B8" strokeWidth="2" />
      <path d="M12 7v6l4 2" stroke="#AAB2B8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
