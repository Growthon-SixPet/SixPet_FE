import { Routes, Route } from "react-router-dom";
import MainPage0 from "./pages/MainPage0";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage0 />} />
      {/* 추후 연결 */}
      {/* <Route path="/hospital" element={<HospitalPage />} /> */}
      {/* <Route path="/funeral" element={<FuneralPage />} /> */}
    </Routes>
  );
}
