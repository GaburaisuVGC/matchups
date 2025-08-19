import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import useDocument from "../../hooks/useDocument";
import ImageLoader from "../../shared/components/ImageLoader";
import MobileNavigation from "../../shared/components/MobileNavigation";
import TeamPreview from "../../shared/components/TeamPreview";
import "./DocumentViewer.css";

const DocumentViewer = ({ source }) => {
  const navigate = useNavigate();
  const {
    documentData: data,
    pokemonImages,
    loading,
    error,
  } = useDocument(source);

  // UI-specific state
  const [expandedPokemon, setExpandedPokemon] = useState(null);
  const [expandedMatchup, setExpandedMatchup] = useState(null);
  const [selectedMatchup, setSelectedMatchup] = useState(0);
  const [activeTab, setActiveTab] = useState("matchups");
  const [selectedPokemon, setSelectedPokemon] = useState(0);
  const [activeViewerTab, setActiveViewerTab] = useState("matchups");

  useEffect(() => {
    // Reset active tab if there are no matchups
    if (data && data.matchups.length === 0) {
      setActiveViewerTab("team");
      setActiveTab("team");
    }
  }, [data]);

  const downloadJSON = () => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.generalTitle || "document"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleQuickEdit = () => {
    localStorage.setItem("matchupData", JSON.stringify(data));
    navigate("/");
  };

  const handleCleanStorage = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your locally stored document? This action cannot be undone."
      )
    ) {
      localStorage.removeItem("storedData");
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="fade-in">
        <div className="text-center">
          <div className="content-card-modern">
            <div className="d-flex justify-content-center mb-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
            <h3 className="h5 mb-2">Loading Document...</h3>
            <p className="text-muted-modern mb-0">
              Please wait while we fetch the data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const isLocal = source === "local";
    return (
      <div className="fade-in">
        <div className="text-center mb-5">
          <div className="content-card-modern">
            <i
              className={`fas ${
                isLocal ? "fa-folder-open" : "fa-exclamation-triangle"
              } fa-3x text-warning mb-3`}
            ></i>
            <h1 className="h3 mb-3">
              {isLocal ? "No Local Document Found" : "Document Not Found"}
            </h1>
            <p className="text-muted-modern mb-4">
              {isLocal
                ? "You don't have any documents saved locally. Create one or load from a file."
                : "The document you're looking for doesn't exist or has been removed."}
            </p>
            <div className="btn-group-modern">
              <button
                onClick={() => navigate("/")}
                className="btn btn-primary-modern"
              >
                <i
                  className={`fas ${isLocal ? "fa-plus" : "fa-home"} me-2`}
                ></i>
                {isLocal ? "Create New Document" : "Return Home"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null; // Should be handled by loading and error states
  }

  const pageTitle =
    data.generalTitle ||
    (source === "local" ? "Local Document" : "View Document");

  const renderDocumentHeader = () => (
    <div className="content-card-modern mt-4 mb-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div className="flex-grow-1">
          <div className="d-flex align-items-center mb-2">
            {source === "local" && (
              <>
                <i className="fas fa-hdd text-success me-2"></i>
                <span className="badge bg-success me-2">Local</span>
              </>
            )}
            <h1 className="h3 mb-0">{pageTitle}</h1>
          </div>
          <div className="d-flex align-items-center gap-3 text-muted-modern flex-wrap">
            <span>
              <i className="fas fa-users me-1"></i>
              {data.team.length} Pokémon
            </span>
            <span>
              <i className="fas fa-swords me-1"></i>
              {data.matchups.length} Matchup
              {data.matchups.length !== 1 ? "s" : ""}
            </span>
            {data.paste && (
              <div className="paste-link-container">
                <a
                  href={`https://pokebin.com/${data.paste}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-decoration-none"
                >
                  <i className="fas fa-external-link-alt me-1"></i>View Paste
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="btn-group-modern">
          <button onClick={handleQuickEdit} className="btn btn-primary-modern">
            <i className="fas fa-edit me-2"></i>Quick Edit
          </button>
          <button onClick={downloadJSON} className="btn btn-secondary-modern">
            <i className="fas fa-download me-2"></i>Download
          </button>
          {source === "local" && (
            <button
              onClick={handleCleanStorage}
              className="btn btn-outline-danger"
              title="Delete local document"
            >
              <i className="fas fa-trash me-2"></i>Delete
            </button>
          )}
        </div>
      </div>
      {source === "local" && (
        <div className="mt-3 p-3 border rounded">
          <div className="d-flex align-items-center text-success">
            <i className="fas fa-shield-alt me-2"></i>
            <strong>Stored Locally</strong>
          </div>
          <p className="text-muted-modern mb-0 mt-1">
            This document is saved in your browser's local storage.
          </p>
        </div>
      )}
    </div>
  );

  const viewerTabs = [
    {
      id: "matchups",
      label: "Matchups",
      icon: "fa-gamepad",
      disabled: data.matchups.length === 0,
    },
    { id: "team", label: "Team", icon: "fa-users", disabled: false },
  ];

  // The rest of the JSX is identical between the two original components, so it can be copied here.
  // I will copy the main return statement from StoredViewer.js and adapt it slightly.
  return (
    <div className="fade-in viewer-page-container">
      {/* Main Layout: Desktop */}
      <div className="d-none d-lg-block mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div className="form-tabs d-none d-lg-flex">
            <button
              className={`form-tab ${
                activeViewerTab === "matchups" ? "active" : ""
              }`}
              onClick={() => setActiveViewerTab("matchups")}
              disabled={data.matchups.length === 0}
            >
              <i className="fas fa-gamepad me-2"></i> Matchups
            </button>
            <button
              className={`form-tab ${
                activeViewerTab === "team" ? "active" : ""
              }`}
              onClick={() => setActiveViewerTab("team")}
            >
              <i className="fas fa-users me-2"></i> Team Analysis
            </button>
          </div>
          <div className="d-none d-lg-block mb-2">
            <TeamPreview
              pokemonImages={pokemonImages}
              loadingImages={loading}
              teamLength={data.team.length}
              data={data}
            />
          </div>
        </div>
        <div className="viewer-layout">
          {/* Main Content */}
          <div>
            {activeViewerTab === "matchups" && (
              <>
                {data.matchups.length > 0 && (
                  <div>
                    {data.matchups[selectedMatchup] && (
                      <div
                        className="matchup-content"
                        id={`matchup-${selectedMatchup}`}
                      >
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <h4 className="mb-0">
                            {data.matchups[selectedMatchup].title}
                          </h4>
                          {data.matchups[selectedMatchup].paste && (
                            <a
                              href={data.matchups[selectedMatchup].paste}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-secondary-modern btn-sm"
                            >
                              <i className="fas fa-external-link-alt me-2"></i>
                              Opponent Paste
                            </a>
                          )}
                        </div>

                        {data.matchups[selectedMatchup].gameplans.map(
                          (gameplan, gameplanIndex) => (
                            <div
                              key={gameplanIndex}
                              className="border rounded p-3 mb-3"
                            >
                              <h5 className="mb-3 mt-2">
                                <i className="fas fa-chess-pawn me-2"></i>
                                Gameplan {gameplanIndex + 1}
                              </h5>

                              <div className="my-3 border-top"></div>

                              <div className="mb-3">
                                <h6 className="mb-2">
                                  <i className="fas fa-users me-2"></i>
                                  Team Composition
                                </h6>
                                <div className="d-flex flex-wrap gap-2">
                                  {gameplan.composition.map(
                                    (comp, compIndex) =>
                                      comp.pokemon && (
                                        <span
                                          key={compIndex}
                                          className={`badge ${
                                            comp.role === "Lead"
                                              ? "bg-success"
                                              : "bg-primary"
                                          }`}
                                          style={{
                                            fontSize: "0.875rem",
                                            padding: "0.5rem",
                                          }}
                                        >
                                          {comp.pokemon} - {comp.role}
                                        </span>
                                      )
                                  )}
                                </div>
                              </div>

                              <div className="my-3 border-top"></div>

                              {gameplan.text && (
                                <div className="mb-3">
                                  <h6 className="mb-2">
                                    <i className="fas fa-scroll me-2"></i>
                                    Strategy
                                  </h6>
                                  <div className="border rounded p-3">
                                    <ReactQuill
                                      value={gameplan.text}
                                      readOnly
                                      theme="bubble"
                                      modules={{ toolbar: false }}
                                    />
                                  </div>
                                </div>
                              )}

                              {gameplan.replays &&
                                gameplan.replays.length > 0 && (
                                  <div>
                                    <h6 className="mb-2">
                                      <i className="fas fa-play me-2"></i>
                                      Replay Links
                                    </h6>
                                    <div className="d-flex flex-wrap gap-2">
                                      {gameplan.replays.map((replay, index) => (
                                        <a
                                          key={index}
                                          href={replay}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="btn btn-secondary-modern btn-sm"
                                        >
                                          <i className="fas fa-play me-1"></i>
                                          Replay {index + 1}
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            {activeViewerTab === "team" && (
              <div className="content-card-modern">
                {data.team[selectedPokemon] && (
                  <>
                    <div className="d-flex align-items-center mb-3">
                      {pokemonImages[selectedPokemon] && data.paste ? (
                        <ImageLoader
                          src={pokemonImages[selectedPokemon]}
                          alt={data.team[selectedPokemon].species}
                          className="me-3"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "contain",
                          }}
                          showSkeleton={true}
                        />
                      ) : (
                        <div className="me-3">
                          <i
                            className="fas fa-circle"
                            style={{ fontSize: "60px", color: "#ccc" }}
                          ></i>
                        </div>
                      )}
                      <div>
                        <h5 className="mb-1">
                          {data.team[selectedPokemon].species}
                        </h5>
                        <small className="text-muted-modern">
                          {(data.team[selectedPokemon].calcs[0]?.offensive
                            ?.length || 0) +
                            (data.team[selectedPokemon].calcs[0]?.defensive
                              ?.length || 0)}{" "}
                          calc
                          {(data.team[selectedPokemon].calcs[0]?.offensive
                            ?.length || 0) +
                            (data.team[selectedPokemon].calcs[0]?.defensive
                              ?.length || 0) !==
                          1
                            ? "s"
                            : ""}
                        </small>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <h6 className="text-success mb-2">
                          <i className="fas fa-khanda me-2"></i>
                          Offensive Calcs
                        </h6>
                        {data.team[selectedPokemon].calcs[0]?.offensive
                          ?.length > 0 ? (
                          <div className="row g-2">
                            {data.team[selectedPokemon].calcs[0].offensive.map(
                              (calc, calcIndex) => (
                                <div key={calcIndex} className="col-12">
                                  <pre className="calc-text mb-0">{calc}</pre>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <p className="text-muted-modern">
                            No offensive calcs.
                          </p>
                        )}
                      </div>
                      <div className="col-md-6">
                        <h6 className="text-primary mb-2">
                          <i className="fas fa-shield me-2"></i>
                          Defensive Calcs
                        </h6>
                        {data.team[selectedPokemon].calcs[0]?.defensive
                          ?.length > 0 ? (
                          <div className="row g-2">
                            {data.team[selectedPokemon].calcs[0].defensive.map(
                              (calc, calcIndex) => (
                                <div key={calcIndex} className="col-12">
                                  <pre className="calc-text mb-0">{calc}</pre>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <p className="text-muted-modern">
                            No defensive calcs.
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="matchups-sidebar">
              {activeViewerTab === "matchups" && data.matchups.length > 0 && (
                <>
                  <h5 className="mb-3">
                    <i className="fas fa-list me-2"></i>
                    Matchups Navigation
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
                </>
              )}
              {activeViewerTab === "team" && data.team.length > 0 && (
                <>
                  <h5 className="mb-3">
                    <i className="fas fa-users me-2"></i>
                    Team Navigation
                  </h5>
                  <div className="matchups-nav">
                    {data.team.map((pokemon, index) => (
                      <div
                        key={index}
                        className={`matchup-nav-item ${
                          selectedPokemon === index ? "active" : ""
                        }`}
                        onClick={() => setSelectedPokemon(index)}
                      >
                        <div className="d-flex align-items-center">
                          {pokemonImages[index] && data.paste ? (
                            <ImageLoader
                              src={pokemonImages[index]}
                              alt={pokemon.species}
                              className="me-2"
                              style={{
                                width: "20px",
                                height: "20px",
                                objectFit: "contain",
                                display: "inline-block",
                              }}
                              showSkeleton={true}
                            />
                          ) : (
                            <i className="fas fa-circle me-2"></i>
                          )}
                          {pokemon.species}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="d-block d-lg-none">
        <div className="mb-4">
          <TeamPreview
            pokemonImages={pokemonImages}
            loadingImages={loading}
            teamLength={data.team.length}
            data={data}
          />
        </div>
        {/* Matchups Tab Content */}
        {activeTab === "matchups" && data.matchups.length > 0 && (
          <div className="p-0-mobile">
            <div className="row g-2">
              {data.matchups.map((matchup, matchupIndex) => {
                const isExpanded = expandedMatchup === matchupIndex;

                return (
                  <div key={matchupIndex} className="col-12">
                    <div className="matchup-mobile-compact">
                      <div
                        className="matchup-mobile-compact-header"
                        onClick={() =>
                          setExpandedMatchup(isExpanded ? null : matchupIndex)
                        }
                      >
                        <div className="matchup-title-mobile">
                          <div className="matchup-title-text fw-bold">
                            {matchup.title}
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge bg-primary gameplan-badge-mobile">
                            {matchup.gameplans.length}
                          </span>
                          {matchup.paste && (
                            <a
                              href={matchup.paste}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-secondary-modern btn-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <i className="fas fa-external-link-alt"></i>
                            </a>
                          )}
                          <i
                            className={`fas fa-chevron-${
                              isExpanded ? "up" : "down"
                            }`}
                          ></i>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="matchup-mobile-compact-content">
                          {matchup.gameplans.map((gameplan, gameplanIndex) => (
                            <div
                              key={gameplanIndex}
                              className="gameplan-compact-section"
                            >
                              <div className="d-flex align-items-center justify-content-between">
                                <h6 className="mb-0 mt-2">
                                  <i className="fas fa-chess-pawn me-2"></i>
                                  Gameplan {gameplanIndex + 1}
                                </h6>
                                {gameplan.replays &&
                                  gameplan.replays.length > 0 && (
                                    <span className="badge bg-info mt-2">
                                      {gameplan.replays.length} replay
                                      {gameplan.replays.length !== 1 ? "s" : ""}
                                    </span>
                                  )}
                              </div>

                              <div className="my-3 border-top"></div>

                              <div className="mb-2">
                                <h6 className="mb-2">Composition</h6>
                                <div className="composition-grid">
                                  {gameplan.composition.map(
                                    (comp, compIndex) =>
                                      comp.pokemon && (
                                        <span
                                          key={compIndex}
                                          className={`badge ${
                                            comp.role === "Lead"
                                              ? "bg-success"
                                              : "bg-primary"
                                          }`}
                                          style={{ fontSize: "0.75rem" }}
                                        >
                                          {comp.pokemon} - {comp.role}
                                        </span>
                                      )
                                  )}
                                </div>
                              </div>

                              <div className="my-3 border-top"></div>

                              <div className="mt-3">
                                {gameplan.text && (
                                  <div className="mb-2">
                                    <h6 className="mb-2">Strategy</h6>
                                    <div className="border rounded p-2">
                                      <ReactQuill
                                        value={gameplan.text}
                                        readOnly
                                        theme="bubble"
                                        modules={{ toolbar: false }}
                                      />
                                    </div>
                                  </div>
                                )}

                                {gameplan.replays &&
                                  gameplan.replays.length > 0 && (
                                    <div>
                                      <h6 className="mb-2">Replays</h6>
                                      <div className="d-flex flex-wrap gap-1">
                                        {gameplan.replays.map(
                                          (replay, index) => (
                                            <a
                                              key={index}
                                              href={replay}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="btn btn-secondary-modern btn-sm"
                                            >
                                              <i className="fas fa-play me-1"></i>
                                              {index + 1}
                                            </a>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Team Tab Content */}
        {activeTab === "team" && (
          <div className="p-0-mobile">
            <div className="row g-3">
              {data.team.map((pokemon, index) => {
                const isExpanded = expandedPokemon === index;
                const hasOffensiveCalcs =
                  pokemon.calcs[0]?.offensive &&
                  pokemon.calcs[0].offensive.length > 0;
                const hasDefensiveCalcs =
                  pokemon.calcs[0]?.defensive &&
                  pokemon.calcs[0].defensive.length > 0;
                const hasAnyCalcs = hasOffensiveCalcs || hasDefensiveCalcs;

                return (
                  <div key={index} className="col-12">
                    <div className="border rounded p-2 pokemon-mobile-card">
                      <div
                        className="d-flex align-items-center justify-content-between"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setExpandedPokemon(isExpanded ? null : index)
                        }
                      >
                        <div className="d-flex align-items-center">
                          {pokemonImages[index] && data.paste ? (
                            <ImageLoader
                              src={pokemonImages[index]}
                              alt={pokemon.species}
                              className="me-3"
                              style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "contain",
                              }}
                              showSkeleton={true}
                            />
                          ) : (
                            <div className="me-3">
                              <i
                                className="fas fa-circle"
                                style={{ fontSize: "40px", color: "#ccc" }}
                              ></i>
                            </div>
                          )}
                          <div>
                            <h6 className="mb-0 fw-bold">{pokemon.species}</h6>
                            {hasAnyCalcs && (
                              <small className="text-muted-modern">
                                {(pokemon.calcs[0]?.offensive?.length || 0) +
                                  (pokemon.calcs[0]?.defensive?.length ||
                                    0)}{" "}
                                calc
                                {(pokemon.calcs[0]?.offensive?.length || 0) +
                                  (pokemon.calcs[0]?.defensive?.length || 0) !==
                                1
                                  ? "s"
                                  : ""}
                              </small>
                            )}
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          {!hasAnyCalcs && (
                            <i className="fas fa-times icon-cross-error me-2"></i>
                          )}
                          <i
                            className={`fas fa-chevron-${
                              isExpanded ? "up" : "down"
                            }`}
                          ></i>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-3 pt-3 border-top">
                          {hasOffensiveCalcs && (
                            <div className="mb-2">
                              <h6 className="text-success mb-2">
                                <i className="fas fa-khanda me-2"></i>
                                Offensive
                              </h6>
                              <div className="row g-2">
                                {pokemon.calcs[0].offensive.map(
                                  (calc, calcIndex) => (
                                    <div key={calcIndex} className="col-12">
                                      <pre
                                        className="calc-text mb-0"
                                        style={{ fontSize: "0.75rem" }}
                                      >
                                        {calc}
                                      </pre>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          {hasDefensiveCalcs && (
                            <div className="mb-2">
                              <h6 className="text-primary mb-2">
                                <i className="fas fa-shield me-2"></i>
                                Defensive
                              </h6>
                              <div className="row g-2">
                                {pokemon.calcs[0].defensive.map(
                                  (calc, calcIndex) => (
                                    <div key={calcIndex} className="col-12">
                                      <pre
                                        className="calc-text mb-0"
                                        style={{ fontSize: "0.75rem" }}
                                      >
                                        {calc}
                                      </pre>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          {!hasAnyCalcs && (
                            <div className="text-center py-3">
                              <i className="fas fa-calculator fa-lg text-muted mb-2"></i>
                              <p className="text-muted-modern mb-0 small">
                                No calcs for {pokemon.species}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {activeTab === "matchups" && data.matchups.length === 0 && (
          <div className="content-card-modern text-center py-5">
            <i className="fas fa-swords fa-3x text-muted mb-3"></i>
            <h6 className="text-muted-modern">No matchups in this document</h6>
            <p className="text-muted-modern mb-0">
              This document contains only team data
            </p>
          </div>
        )}
      </div>

      {/* Document Header (Mobile) */}
      <div className="mt-4">{renderDocumentHeader()}</div>
      <MobileNavigation
        tabs={viewerTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default DocumentViewer;
