import React, { useState, useEffect } from "react";
import { encodeDocument } from "../../services/apiService";
import TeamForm from "./TeamForm";
import MatchupForm from "./MatchupForm";
import initialData from "../../utils/initialData";
import CalcForm from "./CalcForm";
import AddCalcForm from "./AddCalcForm";
import AddMatchupForm from "./AddMatchupForm";
import MatchupListMobile from "../documentViewer/MatchupListMobile";
import MobileNavigation from "../../shared/components/MobileNavigation";
import useDarkMode from "../../hooks/useDarkMode";
import FormPageActions from "./FormPageActions";
import "./FormPage.css";

const FormPage = () => {
  const [data, setData] = useState({ ...initialData, generalTitle: "" });
  const [teamSubmitted, setTeamSubmitted] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState("team");
  const [selectedMatchup, setSelectedMatchup] = useState(0);
  const [selectedPokemonIndex, setSelectedPokemonIndex] = useState(0);
  const [isDarkMode] = useDarkMode();
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const FRONT_URL = process.env.REACT_APP_FRONT_URL;
  const BACK_URL = process.env.REACT_APP_BACK_URL;

  useEffect(() => {
    const matchupData = localStorage.getItem("matchupData");
    if (matchupData) {
      try {
        const parsedData = JSON.parse(matchupData);
        setData(parsedData);
        setTeamSubmitted(true);
        localStorage.removeItem("matchupData");
      } catch (error) {
        console.error("Error parsing stored matchup data:", error);
      }
    }
  }, []);

  const handleTitleChange = (e) => {
    setData({ ...data, generalTitle: e.target.value });
  };

  const showStatus = (message, type = "success") => {
    setSaveStatus(message);
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const handleSave = async () => {
    if (!teamSubmitted) return;
    
    setIsLoading(true);
    try {
      const result = await encodeDocument(data);
      const newUrl = `${FRONT_URL}/${result.id}`;
      navigator.clipboard.writeText(newUrl);
      showStatus("✅ Saved! URL copied to clipboard");
      window.open(newUrl, "_blank");
    } catch (error) {
      console.error("Error saving data:", error);
      showStatus("❌ Network error. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveStored = () => {
    if (!teamSubmitted) return;
    
    try {
      localStorage.setItem("storedData", JSON.stringify(data));
      showStatus("💾 Saved locally!");
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      showStatus("❌ Local save failed.", "error");
    }
  };

  const downloadJSON = () => {
    if (!teamSubmitted) return;
    
    try {
      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.generalTitle || "matchup-data"}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showStatus("📥 Draft downloaded!");
    } catch (error) {
      console.error("Error downloading JSON:", error);
      showStatus("❌ Download failed.", "error");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const uploadedData = JSON.parse(event.target.result);
        setData(uploadedData);
        if (uploadedData.team && uploadedData.team.length > 0) {
          setTeamSubmitted(true);
        }
        showStatus("📁 Draft loaded successfully!");
      } catch (error) {
        console.error("Error parsing uploaded file:", error);
        showStatus("❌ Invalid file format.", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const formTabs = [
    { id: 'team', label: 'Team Setup', icon: 'fa-users', disabled: false },
    { id: 'calcs', label: 'Calcs', icon: 'fa-calculator', disabled: !teamSubmitted },
    { id: 'matchups', label: 'Matchups', icon: 'fa-gamepad', disabled: !teamSubmitted },
  ];

  return (
    <div className="fade-in form-page-container">
      {/* CTA How To Use */}
      <div className="cta-how-to-use-subtle">
        <div className="d-lg-flex justify-content-lg-between align-items-lg-center text-center text-lg-start">
          <div className="d-flex align-items-center justify-content-center justify-content-lg-start mb-3 mb-lg-0">
            <i className="fas fa-rocket fa-2x me-3 d-none d-lg-block"></i>
            <div className="text-start">
              <h2 className="h4 mb-1">New to Matchups.net?</h2>
              <p className="mb-0 opacity-90">Learn how to create professional tournament preparation documents</p>
            </div>
          </div>
          <a href="/how-to-use" className="btn btn-subtle-modern btn-lg">
            <i className="fas fa-question-circle me-2"></i>
            How to use it?
          </a>
        </div>
      </div>

      {/* Page Title */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-3">
          <span className="text-accent-modern">Matchups</span>.net
        </h1>
        <p className="lead text-muted-modern">
          Create and share your tournament preparation documents
        </p>
      </div>

      {/* Status Messages */}
      {saveStatus && (
        <div className={`alert ${saveStatus.includes('❌') ? 'alert-danger' : 'alert-success'} alert-dismissible fade show mb-4`} role="alert">
          <i className={`fas ${saveStatus.includes('❌') ? 'fa-exclamation-triangle' : 'fa-check-circle'} me-2`}></i>
          {saveStatus}
        </div>
      )}

      <div className="homepage-desktop-layout">
        <div className="homepage-main-content">
          <div className="form-tabs d-none d-lg-flex">
            <button
              className={`form-tab ${activeFormTab === "team" ? "active" : ""}`}
              onClick={() => setActiveFormTab("team")}
            >
              <i className="fas fa-users me-2"></i> Team
            </button>
            <button
              className={`form-tab ${
                activeFormTab === "calcs" ? "active" : ""
              }`}
              onClick={() => setActiveFormTab("calcs")}
              disabled={!teamSubmitted}
            >
              <i className="fas fa-calculator me-2"></i> Calcs
            </button>
            <button
              className={`form-tab ${
                activeFormTab === "matchups" ? "active" : ""
              }`}
              onClick={() => setActiveFormTab("matchups")}
              disabled={!teamSubmitted}
            >
              <i className="fas fa-gamepad me-2"></i>&nbsp;Matchups
            </button>
          </div>

          <div className="form-content">
            {activeFormTab === "team" && (
              <div className="form-section-modern">
                <TeamForm
                  data={data}
                  setData={(newData) => {
                    setData(newData);
                    setTeamSubmitted(true);
                  }}
                />
              </div>
            )}
            {activeFormTab === "calcs" && teamSubmitted && (
              <>
                {/* Desktop View */}
                <div className="d-none d-lg-block">
                  <AddCalcForm data={data} setData={setData} />
                  <CalcForm
                    data={data}
                    setData={setData}
                    selectedPokemonIndex={selectedPokemonIndex}
                  />
                </div>
                {/* Mobile View */}
                <div className="d-lg-none">
                  <CalcForm
                    data={data}
                    setData={setData}
                    selectedPokemonIndex={selectedPokemonIndex}
                  />
                </div>
              </>
            )}
            {activeFormTab === "matchups" && teamSubmitted && (
              <>
                {/* Desktop View */}
                <div className="d-none d-lg-block">
                  <AddMatchupForm data={data} setData={setData} />
                  <MatchupForm
                    data={data}
                    setData={setData}
                    selectedMatchup={selectedMatchup}
                    setSelectedMatchup={setSelectedMatchup}
                  />
                </div>
                {/* Mobile View */}
                <div className="d-lg-none">
                  <MatchupListMobile
                    data={data}
                    setData={setData}
                    selectedMatchup={selectedMatchup}
                    setSelectedMatchup={setSelectedMatchup}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="homepage-sidebar">
            <FormPageActions
                data={data}
                teamSubmitted={teamSubmitted}
                isLoading={isLoading}
                handleTitleChange={handleTitleChange}
                handleSave={handleSave}
                handleSaveStored={handleSaveStored}
                downloadJSON={downloadJSON}
                handleFileUpload={handleFileUpload}
            />
        </div>
      </div>
      <MobileNavigation
        tabs={formTabs}
        activeTab={activeFormTab}
        setActiveTab={setActiveFormTab}
      />
    </div>
  );
};

export default FormPage;