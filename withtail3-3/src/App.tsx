import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MyReviewHistory from "./pages/MyReviewHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 임시 진입용 */}
        <Route path="/" element={<Navigate to="/mypage/reviews" />} />

        {/* 마이페이지 - 후기 내역 관리 */}
        <Route path="/mypage/reviews" element={<MyReviewHistory />} />

        {/* 나중에 만들 페이지들 */}
        {/* <Route path="/mypage/profile" element={<MyProfile />} /> */}
        {/* <Route path="/mypage/reservations" element={<MyReservations />} /> */}
        {/* <Route path="/mypage/my-hospitals" element={<MyHospitals />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
