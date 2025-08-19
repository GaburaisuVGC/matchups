import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import FormPage from "../documentEditor/FormPage";
import HowToUse from "../static/HowToUse";
import DocumentViewer from "../documentViewer/DocumentViewer";
import initialData from "../../utils/initialData";
import CookieConsent from "../../shared/components/CookieConsent";
import PrivacyPolicy from "../static/PrivacyPolicy";

import Header from "./Header";
import Footer from "./Footer";

const App = () => {
  const [data, setData] = useState(initialData);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkMode);
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  }, []);

  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "light-mode";
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("darkMode", !isDarkMode);
  };

  return (
    <div
      className={`${isDarkMode ? "dark-mode" : "light-mode"} fade-in`}
      style={{
        minHeight: "100vh",
        fontFamily:
          "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Router>
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <CookieConsent />
        <div className="flex-grow-1" style={{ padding: 0 }}>
          <div className="container-modern main-content">
            <Routes>
              <Route
                path="/"
                element={<FormPage data={data} setData={setData} />}
              />
              <Route path="/how-to-use" element={<HowToUse />} />
              <Route path="/stored" element={<DocumentViewer source="local" />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/:id" element={<DocumentViewer source="api" />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
