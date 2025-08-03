import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const MatchupForm = ({ data, setData, selectedMatchup, setSelectedMatchup }) => {
  const [matchupTitle, setMatchupTitle] = useState("");
  const [matchupPaste, setMatchupPaste] = useState("");
  const [bulkReplays, setBulkReplays] = useState({});

  const initialComposition = [
    { pokemon: "", role: "Lead" },
    { pokemon: "", role: "Lead" },
    { pokemon: "", role: "Back" },
    { pokemon: "", role: "Back" },
  ];

  const MAX_LENGTH = 1000;

  const addMatchup = () => {
    if (data.team.length === 0) {
      alert("Please submit a team before adding matchups.");
      return;
    }

    if (!matchupTitle.trim()) {
      alert("Please enter a matchup title.");
      return;
    }

    const newMatchup = {
      title: matchupTitle.trim(),
      paste: matchupPaste.trim(),
      gameplans: [
        {
          text: "",
          composition: [...initialComposition],
          replays: [],
        },
      ],
    };

    setData((prevData) => ({
      ...prevData,
      matchups: [...prevData.matchups, newMatchup],
    }));
    setMatchupTitle("");
    setMatchupPaste("");
  };

  const addGameplan = (index) => {
    const updatedMatchups = [...data.matchups];
    const newGameplan = {
      text: "",
      composition: [...initialComposition],
      replays: [],
    };

    updatedMatchups[index].gameplans.push(newGameplan);
    setData({ ...data, matchups: updatedMatchups });
  };

  const handleGameplanChange = (matchupIndex, gameplanIndex, value) => {
    const plainText = getPlainText(value);
    if (plainText.length <= MAX_LENGTH) {
      const updatedMatchups = [...data.matchups];
      updatedMatchups[matchupIndex].gameplans[gameplanIndex].text = value;
      setData({ ...data, matchups: updatedMatchups });
    }
  };

  const handleCompositionChange = (
    matchupIndex,
    gameplanIndex,
    compIndex,
    field,
    value
  ) => {
    const updatedMatchups = [...data.matchups];
    updatedMatchups[matchupIndex].gameplans[gameplanIndex].composition[
      compIndex
    ][field] = value;
    setData({ ...data, matchups: updatedMatchups });
  };

  const handleReplaysChange = (matchupIndex, gameplanIndex, value) => {
    const updatedMatchups = [...data.matchups];
    if (!updatedMatchups[matchupIndex].gameplans[gameplanIndex].replays) {
      updatedMatchups[matchupIndex].gameplans[gameplanIndex].replays = [];
    }
    updatedMatchups[matchupIndex].gameplans[gameplanIndex].replays = value
      .split(/[\s,\n]+/)
      .map((link) => link.trim())
      .filter((link) => link !== "");
    setData({ ...data, matchups: updatedMatchups });
  };

  const handleBulkReplaysChange = (matchupIndex, gameplanIndex, value) => {
    setBulkReplays((prev) => ({
      ...prev,
      [`${matchupIndex}-${gameplanIndex}`]: value,
    }));
  };

  const handleMatchupTitleChange = (index, value) => {
    const updatedMatchups = [...data.matchups];
    updatedMatchups[index].title = value;
    setData({ ...data, matchups: updatedMatchups });
  };

  const handleMatchupPasteChange = (index, value) => {
    const updatedMatchups = [...data.matchups];
    updatedMatchups[index].paste = value;
    setData({ ...data, matchups: updatedMatchups });
  };

  const removeGameplan = (matchupIndex, gameplanIndex) => {
    const updatedMatchups = [...data.matchups];
    updatedMatchups[matchupIndex].gameplans.splice(gameplanIndex, 1);
    setData({ ...data, matchups: updatedMatchups });
  };

  const removeMatchup = (index) => {
    const updatedMatchups = [...data.matchups];
    updatedMatchups.splice(index, 1);
    setData({ ...data, matchups: updatedMatchups });
  };

  const getPlainText = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const teamExists = data.team.length > 0;
  const hasMatchups = data.matchups.length > 0;
  const selectedMatchupData = data.matchups[selectedMatchup];

  return (
    <div>
      <h2 className="form-title-modern mb-4">
        <i className="fas fa-swords me-2 text-accent-modern"></i>
        Matchup Analysis
      </h2>

      {/* Add New Matchup Section */}
      <div className="content-card-modern mb-4">
        <h5 className="mb-3">
          <i className="fas fa-plus me-2"></i>
          Add New Matchup
        </h5>

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label-modern">
              <i className="fas fa-tag me-2"></i>
              Matchup Title
            </label>
            <input
              type="text"
              value={matchupTitle}
              onChange={(e) => setMatchupTitle(e.target.value)}
              className="form-control form-control-modern"
              placeholder="vs Team Name or Archetype..."
              disabled={!teamExists}
              maxLength={50}
            />
            <div className="text-muted-modern mt-1">
              <small>{matchupTitle.length}/50 characters</small>
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label-modern">
              <i className="fas fa-external-link-alt me-2"></i>
              Opponent's Paste (Optional)
            </label>
            <input
              type="url"
              value={matchupPaste}
              onChange={(e) => setMatchupPaste(e.target.value)}
              className="form-control form-control-modern"
              placeholder="https://pokebin.com/..."
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
            <i className="fas fa-info-circle me-2"></i>
            Please submit a team first to add matchups.
          </div>
        )}
      </div>

      {/* Matchups Layout */}
      {hasMatchups ? (
        <div className="viewer-layout">
          {/* Main Content */}
          <div>
            {selectedMatchupData && (
              <>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="mb-0">
                    <i className="fas fa-edit me-2"></i>
                    Editing: {selectedMatchupData.title}
                  </h5>
                  <button
                    onClick={() => removeMatchup(selectedMatchup)}
                    className="btn btn-outline-danger btn-sm"
                  >
                    <i className="fas fa-trash me-2"></i>
                    Remove Matchup
                  </button>
                </div>

                {/* Edit Matchup Info */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label-modern">Edit Title</label>
                    <input
                      type="text"
                      value={selectedMatchupData.title}
                      onChange={(e) => handleMatchupTitleChange(selectedMatchup, e.target.value)}
                      className="form-control form-control-modern"
                      maxLength={50}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-modern">Edit Paste URL</label>
                    <input
                      type="url"
                      value={selectedMatchupData.paste}
                      onChange={(e) => handleMatchupPasteChange(selectedMatchup, e.target.value)}
                      className="form-control form-control-modern"
                      placeholder="https://pokebin.com/..."
                    />
                  </div>
                </div>

                <div className="border-top pt-3">
                  <h6 className="mb-3">
                    <i className="fas fa-chess me-2"></i>
                    Gameplans ({selectedMatchupData.gameplans.length})
                  </h6>
                  <button
                    onClick={() => addGameplan(selectedMatchup)}
                    className="btn btn-primary-modern btn-sm mb-3"
                  >
                    <i className="fas fa-plus me-2"></i>
                    Add Gameplan
                  </button>

                  {selectedMatchupData.gameplans.map((gameplan, gameplanIndex) => (
                    <div key={gameplanIndex} className="border rounded p-3 mb-3">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h6 className="mb-0">
                          <i className="fas fa-chess-pawn me-2"></i>
                          Gameplan {gameplanIndex + 1}
                        </h6>
                        <button
                          onClick={() => removeGameplan(selectedMatchup, gameplanIndex)}
                          className="btn btn-outline-danger btn-sm"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>

                      {/* Strategy Text */}
                      <div className="mb-3">
                        <label className="form-label-modern">Strategy & Notes</label>
                        <ReactQuill
                          value={gameplan.text}
                          onChange={(value) => handleGameplanChange(selectedMatchup, gameplanIndex, value)}
                          theme="snow"
                          modules={{
                            toolbar: [['bold', 'italic', 'underline'], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['clean']]
                          }}
                          style={{ minHeight: "120px" }}
                        />
                        <div className="text-muted-modern mt-1">
                          <small>{getPlainText(gameplan.text).length}/{MAX_LENGTH} characters</small>
                        </div>
                      </div>

                      {/* Team Composition */}
                      <div className="mb-3">
                        <label className="form-label-modern">Team Composition</label>
                        <div className="row g-2">
                          {gameplan.composition.map((comp, compIndex) => (
                            <div key={compIndex} className="col-md-6">
                              <div className="d-flex gap-2">
                                <select
                                  value={comp.pokemon}
                                  onChange={(e) => handleCompositionChange(selectedMatchup, gameplanIndex, compIndex, "pokemon", e.target.value)}
                                  className="form-control form-control-modern flex-grow-1"
                                >
                                  <option value="">Select Pokémon</option>
                                  {data.team.map((pokemon, i) => (
                                    <option key={i} value={pokemon.species}>{pokemon.species}</option>
                                  ))}
                                </select>
                                <select
                                  value={comp.role}
                                  onChange={(e) => handleCompositionChange(selectedMatchup, gameplanIndex, compIndex, "role", e.target.value)}
                                  className={`form-control form-control-modern ${comp.role === "Lead" ? "lead-select" : "back-select"}`}
                                  style={{ width: "100px" }}
                                >
                                  <option value="Lead">Lead</option>
                                  <option value="Back">Back</option>
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Replays */}
                      <div className="mb-3">
                        <label className="form-label-modern">Replay Links</label>
                        {gameplan.replays && gameplan.replays.length > 0 && (
                          <div className="mb-2">
                            <div className="d-flex flex-wrap gap-2">
                              {gameplan.replays.map((replay, index) => (
                                <a key={index} href={replay} target="_blank" rel="noopener noreferrer" className="btn btn-secondary-modern btn-sm">
                                  <i className="fas fa-play me-1"></i> Replay {index + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        <textarea
                          className="form-control form-control-modern"
                          rows="3"
                          value={bulkReplays[`${selectedMatchup}-${gameplanIndex}`] || gameplan.replays?.join("\n") || ""}
                          onChange={(e) => handleBulkReplaysChange(selectedMatchup, gameplanIndex, e.target.value)}
                          placeholder="Enter replay URLs (one per line or separated by spaces/commas)..."
                          style={{ fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace", fontSize: "0.875rem" }}
                        />
                        <button
                          className="btn btn-primary-modern btn-sm mt-2"
                          onClick={() => handleReplaysChange(selectedMatchup, gameplanIndex, bulkReplays[`${selectedMatchup}-${gameplanIndex}`] || gameplan.replays?.join("\n") || "")}
                        >
                          <i className="fas fa-save me-2"></i> Update Replays
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="fas fa-swords fa-3x text-muted mb-3"></i>
          <h6 className="text-muted-modern">No matchups yet</h6>
          <p className="text-muted-modern mb-0">Add your first matchup using the form above</p>
        </div>
      )}
    </div>
  );
};

export default MatchupForm;