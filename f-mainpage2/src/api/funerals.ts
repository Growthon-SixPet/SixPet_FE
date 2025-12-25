import { publicApi } from "./publicClient";

export type RegionEnum =
  | "SEOUL"
  | "INCHEON_GYEONGGI"
  | "GANGWON"
  | "CHUNGCHEONG"
  | "JEOLLA"
  | "GYEONGSANG"
  | "JEJU";

export type ApiResponse<T> = {
  isSuccess: boolean;
  statusCode: string;
  message: string;
  result: T;
  success?: boolean;
};

export type Pageable = {
  paged?: boolean;
  pageNumber?: number;
  pageSize?: number;
  offset?: number;
  sort?: {
    empty?: boolean;
    sorted?: boolean;
    unsorted?: boolean;
  };
  unpaged?: boolean;
};

export type Page<T> = {
  totalElements: number;
  totalPages: number;
  pageable: Pageable;
  size: number;
  content: T[];
};

export type Funeral = {
  id: number;
  name: string;
  address: string;
  phone: string;
  mainImageUrl?: string;
  blissStoneAvailable?: boolean;
  reviewCount?: number;
  ratingAvg?: number;
  amenities?: string[];
};

export type FuneralPage = Page<Funeral>;

export type FuneralSearchParams = {
  keyword?: string;
  region?: RegionEnum;
  minCost?: number;
  maxCost?: number;
  blissStoneAvailable?: boolean;
  page?: number;
  size?: number;
};

export async function fetchFunerals(params: FuneralSearchParams) {
  const res = await publicApi.get<ApiResponse<FuneralPage>>("/funerals", {
    params,
  });
  return res.data;
}
