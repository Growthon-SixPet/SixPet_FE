import { Routes, Route } from "react-router-dom";
import MainPage2 from "../pages/MainPage2";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<MainPage2 />} />

      <Route path="/hospital/:id" element={<div>병원 상세 페이지</div>} />
    </Routes>
  );
}
