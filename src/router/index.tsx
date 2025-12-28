import { createBrowserRouter } from "react-router-dom";
import App from "../App";

// pages
import Home from "../pages/Home/Home";
import LoginPage from "../pages/login/LoginPage";
import SignupTerms from "../pages/login/SignupTerms";
import SignupInfo from "../pages/login/SignupInfo";
import SignupVerify from "../pages/login/SignupVerify";
import Mainpage01 from "../pages/mainpage01/mainpage01";
import Mainpage02 from "../pages/mainpage02/mainpage02";
import MyPageProfile from "../pages/mypage/MyPageProfile";
import HospitalDetail from "../pages/HospitalDetail/HospitalDetail"; // ✅ 추가

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },

      { path: "login", element: <LoginPage /> },
         {
        path: "signup",
        children: [
          { path: "terms", element: <SignupTerms /> },   // /signup/terms
          { path: "info", element: <SignupInfo /> },     // /signup/info
          { path: "verify", element: <SignupVerify /> }, // /signup/verify
        ],
    },
      

      {
        path: "hospital",
        children: [
          { index: true, element: <Mainpage01 /> },      // /hospital
          { path: "search", element: <Mainpage02 /> },   // /hospital/search
          { path: ":id", element: <HospitalDetail /> },  // ✅ /hospital/:id
        ],
      },

      {
        path: "mypage",
        children: [
          { path: "profile", element: <MyPageProfile /> },
        ],
      },
    ],
  },
]);

export default router;
