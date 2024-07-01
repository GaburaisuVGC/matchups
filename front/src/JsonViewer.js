import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./App.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

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
    try {
      const response = await fetch(
        `${BACK_URL}/parse-pokebin?pasteId=${pasteId}`
      );
      const images = await response.json();
      setPokemonImages(images);
    } catch (error) {
      setError("Failed to fetch Pokémon images");
    }
  };

  const downloadJSON = () => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleQuickEdit = () => {
    localStorage.setItem("matchupData", JSON.stringify(data));
    navigate("/");
  };

  const pageTitle = data && data.generalTitle ? data.generalTitle : "Matchups.net - View Data";

  if (error) {
    return (
      <div
        className={`container mt-5 ${isDarkMode ? "dark-mode" : "light-mode"}`}
      >
        <h1 className="text-center mb-4">{pageTitle}</h1>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div
        className={`container mt-5 ${isDarkMode ? "dark-mode" : "light-mode"}`}
      >
        <h1 className="text-center mb-4">{pageTitle}</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      className={`container mt-5 ${isDarkMode ? "dark-mode" : "light-mode"}`}
    >
      <h1 className="text-center mb-4">{pageTitle}</h1>
      <div
        className={`card mb-4 ${
          isDarkMode ? "card-dark-mode" : "card-light-mode"
        }`}
      >
        <div className="card-body d-flex justify-content-between">
          <h2>
            <a
              href={`https://pokebin.com/${data.paste}`}
              target="_blank"
              rel="noreferrer"
              className="text-primary text-decoration-none"
              style={{ fontFamily: "Poppins", fontWeight: "400" }}
            >
              View Paste
            </a>
          </h2>
          <div>
            <button onClick={handleQuickEdit} className="btn btn-secondary me-2">
              Quick Edit
            </button>
            <button onClick={downloadJSON} className="btn btn-secondary">
              Download JSON
            </button>
          </div>
        </div>
        {pokemonImages.length > 0 && (
          <div className="d-flex flex-wrap mt-4">
            {pokemonImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Pokémon ${index + 1}`}
                className="img-thumbnail ms-3"
                style={{ width: "100px", height: "100px" }}
              />
            ))}
          </div>
        )}
        <div className="list-group mt-5">
          {data.team.map((pokemon, index) => (
            <div key={index} className="list-group-item">
              <h3
                className="d-flex justify-content-between align-items-center"
                onClick={() =>
                  setExpandedPokemon(expandedPokemon === index ? null : index)
                }
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex align-items-center">
                  {pokemon.species}
                  {pokemonImages[index] && (
                    <img
                      src={pokemonImages[index]}
                      alt="Pokémon"
                      className="ms-2"
                      style={{
                        width: "50px",
                        height: "50px",
                        marginLeft: "10px",
                      }}
                    />
                  )}
                </div>
                <button className="btn btn-link">
                  {expandedPokemon === index ? (
                    <i className="fas fa-chevron-up"></i>
                  ) : (
                    <i className="fas fa-chevron-down"></i>
                  )}
                </button>
              </h3>
              {expandedPokemon === index && (
                <>
                  {pokemon.calcs[0]?.offensive &&
                    pokemon.calcs[0].offensive.length > 0 && (
                      <div>
                        <h5>Offensive Calcs</h5>
                        {pokemon.calcs[0].offensive.map((calc, calcIndex) => (
                          <pre key={calcIndex} className="calc-text">
                            {calc}
                          </pre>
                        ))}
                      </div>
                    )}
                  {pokemon.calcs[0]?.defensive &&
                    pokemon.calcs[0].defensive.length > 0 && (
                      <div>
                        <h5>Defensive Calcs</h5>
                        {pokemon.calcs[0].defensive.map((calc, calcIndex) => (
                          <pre key={calcIndex} className="calc-text">
                            {calc}
                          </pre>
                        ))}
                      </div>
                    )}
                  {(!pokemon.calcs[0]?.offensive ||
                    pokemon.calcs[0]?.offensive.length === 0) &&
                    (!pokemon.calcs[0]?.defensive ||
                      pokemon.calcs[0]?.defensive.length === 0) && (
                      <p>No Calcs</p>
                    )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <div
        className={`card mb-4 ${
          isDarkMode ? "card-dark-mode" : "card-light-mode"
        }`}
      >
        <div className="card-body">
          <h2>Matchups</h2>
          {data.matchups.map((matchup, matchupIndex) => (
            <div key={matchupIndex} className="mb-3 card p-3">
              <h3
                className="d-flex justify-content-between align-items-center"
                onClick={() =>
                  setExpandedMatchup(
                    expandedMatchup === matchupIndex ? null : matchupIndex
                  )
                }
                style={{ cursor: "pointer" }}
              >
                {matchup.title}
                <button className="btn btn-link">
                  {expandedMatchup === matchupIndex ? (
                    <i className="fas fa-chevron-up"></i>
                  ) : (
                    <i className="fas fa-chevron-down"></i>
                  )}
                </button>
              </h3>
              {expandedMatchup === matchupIndex && (
                <>
                  {matchup.paste && (
                    <h4>
                      Paste:{" "}
                      <a
                        className="text-primary text-decoration-none"
                        href={`${matchup.paste}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    </h4>
                  )}
                  {matchup.gameplans.map((gameplan, gameplanIndex) => (
                    <div key={gameplanIndex} className="mt-3">
                      <h5
                        className="d-flex justify-content-between align-items-center"
                        onClick={() =>
                          setExpandedGameplan({
                            ...expandedGameplan,
                            [matchupIndex]:
                              expandedGameplan[matchupIndex] === gameplanIndex
                                ? null
                                : gameplanIndex,
                          })
                        }
                        style={{ cursor: "pointer" }}
                      >
                        Gameplan {gameplanIndex + 1}
                        <button className="btn btn-link">
                          {expandedGameplan[matchupIndex] === gameplanIndex ? (
                            <i className="fas fa-chevron-up"></i>
                          ) : (
                            <i className="fas fa-chevron-down"></i>
                          )}
                        </button>
                      </h5>
                      {expandedGameplan[matchupIndex] === gameplanIndex && (
                        <>
                          <ReactQuill
                            value={gameplan.text}
                            readOnly
                            theme="bubble"
                          />
                          <h4>Composition</h4>
                          <div className="d-flex flex-wrap">
                            {gameplan.composition.map((comp, compIndex) => (
                              <div key={compIndex} className="mb-2 me-2">
                                <span
                                  className={`badge ${
                                    comp.role === "Lead"
                                      ? "bg-success"
                                      : "bg-warning"
                                  }`}
                                >
                                  {comp.pokemon} - {comp.role}
                                </span>
                              </div>
                            ))}
                          </div>
                          {gameplan.replays && gameplan.replays.length > 0 && (
                            <>
                              <h4>Replays</h4>
                              <div className="mb-2">
                                {gameplan.replays.map((replay, index) => (
                                  <a
                                    key={index}
                                    href={replay}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="d-block mb-1 text-primary text-decoration-none"
                                  >
                                    Replay {index + 1}
                                  </a>
                                ))}
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JsonViewer;
