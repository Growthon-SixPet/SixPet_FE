import { Routes, Route, Navigate } from "react-router-dom";
import MyPageReservation from "./pages/MyPageReservation";

export default function App() {
  return (
    <Routes>
      {/* 테스트용: 바로 예약내역으로 보내기 */}
      <Route path="/" element={<Navigate to="/mypage/reservations" replace />} />

      {/* 예약 내역 관리 */}
      <Route path="/mypage/reservations" element={<MyPageReservation />} />

      {/* 나머지 페이지는 나중에 연결 */}
      {/* <Route path="/mypage/profile" element={<MyPageProfile />} /> */}
      {/* <Route path="/mypage/reviews" element={<MyPageReviews />} /> */}
      {/* <Route path="/mypage/my-hospitals" element={<MyHospitals />} /> */}
    </Routes>
  );
}
