/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { parseTeam } from "../../utils/parseTeam";
import { createPaste } from "../../services/apiService";

const TeamForm = ({ data, setData }) => {
  const [teamInput, setTeamInput] = useState("");
  const [pasteId, setPasteId] = useState(data?.paste || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isNewPaste, setIsNewPaste] = useState(false);
  const BACK_URL = process.env.REACT_APP_BACK_URL;

  useEffect(() => {
    if (data?.paste) {
      setIsNewPaste(false);
      setPasteId(data.paste);
      setIsSubmitted(true);
    }
  }, [data?.paste]);

  useEffect(() => {
    if (data?.team && data.team.length > 0) {
      setIsSubmitted(true);
    }
  }, [data?.team]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const newTeam = parseTeam(teamInput);

      if (!Array.isArray(newTeam) || newTeam.length === 0) {
        setError("❌ Invalid team format. Please check your Showdown export.");
        setIsLoading(false);
        return;
      }

      if (newTeam.length > 6) {
        setError("❌ Team cannot have more than 6 Pokémon.");
        setIsLoading(false);
        return;
      }

      if (teamInput.trim()) {
        const result = await createPaste(teamInput);
        const extractedPasteId = result.pasteId;

        if (extractedPasteId) {
          setIsNewPaste(true);
          setPasteId(extractedPasteId);
        }

        setData((prevData) => ({
          ...prevData,
          team: newTeam,
          paste: extractedPasteId,
        }));

        setIsSubmitted(true);
        setTeamInput("");
      }
    } catch (error) {
      console.error("Error submitting team:", error);
      setError("❌ Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTeamInput("");
    setPasteId("");
    setError("");
    setIsSubmitted(false);
    setData((prevData) => ({
      ...prevData,
      team: [],
      paste: "",
    }));
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="form-title-modern mb-0">
          <i className="fas fa-users me-2 text-accent-modern"></i>
          Team Setup
        </h2>
        {isSubmitted && (
          <button
            onClick={handleReset}
            className="btn btn-secondary-modern btn-sm"
          >
            <i className="fas fa-edit me-2"></i>
            Edit Team
          </button>
        )}
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleFormSubmit}>
          <div className="form-group-modern">
            <label className="form-label-modern">
              <i className="fas fa-clipboard me-2"></i>
              Showdown Team Export
            </label>
            <textarea
              value={teamInput}
              onChange={(e) => setTeamInput(e.target.value)}
              rows="12"
              className="form-control form-control-modern"
              placeholder="Paste your Pokémon Showdown team export here...
Example:
Charizard @ Life Orb
Ability: Solar Power
Level: 50
EVs: 4 HP / 252 SpA / 252 Spe
Modest Nature
IVs: 0 Atk
- Heat Wave
- Solar Beam
- Hurricane
- Protect"
              style={{
                fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
                fontSize: "0.875rem",
              }}
              required
            />
            <div className="text-muted-modern mt-2">
              <small>
                <i className="fas fa-info-circle me-1"></i>
                Copy your team from Pokémon Showdown and paste it here
              </small>
            </div>
          </div>

          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary-modern"
              disabled={isLoading || !teamInput.trim()}
            >
              {isLoading ? (
                <>
                  <div
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Processing Team...
                </>
              ) : (
                <>
                  <i className="fas fa-check me-2"></i>
                  Submit Team
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="content-card-modern p-0-mobile">
          {/* Team Success State */}
          <div className="d-flex align-items-center mb-3">
            <div className="d-flex align-items-center">
              <i className="fas fa-check-circle text-success me-2 fa-lg"></i>
              <h4 className="mb-0">Team Submitted Successfully</h4>
            </div>
          </div>

          {/* Paste Link */}
          {pasteId && (
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-between p-3 border rounded">
                <div className="d-flex align-items-center flex-grow-1 min-w-0">
                  <i className="fas fa-external-link-alt text-accent-modern me-2 flex-shrink-0"></i>
                  <div className="flex-grow-1 min-w-0">
                    <span className="text-muted-modern me-2 d-block d-sm-inline">
                      PokeBin Paste:
                    </span>
                    <div className="paste-link-container">
                      <a
                        href={`https://pokebin.com/${pasteId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-decoration-none fw-medium"
                        style={{ wordBreak: "break-all" }}
                      >
                        pokebin.com/{pasteId}
                      </a>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `https://pokebin.com/${pasteId}`
                    )
                  }
                  className="btn btn-secondary-modern btn-sm flex-shrink-0 ms-2"
                  title="Copy link"
                >
                  <i className="fas fa-copy"></i>
                </button>
              </div>
            </div>
          )}

          {/* Team Stats */}
          <div className="mt-4 pt-3 border-top">
            <div className="row text-center">
              <div className="col-6">
                <div className="text-accent-modern fw-bold h4">
                  {data?.team?.length || 0}
                </div>
                <div className="text-muted-modern small">Pokémon</div>
              </div>
              <div className="col-6">
                <div className="fw-bold h4">
                  {pasteId ? (
                    <span className="text-success">✓</span>
                  ) : (
                    <span className="text-danger">✗</span>
                  )}
                </div>
                <div className="text-muted-modern small">PokeBin</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamForm;
