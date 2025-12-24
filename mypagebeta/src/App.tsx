import { Routes, Route, Navigate } from "react-router-dom";
import MyPageLayout from "./pages/MyPageLayout";

import MyPageProfile from "./pages/MyPageProfile";
import MyPageReservation from "./pages/MyPageReservation";
import MyReviewHistory from "./pages/MyReviewHistory";
import MyFavoritesPage from "./pages/MyFavoritesPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/mypage/profile" replace />} />

      <Route path="/mypage" element={<MyPageLayout />}>
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<MyPageProfile />} />
        <Route path="reservation" element={<MyPageReservation />} />
        <Route path="review" element={<MyReviewHistory />} />
        <Route path="favorites" element={<MyFavoritesPage />} />
      </Route>
    </Routes>
  );
}
