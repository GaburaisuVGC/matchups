/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { parseTeam } from "./utils/parseTeam";
import ImageLoader from "./ImageLoader";

const TeamForm = ({ data, setData }) => {
  const [teamInput, setTeamInput] = useState("");
  const [pasteId, setPasteId] = useState(data?.paste || "");
  const [pokemonImages, setPokemonImages] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
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

  useEffect(() => {
    if (pasteId) {
      fetchPokemonImages(pasteId);
    }
    // eslint-disable-next-line
  }, [pasteId]);

  const fetchPokemonImages = async (pasteId) => {
    if (!pasteId) return;

    if (isNewPaste) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsNewPaste(false);
    }

    setLoadingImages(true);
    try {
      const response = await fetch(
        `${BACK_URL}/parse-pokebin?pasteId=${pasteId}`
      );
      const images = await response.json();
      setPokemonImages(images);
    } catch (error) {
      console.error("Failed to fetch Pokémon images", error);
    } finally {
      setLoadingImages(false);
    }
  };

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

      // Create paste on PokeBin
      const formData = new URLSearchParams();
      formData.append("title", "");
      formData.append("author", "");
      formData.append("notes", "");
      formData.append("format", "");
      formData.append("rental", "");
      formData.append("encrypted_data", "");
      formData.append("paste", teamInput);

      if (teamInput.trim()) {
        const response = await fetch("https://pokebin.com/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        });

        let extractedPasteId = "";
        if (response.url) {
          const pasteIdMatch = response.url.match(/\/([^/]+)\/?$/);
          if (pasteIdMatch) {
            extractedPasteId = pasteIdMatch[1];
            setIsNewPaste(true);
            setPasteId(extractedPasteId);
          }
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
    setPokemonImages([]);
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
              style={{ fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace", fontSize: "0.875rem" }}
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
                  <div className="spinner-border spinner-border-sm me-2" role="status">
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
                    <span className="text-muted-modern me-2 d-block d-sm-inline">PokeBin Paste:</span>
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
                  onClick={() => navigator.clipboard.writeText(`https://pokebin.com/${pasteId}`)}
                  className="btn btn-secondary-modern btn-sm flex-shrink-0 ms-2"
                  title="Copy link"
                >
                  <i className="fas fa-copy"></i>
                </button>
              </div>
            </div>
          )}

          {/* Pokemon Images */}
          {(pokemonImages.length > 0 || loadingImages) && (
            <div>
              <h5 className="mb-3">
                <i className="fas fa-images me-2"></i>
                Team Preview ({loadingImages ? 'Loading...' : `${pokemonImages.length} Pokémon`})
              </h5>
              <div className="row g-3">
                {loadingImages ? (
                  // Loading skeletons
                  Array.from({ length: data?.team?.length || 6 }).map((_, index) => (
                    <div key={index} className="col-6 col-md-4 col-lg-2">
                      <div className="text-center">
                        <ImageLoader
                          src=""
                          alt=""
                          className="border-0"
                          style={{ 
                            width: "80px", 
                            height: "80px"
                          }}
                          showSkeleton={true}
                        />
                        <div className="text-muted-modern mt-1">
                          <small>#{index + 1}</small>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  pokemonImages.map((src, index) => (
                    <div key={index} className="col-6 col-md-4 col-lg-2">
                      <div className="text-center">
                        <ImageLoader
                          src={src}
                          alt={`Pokémon ${index + 1}`}
                          className="img-thumbnail"
                          style={{ 
                            width: "80px", 
                            height: "80px", 
                            objectFit: "contain",
                            background: "transparent"
                          }}
                        />
                        <div className="text-muted-modern mt-1">
                          <small>#{index + 1}</small>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Team Stats */}
          <div className="mt-4 pt-3 border-top">
            <div className="row text-center">
              <div className="col-4">
                <div className="text-accent-modern fw-bold h4">{data?.team?.length || 0}</div>
                <div className="text-muted-modern small">Pokémon</div>
              </div>
              <div className="col-4">
                <div className="fw-bold h4">
                  {pasteId ? <span className="text-success">✓</span> : <span className="text-danger">✗</span>}
                </div>
                <div className="text-muted-modern small">PokeBin</div>
              </div>
              <div className="col-4">
                <div className="fw-bold h4">
                  {pokemonImages.length > 0 ? <span className="text-success">✓</span> : <span className="text-danger">✗</span>}
                </div>
                <div className="text-muted-modern small">Images</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamForm;