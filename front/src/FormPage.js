import React, { useState, useEffect } from "react";
import TeamForm from "./TeamForm";
import MatchupForm from "./MatchupForm";
import initialData from "./utils/initialData";
import CalcForm from "./CalcForm";
import "./App.css";

const FormPage = () => {
  const [data, setData] = useState({ ...initialData, generalTitle: "" });
  const [teamSubmitted, setTeamSubmitted] = useState(false);
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

  return (
    <div className="fade-in">
      {/* CTA How To Use - Above the fold */}
      <div className="cta-how-to-use text-center">
        <div className="d-flex align-items-center justify-content-center mb-3">
          <i className="fas fa-rocket fa-2x me-3"></i>
          <div>
            <h2 className="h4 mb-1">New to Matchups.net?</h2>
            <p className="mb-0 opacity-90">Learn how to create professional tournament preparation documents</p>
          </div>
        </div>
        <a href="/how-to-use" className="btn btn-light btn-lg">
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

      {/* Team Form Section */}
      <div className="form-section-modern">
        <TeamForm
          data={data}
          setData={(newData) => {
            setData(newData);
            setTeamSubmitted(true);
          }}
        />
      </div>

      {/* Conditional Sections - Only show after team submission */}
      {teamSubmitted && (
        <>
          {/* Calculations Section */}
          <div className="form-section-modern">
            <CalcForm data={data} setData={setData} />
          </div>

          {/* Matchups Section */}
          <div className="form-section-modern">
            <MatchupForm data={data} setData={setData} />
          </div>
        </>
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
        <div className="row g-3">
          {/* Primary Actions */}
          <div className="col-md-6">
            <div className="d-grid gap-2">
              <button
                onClick={handleSave}
                className="btn btn-primary-modern d-flex align-items-center justify-content-center"
                disabled={!teamSubmitted || isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-cloud-upload-alt me-2"></i>
                    Save & Share
                  </>
                )}
              </button>
              <button
                onClick={handleSaveStored}
                className="btn btn-secondary-modern d-flex align-items-center justify-content-center"
                disabled={!teamSubmitted}
              >
                <i className="fas fa-save me-2"></i>
                Save Locally
              </button>
            </div>
          </div>

          {/* Secondary Actions */}
          <div className="col-md-6">
            <div className="d-grid gap-2">
              <button
                onClick={downloadJSON}
                className="btn btn-secondary-modern d-flex align-items-center justify-content-center"
                disabled={!teamSubmitted}
              >
                <i className="fas fa-download me-2"></i>
                Download Draft
              </button>
              <div className="position-relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="position-absolute opacity-0"
                  style={{ left: "-9999px" }}
                  id="file-upload"
                />
                <button
                  className="btn btn-secondary-modern w-100 d-flex align-items-center justify-content-center"
                  onClick={() => document.getElementById("file-upload").click()}
                >
                  <i className="fas fa-upload me-2"></i>
                  Load Draft
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-4 p-3 rounded border">
          <div className="row text-center">
            <div className="col-md-3 mb-3 mb-md-0">
              <i className="fas fa-cloud-upload-alt text-accent-modern fa-2x mb-2"></i>
              <p className="small text-muted-modern mb-0">Save & Share creates a public link</p>
            </div>
            <div className="col-md-3 mb-3 mb-md-0">
              <i className="fas fa-save text-accent-modern fa-2x mb-2"></i>
              <p className="small text-muted-modern mb-0">Save Locally stores in your browser</p>
            </div>
            <div className="col-md-3 mb-3 mb-md-0">
              <i className="fas fa-download text-accent-modern fa-2x mb-2"></i>
              <p className="small text-muted-modern mb-0">Download Draft saves as JSON file</p>
            </div>
            <div className="col-md-3">
              <i className="fas fa-upload text-accent-modern fa-2x mb-2"></i>
              <p className="small text-muted-modern mb-0">Load Draft opens a saved JSON file</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPage;