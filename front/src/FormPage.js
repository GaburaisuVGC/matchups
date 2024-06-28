import React, { useState, useEffect } from "react";
import TeamForm from "./TeamForm";
import MatchupForm from "./MatchupForm";
import initialData from "./utils/initialData";
import CalcForm from "./CalcForm";
import "./App.css";

const FormPage = () => {
  const [data, setData] = useState(initialData);
  const [teamSubmitted, setTeamSubmitted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const FRONT_URL = process.env.REACT_APP_FRONT_URL;
  const BACK_URL = process.env.REACT_APP_BACK_URL;

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkMode);
  }, []);

  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "light-mode";
  }, [isDarkMode]);

  const handleSave = async () => {
    const response = await fetch(`${BACK_URL}/encode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const encodedData = await response.text();
      const id = JSON.parse(encodedData).id;

      window.location.href = `${FRONT_URL}/${id}`;
    }
  };

  const downloadJSON = () => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "draft.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          if (isValidJSON(jsonData)) {
            setData(jsonData);
            setTeamSubmitted(true); // Marquer que l'équipe a été soumise
          } else {
            alert("Invalid JSON structure");
          }
        } catch (error) {
          alert("Error parsing JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  const isValidJSON = (json) => {
    if (
      Array.isArray(json.team) &&
      json.team.every(
        (pokemon) =>
          typeof pokemon.species === "string" && Array.isArray(pokemon.calcs)
      ) &&
      typeof json.paste === "string" &&
      Array.isArray(json.matchups) &&
      json.matchups.every(
        (matchup) =>
          typeof matchup.title === "string" &&
          typeof matchup.paste === "string" &&
          Array.isArray(matchup.gameplans) &&
          matchup.gameplans.every(
            (gameplan) =>
              typeof gameplan.text === "string" &&
              Array.isArray(gameplan.composition) &&
              gameplan.composition.every(
                (comp) =>
                  typeof comp.pokemon === "string" &&
                  typeof comp.role === "string"
              )
          )
      )
    ) {
      return true;
    }
    return false;
  };

  return (
    <div
      className={`container ${isDarkMode ? "dark-mode" : "light-mode"}`}
    >
      <h1 className="text-center mb-4">Matchups.net</h1>
      <div
        className={`card mb-4 ${
          isDarkMode ? "card-dark-mode" : "card-light-mode"
        }`}
      >
        <div className="card-body">
          <TeamForm
            data={data}
            setData={(newData) => {
              setData(newData);
              setTeamSubmitted(true);
            }}
          />
        </div>
      </div>
      {teamSubmitted && (
        <>
          <div
            className={`card mb-4 ${
              isDarkMode ? "card-dark-mode" : "card-light-mode"
            }`}
          >
            <div className="card-body">
              <CalcForm data={data} setData={setData} />
            </div>
          </div>
          <div
            className={`card mb-4 ${
              isDarkMode ? "card-dark-mode" : "card-light-mode"
            }`}
          >
            <div className="card-body">
              <MatchupForm data={data} setData={setData} />
            </div>
          </div>
        </>
      )}
      <div className="d-flex justify-content-start">
        <button
          onClick={handleSave}
          className="btn btn-primary me-2"
          disabled={!teamSubmitted}
        >
          Save
        </button>
        <button
          onClick={downloadJSON}
          className="btn btn-secondary me-2"
          disabled={!teamSubmitted}
        >
          Save Draft
        </button>
        <div className="custom-file">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={handleFileUpload}
            hidden
          />
          <button
            className="btn btn-secondary"
            onClick={() => document.getElementById("customFile").click()}
          >
            Load Draft
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormPage;
