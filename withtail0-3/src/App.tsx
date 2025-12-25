import { Routes, Route } from "react-router-dom";
import MainPage0 from "./pages/MainPage0";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage0 />} />
    </Routes>
  );
}
