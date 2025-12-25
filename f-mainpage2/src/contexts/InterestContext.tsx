import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ApiInterest, TargetType } from "../api/interests";
import {
  createInterest,
  deleteInterest,
  fetchMyInterests,
} from "../api/interests";

type InterestContextValue = {
  list: ApiInterest[];
  interests: ApiInterest[];
  loading: boolean;
  refresh: () => Promise<void>;
  isInterested: (targetType: TargetType, targetId: number) => boolean;
  toggle: (targetType: TargetType, targetId: number) => Promise<void>;
  removeByInterestId: (interestId: number) => Promise<void>;
  getInterestId: (targetType: TargetType, targetId: number) => number | null;
  isLoggedIn: boolean;
};

const InterestContext = createContext<InterestContextValue | null>(null);

function getToken() {
  const t = localStorage.getItem("accessToken");
  if (!t) return null;
  const v = t.trim();
  if (!v) return null;
  if (v === "null" || v === "undefined") return null;
  return v;
}

export function InterestProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<ApiInterest[]>([]);
  const [loading, setLoading] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!getToken());

  useEffect(() => {
    const onStorage = () => setIsLoggedIn(!!getToken());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setList([]);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchMyInterests();
      setList(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh().catch(() => {});
  }, [refresh, isLoggedIn]);

  const mapByKey = useMemo(() => {
    const m = new Map<string, ApiInterest>();
    for (const it of list) {
      m.set(`${it.targetType}:${it.targetId}`, it);
    }
    return m;
  }, [list]);

  const isInterested = useCallback(
    (targetType: TargetType, targetId: number) => {
      return mapByKey.has(`${targetType}:${targetId}`);
    },
    [mapByKey]
  );

  const getInterestId = useCallback(
    (targetType: TargetType, targetId: number) => {
      return mapByKey.get(`${targetType}:${targetId}`)?.interestId ?? null;
    },
    [mapByKey]
  );

  const removeByInterestId = useCallback(async (interestId: number) => {
    await deleteInterest(interestId);
    setList((prev) => prev.filter((x) => x.interestId !== interestId));
  }, []);

  const toggle = useCallback(
    async (targetType: TargetType, targetId: number) => {
      const token = getToken();
      if (!token) {
        throw new Error("LOGIN_REQUIRED");
      }

      const key = `${targetType}:${targetId}`;
      const existed = mapByKey.get(key);

      if (existed) {
        await deleteInterest(existed.interestId);
        setList((prev) =>
          prev.filter((x) => x.interestId !== existed.interestId)
        );
        return;
      }

      await createInterest({ targetType, targetId });
      await refresh();
    },
    [mapByKey, refresh]
  );

  const value = useMemo<InterestContextValue>(
    () => ({
      list,
      interests: list,
      loading,
      refresh,
      isInterested,
      toggle,
      removeByInterestId,
      getInterestId,
      isLoggedIn,
    }),
    [
      list,
      loading,
      refresh,
      isInterested,
      toggle,
      removeByInterestId,
      getInterestId,
      isLoggedIn,
    ]
  );

  return (
    <InterestContext.Provider value={value}>{children}</InterestContext.Provider>
  );
}

export function useInterest() {
  const ctx = useContext(InterestContext);
  if (!ctx) throw new Error("useInterest must be used within InterestProvider");
  return ctx;
}

export function useInterests() {
  return useInterest();
}
