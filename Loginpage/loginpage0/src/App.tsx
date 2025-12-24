import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupTerms from "./pages/SignupTerms";
import SignupInfo from "./pages/SignupInfo";
import SignupVerify from "./pages/SignupVerify";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 */}
        <Route path="/" element={<LoginPage />} />

        {/* 회원가입 Step 1 (Frame 415) */}
        <Route path="/signup/terms" element={<SignupTerms />} />

        {/* 회원가입 Step 2 (Frame 416) */}
        <Route path="/signup/info" element={<SignupInfo />} />

        {/* 회원가입 Step 3 (Frame 417) */}
        <Route path="/signup/verify" element={<SignupVerify />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
