import React, { useState, useEffect } from "react";
import TeamForm from "./TeamForm";
import MatchupForm from "./MatchupForm";
import initialData from "./utils/initialData";
import CalcForm from "./CalcForm";
import AddCalcForm from "./AddCalcForm";
import AddMatchupForm from "./AddMatchupForm";
import MatchupListMobile from "./MatchupListMobile";
import MobileNavigation from "./MobileNavigation";
import "./App.css";

const FormPage = () => {
  const [data, setData] = useState({ ...initialData, generalTitle: "" });
  const [teamSubmitted, setTeamSubmitted] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState("team");
  const [selectedMatchup, setSelectedMatchup] = useState(0);
  const [selectedPokemonIndex, setSelectedPokemonIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const FRONT_URL = process.env.REACT_APP_FRONT_URL;
  const BACK_URL = process.env.REACT_APP_BACK_URL;

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkMode);
  }, []);

  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "light-mode";
  }, [isDarkMode]);

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
      const response = await fetch(`${BACK_URL}/encode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        const newUrl = `${FRONT_URL}/${result.id}`;
        navigator.clipboard.writeText(newUrl);
        showStatus("✅ Saved! URL copied to clipboard");
        window.open(newUrl, "_blank");
      } else {
        showStatus("❌ Save failed. Please try again.", "error");
      }
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
      <div className="cta-how-to-use-subtle text-center">
        <div className="d-flex align-items-center justify-content-center mb-3">
          <i className="fas fa-rocket fa-2x me-3"></i>
          <div className="text-start">
            <h2 className="h4 mb-1">New to Matchups.net?</h2>
            <p className="mb-0 opacity-90">Learn how to create professional tournament preparation documents</p>
          </div>
        </div>
        <a href="/how-to-use" className="btn btn-subtle-modern btn-lg">
          <i className="fas fa-question-circle me-2"></i>
          Quick Start Guide
        </a>
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
          <div className="homepage-sticky-actions">
            {/* Calcs Navigation */}
            {activeFormTab === 'calcs' && teamSubmitted && (
              <div className="form-section-modern d-none d-lg-block">
                <div className="matchups-sidebar">
                  <h5 className="mb-3">
                    <i className="fas fa-users me-2"></i>
                    Your Team
                  </h5>
                  <div className="matchups-nav">
                    {data.team.map((pokemon, index) => {
                      const totalCalcs = (pokemon.calcs[0]?.offensive?.length || 0) + (pokemon.calcs[0]?.defensive?.length || 0);
                      return (
                        <div
                          key={index}
                          className={`matchup-nav-item ${selectedPokemonIndex === index ? "active" : ""}`}
                          onClick={() => setSelectedPokemonIndex(index)}
                        >
                          <div className="flex-grow-1">
                            <div className="fw-medium" style={{ fontSize: "0.875rem" }}>
                              {pokemon.species}
                            </div>
                            <small className="text-muted">
                              {totalCalcs} calc{totalCalcs !== 1 ? "s" : ""}
                            </small>
                          </div>
                          <span className="matchup-nav-badge">
                            {totalCalcs}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Matchup Navigation */}
            {activeFormTab === "matchups" && data.matchups.length > 0 && (
              <div className="form-section-modern d-none d-lg-block">
                <div className="matchups-sidebar">
                  <h5 className="mb-3">
                    <i className="fas fa-list me-2"></i>
                    Your Matchups
                  </h5>
                  <div className="matchups-nav">
                    {data.matchups.map((matchup, index) => (
                      <div
                        key={index}
                        className={`matchup-nav-item ${
                          selectedMatchup === index ? "active" : ""
                        }`}
                        onClick={() => setSelectedMatchup(index)}
                      >
                        <div className="flex-grow-1">
                          <div
                            className="fw-medium"
                            style={{ fontSize: "0.875rem" }}
                          >
                            {matchup.title}
                          </div>
                          <small className="text-muted">
                            {matchup.gameplans.length} gameplan
                            {matchup.gameplans.length !== 1 ? "s" : ""}
                          </small>
                        </div>
                        <span className="matchup-nav-badge">
                          {matchup.gameplans.length}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Document Title Section */}
            <div className="form-section-modern">
              <div className="form-group-modern">
                <label className="form-label-modern">
                  <i className="fas fa-heading me-2"></i>
                  Document Title (Optional)
                </label>
                <input
                  type="text"
                  value={data.generalTitle}
                  onChange={handleTitleChange}
                  className="form-control form-control-modern"
                  placeholder="Enter a title for your document..."
                  maxLength={100}
                />
                <div className="text-muted-modern mt-2">
                  <small>{data.generalTitle.length}/100 characters</small>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="form-section-modern">
              <div className="row g-2">
                <div className="col-6 d-grid">
                  <button
                    onClick={handleSave}
                    className="btn btn-primary-modern"
                    disabled={!teamSubmitted || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-cloud-upload-alt me-2"></i>
                        <span>Save & Share</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="col-6 d-grid">
                  <button
                    onClick={handleSaveStored}
                    className="btn btn-secondary-modern"
                    disabled={!teamSubmitted}
                  >
                    <i className="fas fa-save me-2"></i>
                    <span>Save Locally</span>
                  </button>
                </div>
                <div className="col-6 d-grid">
                  <button
                    onClick={downloadJSON}
                    className="btn btn-secondary-modern"
                    disabled={!teamSubmitted}
                  >
                    <i className="fas fa-download me-2"></i>
                    <span>Download Draft</span>
                  </button>
                </div>
                <div className="col-6 d-grid">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="d-none"
                    id="file-upload"
                  />
                  <button
                    className="btn btn-secondary-modern"
                    onClick={() => document.getElementById("file-upload").click()}
                  >
                    <i className="fas fa-upload me-2"></i>
                    <span>Load Draft</span>
                  </button>
                </div>
              </div>

              {/* Help Text */}
              <div className="mt-4 p-3 rounded border">
                <div className="row text-center">
                  <div className="col-md-3 mb-3 mb-md-0">
                    <div className="help-icon-wrapper">
                      <i className="fas fa-cloud-upload-alt text-accent-modern fa-2x"></i>
                    </div>
                    <p className="small text-muted-modern mb-0 help-text-small">
                      Save & Share creates a public link
                    </p>
                  </div>
                  <div className="col-md-3 mb-3 mb-md-0">
                    <div className="help-icon-wrapper">
                      <i className="fas fa-save text-accent-modern fa-2x"></i>
                    </div>
                    <p className="small text-muted-modern mb-0 help-text-small">
                      Save Locally stores in your browser
                    </p>
                  </div>
                  <div className="col-md-3 mb-3 mb-md-0">
                    <div className="help-icon-wrapper">
                      <i className="fas fa-download text-accent-modern fa-2x"></i>
                    </div>
                    <p className="small text-muted-modern mb-0 help-text-small">
                      Download Draft saves as JSON file
                    </p>
                  </div>
                  <div className="col-md-3">
                    <div className="help-icon-wrapper">
                      <i className="fas fa-upload text-accent-modern fa-2x"></i>
                    </div>
                    <p className="small text-muted-modern mb-0 help-text-small">
                      Load Draft opens a saved JSON file
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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