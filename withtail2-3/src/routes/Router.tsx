import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainPage2 from "../pages/MainPage2";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ 지금은 바로 병원 리스트 화면을 홈으로 */}
        <Route path="/" element={<MainPage2 />} />

        {/* ✅ 병원 리스트 경로 */}
        <Route path="/hospital" element={<MainPage2 />} />

        {/* ✅ 상세보기 이동용(팀원이 페이지 만들 거라 임시) */}
        <Route
          path="/hospital/:id"
          element={<div style={{ padding: 20 }}>병원 상세 페이지(팀원 작업)</div>}
        />

        {/* ✅ 그 외 경로는 홈으로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
