import { publicApi } from "./publicClient";

export type HospitalSearchParams = {
  keyword?: string;
  region?: string;
  specialty?: string;
  animalType?: string;
  open24h?: boolean;
  nightCare?: boolean;
  sortType?: "RATING_DESC" | "REVIEWS_DESC";
  page?: number;
  size?: number;
};

export type HospitalSearchBasicParams = {
  keyword?: string;
  region?:
    | "SEOUL"
    | "INCHEON_GYEONGGI"
    | "GANGWON"
    | "CHUNGCHEONG"
    | "JEOLLA"
    | "GYEONGSANG"
    | "JEJU";
  page?: number;
  size?: number;
};

export type ApiResponse<T> = {
  isSuccess: boolean;
  statusCode: string;
  message: string;
  result: T;
  success?: boolean;
};

export type HospitalPage = {
  content: Hospital[];
  totalElements?: number;
  totalPages?: number;
  pageable?: any;
  size?: number;
  number?: number;
};

export type Hospital = {
  hospitalId: number;
  name: string;
  address: string;
  phone: string;
  open24h: boolean;
  nightCare: boolean;
  isOpenNow: boolean;
  ratingAvg: number;
  reviewCount: number;
  mainImageUrl: string | null;
  amenities: string[];
};

export type RegionEnum =
  | "SEOUL"
  | "INCHEON_GYEONGGI"
  | "GANGWON"
  | "CHUNGCHEONG"
  | "JEOLLA"
  | "GYEONGSANG"
  | "JEJU";

export async function fetchHospitals(params: HospitalSearchParams) {
  const res = await publicApi.get<ApiResponse<HospitalPage>>("/hospitals", {
    params,
  });
  return res.data;
}

export async function fetchHospitalsBasic(params: HospitalSearchBasicParams) {
  const res = await publicApi.get<ApiResponse<HospitalPage>>(
    "/hospitals/search",
    { params }
  );
  return res.data;
}
