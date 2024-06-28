import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import FormPage from "./FormPage";
import JsonViewer from "./JsonViewer";
import HowToUse from "./HowToUse";
import initialData from "./utils/initialData";
import "./App.css";

const Header = ({ isDarkMode, toggleDarkMode }) => {
  const navigate = useNavigate();

  return (
    <header className="d-flex justify-content-between align-items-center p-3">
      <div
        onClick={() => navigate("/")}
        style={{ cursor: "pointer", fontSize: "1.5rem", fontWeight: "600", fontFamily: "Raleway, sans-serif"}}
        className={isDarkMode ? "text-white" : "text-dark"}
      >
        Matchups.net
      </div>
      <button onClick={toggleDarkMode} className="btn btn-secondary">
        {isDarkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </header>
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
      className={isDarkMode ? "dark-mode" : "light-mode"}
      style={{ minHeight: "100vh", fontFamily: "Raleway, sans-serif", display: "flex", flexDirection: "column"}}
    >
      <Router>
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <div className="container-fluid flex-grow-1">
          <Routes>
            <Route path="/" element={<FormPage data={data} setData={setData} />} />
            <Route path="/how-to-use" element={<HowToUse />} />
            <Route path="/:id" element={<JsonViewer />} />
          </Routes>
        </div>
      </Router>
      <footer
        className={`text-center py-3 mt-4 ${isDarkMode ? "bg-dark text-white" : "bg-light text-dark"}`}
        style={{ marginTop: "auto" }}
      >
        <p>
          <a
            href="https://github.com/GaburaisuVGC/matchups"
            className={`text-decoration-none ${isDarkMode ? "text-white" : "text-dark"}`}
          >
            Project by Gabu
          </a>{" "}
          |{" "}
          <a
            href="/how-to-use"
            className={`text-decoration-none ${isDarkMode ? "text-white" : "text-dark"}`}
          >
            How to use it?
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
