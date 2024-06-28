import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FormPage from "./FormPage";
import JsonViewer from "./JsonViewer";
import HowToUse from "./HowToUse";
import initialData from "./utils/initialData";
import "./App.css";

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
        <div className="d-flex justify-content-end p-3">
          <button onClick={toggleDarkMode} className="btn btn-secondary">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
        <Routes>
          <Route path="/" element={<FormPage data={data} setData={setData} />} />
          <Route path="/how-to-use" element={<HowToUse />} />
          <Route path="/:id" element={<JsonViewer />} />
        </Routes>
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
