import { Routes, Route } from "react-router-dom";
import FuneralMainPage2 from "../pages/FuneralMainPage2";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<FuneralMainPage2 />} />
      <Route path="/funeral/:id" element={<div>장례식장 상세 페이지</div>} />
    </Routes>
  );
}
