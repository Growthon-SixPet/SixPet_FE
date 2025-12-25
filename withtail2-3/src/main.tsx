import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { InterestProvider } from "./contexts/InterestContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <InterestProvider>
        <App />
      </InterestProvider>
    </BrowserRouter>
  </React.StrictMode>
);
