import React, { useState } from "react";

const AddMatchupForm = ({ data, setData }) => {
  const [matchupTitle, setMatchupTitle] = useState("");
  const [matchupPaste, setMatchupPaste] = useState("");

  const initialComposition = [
    { pokemon: "", role: "Lead" },
    { pokemon: "", role: "Lead" },
    { pokemon: "", role: "Back" },
    { pokemon: "", role: "Back" },
  ];

  const addMatchup = () => {
    if (data.team.length === 0) {
      return;
    }
    if (!matchupTitle.trim()) {
      return;
    }
    const newMatchup = {
      title: matchupTitle.trim(),
      paste: matchupPaste.trim(),
      gameplans: [{ text: "", composition: [...initialComposition], replays: [] }],
    };
    setData((prevData) => ({
      ...prevData,
      matchups: [...prevData.matchups, newMatchup],
    }));
    setMatchupTitle("");
    setMatchupPaste("");
  };

  const teamExists = data.team.length > 0;

  return (
    <div className="form-section-modern p-3 p-lg-4 mb-4">
      <h2 className="form-title-modern mb-4">
        <i className="fas fa-plus me-2 text-accent-modern"></i>
        Add New Matchup
      </h2>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label-modern">Matchup Title</label>
          <input
            type="text"
            value={matchupTitle}
            onChange={(e) => setMatchupTitle(e.target.value)}
            className="form-control form-control-modern"
            placeholder="vs Team Name or Archetype..."
            disabled={!teamExists}
            maxLength={50}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label-modern">Opponent's Paste (Optional)</label>
          <input
            type="url"
            value={matchupPaste}
            onChange={(e) => setMatchupPaste(e.target.value)}
            className="form-control form-control-modern"
            placeholder="https://pokepast.es/..."
            disabled={!teamExists}
          />
        </div>
      </div>
      <div className="mt-3">
        <button
          onClick={addMatchup}
          className="btn btn-primary-modern"
          disabled={!teamExists || !matchupTitle.trim()}
        >
          <i className="fas fa-plus me-2"></i>
          Add Matchup
        </button>
      </div>
      {!teamExists && (
        <div className="alert alert-info mt-3 mb-0" role="alert">
          Please submit a team first to add matchups.
        </div>
      )}
    </div>
  );
};

export default AddMatchupForm;
