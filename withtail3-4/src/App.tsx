import { Navigate, Route, Routes } from "react-router-dom";

// ✅ 실제 파일 경로: src/pages/MyFavoritesPage.tsx
import MyFavoritesPage from "./pages/MyFavoritesPage";

export default function App() {
  return (
    <Routes>
      {/* ✅ 임시로 홈 들어오면 즐겨찾기로 보내기 */}
      <Route path="/" element={<Navigate to="/mypage/favorites" replace />} />

      {/* ✅ 마이페이지 - 즐겨찾기 */}
      <Route path="/mypage/favorites" element={<MyFavoritesPage />} />

      {/* ✅ 기존 주소 남아있으면 리다이렉트 */}
      <Route
        path="/mypage/my-hospitals"
        element={<Navigate to="/mypage/favorites" replace />}
      />

      {/* ✅ 그 외 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

