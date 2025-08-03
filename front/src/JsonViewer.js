import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./App.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ImageLoader from "./ImageLoader";

const JsonViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedPokemon, setExpandedPokemon] = useState(null);
  const [expandedMatchup, setExpandedMatchup] = useState(null);
  const [expandedGameplan, setExpandedGameplan] = useState({});
  const [pokemonImages, setPokemonImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [selectedMatchup, setSelectedMatchup] = useState(0);
  const [activeTab, setActiveTab] = useState("matchups");
  const [selectedPokemon, setSelectedPokemon] = useState(0);
  const BACK_URL = process.env.REACT_APP_BACK_URL;

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkMode);
  }, []);

  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "light-mode";
  }, [isDarkMode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACK_URL}/decode?id=${id}`);
        if (!response.ok) {
          throw new Error("Data not found");
        }
        const result = await response.json();
        setData(result);

        const initialExpandedGameplan = {};
        result.matchups.forEach((_, index) => {
          if (result.matchups[index].gameplans.length > 0) {
            initialExpandedGameplan[index] = 0;
          }
        });
        setExpandedGameplan(initialExpandedGameplan);

        await fetchPokemonImages(result.paste);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, [id]);

  const fetchPokemonImages = async (pasteId) => {
    if (!pasteId) return;
    
    setLoadingImages(true);
    try {
      const response = await fetch(
        `${BACK_URL}/parse-pokebin?pasteId=${pasteId}`
      );
      const images = await response.json();
      setPokemonImages(images);
    } catch (error) {
      console.error("Failed to fetch Pokémon images");
      setPokemonImages([]);
    } finally {
      setLoadingImages(false);
    }
  };

  const downloadJSON = () => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.generalTitle || "matchup-data"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleQuickEdit = () => {
    localStorage.setItem("matchupData", JSON.stringify(data));
    navigate("/");
  };

  const scrollToMatchup = (index) => {
    setSelectedMatchup(index);
    const element = document.getElementById(`matchup-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const pageTitle = data && data.generalTitle ? data.generalTitle : "Matchups.net - View Data";

  if (error) {
    return (
      <div className="fade-in">
        <div className="text-center mb-5">
          <div className="content-card-modern">
            <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <h1 className="h3 mb-3">Document Not Found</h1>
            <p className="text-muted-modern mb-4">
              The document you're looking for doesn't exist or has been removed.
            </p>
            <button 
              onClick={() => navigate("/")} 
              className="btn btn-primary-modern"
            >
              <i className="fas fa-home me-2"></i>
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
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
            <p className="text-muted-modern mb-0">Please wait while we fetch your data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Document Header */}
      <div className="content-card-modern mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div className="flex-grow-1">
            <h1 className="h3 mb-2">{pageTitle}</h1>
            <div className="d-flex align-items-center gap-3 text-muted-modern flex-wrap">
              <span>
                <i className="fas fa-users me-1"></i>
                {data.team.length} Pokémon
              </span>
              <span>
                <i className="fas fa-swords me-1"></i>
                {data.matchups.length} Matchup{data.matchups.length !== 1 ? 's' : ''}
              </span>
              {data.paste && (
                <div className="paste-link-container">
                  <a
                    href={`https://pokebin.com/${data.paste}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-decoration-none"
                  >
                    <i className="fas fa-external-link-alt me-1"></i>
                    View Paste
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="btn-group-modern">
            <button 
              onClick={handleQuickEdit} 
              className="btn btn-secondary-modern"
            >
              <i className="fas fa-edit me-2"></i>
              <span className="d-none d-sm-inline">Quick Edit</span>
              <span className="d-sm-none">Edit</span>
            </button>
            <button 
              onClick={downloadJSON} 
              className="btn btn-secondary-modern"
            >
              <i className="fas fa-download me-2"></i>
              <span className="d-none d-sm-inline">Download</span>
              <span className="d-sm-none">JSON</span>
            </button>
          </div>
        </div>

        {/* Team Preview Images */}
        {(pokemonImages.length > 0 || loadingImages) && (
          <div className="mt-4 pt-3 border-top">
            <h5 className="mb-3">
              <i className="fas fa-images me-2"></i>
              Team Preview
            </h5>
            <div className="row g-3">
              {loadingImages ? (
                Array.from({ length: data.team.length }).map((_, index) => (
                  <div key={index} className="col-6 col-md-4 col-lg-2">
                    <div className="text-center">
                      <ImageLoader
                        src=""
                        alt=""
                        className="border-0"
                        style={{ width: "80px", height: "80px" }}
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
      </div>

      {/* Mobile Tabs */}
      <div className="d-block d-lg-none mb-4">
        <div className="viewer-tabs">
          <span
            className={`viewer-tab ${activeTab === "matchups" ? "active" : ""}`}
            onClick={() => setActiveTab("matchups")}
          >
            <i className="fas fa-swords me-2"></i>
            Matchups ({data.matchups.length})
          </span>
          <span
            className={`viewer-tab ${activeTab === "team" ? "active" : ""}`}
            onClick={() => setActiveTab("team")}
          >
            <i className="fas fa-users me-2"></i>
            Team ({data.team.length})
          </span>
        </div>
      </div>

      {/* Main Layout: Desktop */}
      <div className="d-none d-lg-block">
        <div className="viewer-layout">
          {/* Main Content */}
          <div>
            {/* Matchups Section - Priority */}
            {data.matchups.length > 0 && (
              <div className="content-card-modern mb-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h3 className="h4 mb-0">
                    <i className="fas fa-swords me-2 text-accent-modern"></i>
                    Matchup Details
                  </h3>
                  <span className="badge bg-success">
                    Viewing: {data.matchups[selectedMatchup]?.title}
                  </span>
                </div>

                {data.matchups[selectedMatchup] && (
                  <div className="matchup-content" id={`matchup-${selectedMatchup}`}>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h4 className="mb-0">{data.matchups[selectedMatchup].title}</h4>
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

                    {data.matchups[selectedMatchup].gameplans.map((gameplan, gameplanIndex) => (
                      <div key={gameplanIndex} className="border rounded p-3 mb-3">
                        <h5 className="mb-3">
                          <i className="fas fa-chess-pawn me-2"></i>
                          Gameplan {gameplanIndex + 1}
                        </h5>

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

                        <div className="mb-3">
                          <h6 className="mb-2">
                            <i className="fas fa-users me-2"></i>
                            Team Composition
                          </h6>
                          <div className="d-flex flex-wrap gap-2">
                            {gameplan.composition.map((comp, compIndex) => (
                              comp.pokemon && (
                                <span
                                  key={compIndex}
                                  className={`badge ${
                                    comp.role === "Lead"
                                      ? "bg-success"
                                      : "bg-warning"
                                  }`}
                                  style={{ fontSize: "0.875rem", padding: "0.5rem" }}
                                >
                                  {comp.pokemon} - {comp.role}
                                </span>
                              )
                            ))}
                          </div>
                        </div>

                        {gameplan.replays && gameplan.replays.length > 0 && (
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
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Team Section with Tabs */}
            <div className="content-card-modern">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h3 className="h4 mb-0">
                  <i className="fas fa-users me-2 text-accent-modern"></i>
                  Team Analysis
                </h3>
                <span className="badge bg-primary">
                  {data.team.length} Pokémon
                </span>
              </div>

              {/* Pokemon Tabs */}
              {data.team.length > 0 && (
                <>
                  <div className="pokemon-tabs">
                    {data.team.map((pokemon, index) => (
                      <div
                        key={index}
                        className={`pokemon-tab ${selectedPokemon === index ? 'active' : ''}`}
                        onClick={() => setSelectedPokemon(index)}
                      >
                        {pokemonImages[index] ? (
                          <ImageLoader
                            src={pokemonImages[index]}
                            alt={pokemon.species}
                            className="me-2"
                            style={{
                              width: "20px",
                              height: "20px",
                              objectFit: "contain",
                              display: "inline-block"
                            }}
                          />
                        ) : (
                          <i className="fas fa-circle me-2"></i>
                        )}
                        {pokemon.species}
                      </div>
                    ))}
                  </div>

                  {/* Selected Pokemon Details */}
                  {data.team[selectedPokemon] && (
                    <div className="border rounded p-3">
                      <div className="d-flex align-items-center mb-3">
                        {pokemonImages[selectedPokemon] ? (
                          <ImageLoader
                            src={pokemonImages[selectedPokemon]}
                            alt={data.team[selectedPokemon].species}
                            className="me-3"
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "contain"
                            }}
                          />
                        ) : (
                          <div className="me-3">
                            <ImageLoader
                              src=""
                              alt=""
                              style={{ width: "60px", height: "60px" }}
                              showSkeleton={!loadingImages}
                            />
                          </div>
                        )}
                        <div>
                          <h5 className="mb-1">{data.team[selectedPokemon].species}</h5>
                          <small className="text-muted-modern">
                            {((data.team[selectedPokemon].calcs[0]?.offensive?.length || 0) + 
                             (data.team[selectedPokemon].calcs[0]?.defensive?.length || 0))} calculation{
                               ((data.team[selectedPokemon].calcs[0]?.offensive?.length || 0) + 
                                (data.team[selectedPokemon].calcs[0]?.defensive?.length || 0)) !== 1 ? 's' : ''}
                          </small>
                        </div>
                      </div>

                      {/* Calculations */}
                      {data.team[selectedPokemon].calcs[0]?.offensive && 
                       data.team[selectedPokemon].calcs[0].offensive.length > 0 && (
                        <div className="mb-3">
                          <h6 className="text-success mb-2">
                            <i className="fas fa-sword me-2"></i>
                            Offensive Calculations
                          </h6>
                          <div className="row g-2">
                            {data.team[selectedPokemon].calcs[0].offensive.map((calc, calcIndex) => (
                              <div key={calcIndex} className="col-12">
                                <pre className="calc-text mb-0">{calc}</pre>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {data.team[selectedPokemon].calcs[0]?.defensive && 
                       data.team[selectedPokemon].calcs[0].defensive.length > 0 && (
                        <div className="mb-3">
                          <h6 className="text-primary mb-2">
                            <i className="fas fa-shield me-2"></i>
                            Defensive Calculations
                          </h6>
                          <div className="row g-2">
                            {data.team[selectedPokemon].calcs[0].defensive.map((calc, calcIndex) => (
                              <div key={calcIndex} className="col-12">
                                <pre className="calc-text mb-0">{calc}</pre>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(!data.team[selectedPokemon].calcs[0]?.offensive || 
                        data.team[selectedPokemon].calcs[0].offensive.length === 0) &&
                       (!data.team[selectedPokemon].calcs[0]?.defensive || 
                        data.team[selectedPokemon].calcs[0].defensive.length === 0) && (
                        <div className="text-center py-4">
                          <i className="fas fa-calculator fa-2x text-muted mb-2"></i>
                          <p className="text-muted-modern mb-0">
                            No calculations available for {data.team[selectedPokemon].species}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Sidebar - Matchups Navigation */}
          <div>
            {data.matchups.length > 0 && (
              <div className="matchups-sidebar">
                <h5 className="mb-3">
                  <i className="fas fa-list me-2"></i>
                  Matchups Navigation
                </h5>
                
                <div className="matchups-nav">
                  {data.matchups.map((matchup, index) => (
                    <div
                      key={index}
                      className={`matchup-nav-item ${selectedMatchup === index ? 'active' : ''}`}
                      onClick={() => scrollToMatchup(index)}
                    >
                      <div className="flex-grow-1">
                        <div className="fw-medium" style={{ fontSize: "0.875rem" }}>
                          {matchup.title}
                        </div>
                        <small className="text-muted">
                          {matchup.gameplans.length} gameplan{matchup.gameplans.length !== 1 ? 's' : ''}
                        </small>
                      </div>
                      <span className="matchup-nav-badge">
                        {matchup.gameplans.length}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-top">
                  <small className="text-muted-modern">
                    <i className="fas fa-info-circle me-1"></i>
                    Click on a matchup to view details
                  </small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="d-block d-lg-none">
        {/* Matchups Tab Content */}
        {activeTab === "matchups" && data.matchups.length > 0 && (
          <div className="content-card-modern">
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
                          <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="matchup-mobile-compact-content">
                          {matchup.gameplans.map((gameplan, gameplanIndex) => {
                            const isGameplanExpanded = expandedGameplan[matchupIndex] === gameplanIndex;

                            return (
                              <div key={gameplanIndex} className="gameplan-compact">
                                <div
                                  className="d-flex align-items-center justify-content-between"
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    setExpandedGameplan({
                                      ...expandedGameplan,
                                      [matchupIndex]:
                                        isGameplanExpanded ? null : gameplanIndex,
                                    })
                                  }
                                >
                                  <h6 className="mb-0">
                                    <i className="fas fa-chess-pawn me-2"></i>
                                    Gameplan {gameplanIndex + 1}
                                  </h6>
                                  <div className="d-flex align-items-center">
                                    {gameplan.replays && gameplan.replays.length > 0 && (
                                      <span className="badge bg-info me-2">
                                        {gameplan.replays.length}
                                      </span>
                                    )}
                                    <i className={`fas fa-chevron-${isGameplanExpanded ? 'up' : 'down'}`}></i>
                                  </div>
                                </div>

                                {isGameplanExpanded && (
                                  <div className="mt-3">
                                    {gameplan.text && (
                                      <div className="mb-3">
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

                                    <div className="mb-3">
                                      <h6 className="mb-2">Composition</h6>
                                      <div className="d-flex flex-wrap gap-1">
                                        {gameplan.composition.map((comp, compIndex) => (
                                          comp.pokemon && (
                                            <span
                                              key={compIndex}
                                              className={`badge ${
                                                comp.role === "Lead"
                                                  ? "bg-success"
                                                  : "bg-warning"
                                              }`}
                                              style={{ fontSize: "0.75rem" }}
                                            >
                                              {comp.pokemon}
                                            </span>
                                          )
                                        ))}
                                      </div>
                                    </div>

                                    {gameplan.replays && gameplan.replays.length > 0 && (
                                      <div>
                                        <h6 className="mb-2">Replays</h6>
                                        <div className="d-flex flex-wrap gap-1">
                                          {gameplan.replays.map((replay, index) => (
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
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
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
          <div className="content-card-modern">
            <div className="row g-3">
              {data.team.map((pokemon, index) => {
                const isExpanded = expandedPokemon === index;
                const hasOffensiveCalcs = pokemon.calcs[0]?.offensive && pokemon.calcs[0].offensive.length > 0;
                const hasDefensiveCalcs = pokemon.calcs[0]?.defensive && pokemon.calcs[0].defensive.length > 0;
                const hasAnyCalcs = hasOffensiveCalcs || hasDefensiveCalcs;

                return (
                  <div key={index} className="col-12">
                    <div className="border rounded p-3">
                      <div
                        className="d-flex align-items-center justify-content-between"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setExpandedPokemon(isExpanded ? null : index)
                        }
                      >
                        <div className="d-flex align-items-center">
                          {pokemonImages[index] ? (
                            <ImageLoader
                              src={pokemonImages[index]}
                              alt={pokemon.species}
                              className="me-3"
                              style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "contain"
                              }}
                            />
                          ) : (
                            <div className="me-3">
                              <ImageLoader
                                src=""
                                alt=""
                                style={{ width: "40px", height: "40px" }}
                                showSkeleton={!loadingImages}
                              />
                            </div>
                          )}
                          <div>
                            <h6 className="mb-0 fw-bold">{pokemon.species}</h6>
                            {hasAnyCalcs && (
                              <small className="text-muted-modern">
                                {(pokemon.calcs[0]?.offensive?.length || 0) + (pokemon.calcs[0]?.defensive?.length || 0)} calc{((pokemon.calcs[0]?.offensive?.length || 0) + (pokemon.calcs[0]?.defensive?.length || 0)) !== 1 ? 's' : ''}
                              </small>
                            )}
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          {!hasAnyCalcs && (
                            <i className="fas fa-times icon-cross-error me-2"></i>
                          )}
                          <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-3 pt-3 border-top">
                          {hasOffensiveCalcs && (
                            <div className="mb-3">
                              <h6 className="text-success mb-2">
                                <i className="fas fa-sword me-2"></i>
                                Offensive
                              </h6>
                              <div className="row g-2">
                                {pokemon.calcs[0].offensive.map((calc, calcIndex) => (
                                  <div key={calcIndex} className="col-12">
                                    <pre className="calc-text mb-0" style={{ fontSize: "0.75rem" }}>{calc}</pre>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {hasDefensiveCalcs && (
                            <div className="mb-3">
                              <h6 className="text-primary mb-2">
                                <i className="fas fa-shield me-2"></i>
                                Defensive
                              </h6>
                              <div className="row g-2">
                                {pokemon.calcs[0].defensive.map((calc, calcIndex) => (
                                  <div key={calcIndex} className="col-12">
                                    <pre className="calc-text mb-0" style={{ fontSize: "0.75rem" }}>{calc}</pre>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {!hasAnyCalcs && (
                            <div className="text-center py-3">
                              <i className="fas fa-calculator fa-lg text-muted mb-2"></i>
                              <p className="text-muted-modern mb-0 small">No calculations for {pokemon.species}</p>
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
            <p className="text-muted-modern mb-0">This document contains only team data</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonViewer;