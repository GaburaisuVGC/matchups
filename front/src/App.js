import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import FormPage from "./FormPage";
import JsonViewer from "./JsonViewer";
import HowToUse from "./HowToUse";
import initialData from "./utils/initialData";
import "./App.css";
import StoredViewer from "./StoredViewer";
import CookieConsent from "./CookieConsent";
import PrivacyPolicy from "./PrivacyPolicy";

const Header = ({ isDarkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const [isStoredData, setIsStoredData] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("storedData");
    setIsStoredData(!!storedData);
  }, []);

  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="header-modern d-none d-lg-block">
        <div className="container-modern">
          <div className="d-flex justify-content-between align-items-center">
            <div onClick={() => navigate("/")} className="logo-modern">
              <span className="text-accent-modern">Matchups</span>.net
            </div>
            <div className="btn-group-modern">
              <button
                onClick={() => navigate("/stored")}
                className="btn btn-secondary-modern"
                disabled={!isStoredData}
              >
                <i className="fas fa-folder-open me-2"></i>
                View Local Doc
              </button>
              <button
                onClick={toggleDarkMode}
                className="btn btn-secondary-modern"
                aria-label={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDarkMode ? (
                  <i className="fas fa-sun"></i>
                ) : (
                  <i className="fas fa-moon"></i>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="header-mobile d-lg-none">
        <div className="container-modern h-100">
          <div className="d-flex justify-content-between align-items-center h-100">
            <button
              onClick={toggleMenu}
              className="mobile-header-btn"
              aria-label="Open menu"
            >
              <i className="fas fa-bars"></i>
            </button>

            <div onClick={() => handleNav("/")} className="logo-mobile">
              <span className="text-accent-modern">Matchups</span>.net
            </div>

            <button
              onClick={toggleDarkMode}
              className="mobile-header-btn"
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? (
                <i className="fas fa-sun"></i>
              ) : (
                <i className="fas fa-moon"></i>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Burger Menu Dropdown */}
      {isMenuOpen && (
        <div className="burger-menu-dropdown d-lg-none">
          <button onClick={() => handleNav("/")} className="burger-menu-item">
            <i className="fas fa-home me-2"></i>Home
          </button>
          <button
            onClick={() => handleNav("/stored")}
            className="burger-menu-item"
            disabled={!isStoredData}
          >
            <i className="fas fa-folder-open me-2"></i>View Local Doc
          </button>
          <button
            onClick={() => handleNav("/how-to-use")}
            className="burger-menu-item"
          >
            <i className="fas fa-question-circle me-2"></i>Guide
          </button>
        </div>
      )}
    </>
  );
};

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
              <Route path="/stored" element={<StoredViewer />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/:id" element={<JsonViewer />} />
            </Routes>
          </div>
        </div>
      </Router>
      <footer className="footer-modern">
        <div className="container-modern">
          {/* Desktop Footer */}
          <div className="d-none d-md-block">
            <div className="row align-items-center">
              <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                <p className="mb-0">
                  <a
                    href="https://matthieu-barbe.dev/"
                    className="text-decoration-none me-3"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fas fa-user me-1"></i>
                    Project by Matthieu Barbe
                  </a>
                  <a href="/how-to-use" className="text-decoration-none me-3">
                    <i className="fas fa-question-circle me-1"></i>
                    How to use it?
                  </a>
                  <a href="/privacy-policy" className="text-decoration-none">
                    <i className="fas fa-shield-alt me-1"></i>
                    Privacy Policy
                  </a>
                </p>
              </div>
              <div className="col-md-6 text-center text-md-end">
                <p className="mb-0 text-muted-modern">
                  <a
                    href="https://github.com/GaburaisuVGC/matchups"
                    className="text-decoration-none"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-github me-1"></i>
                    v2.0.5
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Footer */}
          <div className="d-block d-md-none text-center">
            <div className="mb-3">
              <a
                href="https://matthieu-barbe.dev/"
                className="text-decoration-none d-block mb-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-user me-2"></i>
                Project by Matthieu Barbe
              </a>
              <div className="d-flex justify-content-center gap-3">
                <a href="/how-to-use" className="text-decoration-none">
                  <i className="fas fa-question-circle me-1"></i>
                  Guide
                </a>
                <a href="/privacy-policy" className="text-decoration-none">
                  <i className="fas fa-shield-alt me-1"></i>
                  Privacy
                </a>
                <a
                  href="https://github.com/GaburaisuVGC/matchups"
                  className="text-decoration-none"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-github me-1"></i>
                  v2.0.5
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
