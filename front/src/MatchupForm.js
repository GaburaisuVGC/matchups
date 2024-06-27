import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const MatchupForm = ({ data, setData }) => {
  const [matchupTitle, setMatchupTitle] = useState("");
  const [matchupPaste, setMatchupPaste] = useState("");
  const [expandedMatchup, setExpandedMatchup] = useState(null);
  const [expandedGameplan, setExpandedGameplan] = useState({});

  const initialComposition = [
    { pokemon: "", role: "Lead" },
    { pokemon: "", role: "Lead" },
    { pokemon: "", role: "Back" },
    { pokemon: "", role: "Back" },
  ];

  const MAX_LENGTH = 1000;

  useEffect(() => {
    data.matchups.forEach((_, index) => {
      if (
        expandedGameplan[index] === undefined &&
        data.matchups[index].gameplans.length > 0
      ) {
        setExpandedGameplan((prev) => ({ ...prev, [index]: 0 }));
      }
    });
// eslint-disable-next-line
  }, [data.matchups]);

  const addMatchup = () => {
    if (data.team.length === 0) {
      alert("Please submit a team before adding matchups.");
      return;
    }

    const newMatchup = {
      title: matchupTitle,
      paste: matchupPaste,
      gameplans: [
        {
          text: "",
          composition: initialComposition,
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
      composition: initialComposition,
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

  return (
    <div>
      <h2 className="text-center mb-3">Add Matchup</h2>
      <div className="form-group">
        <input
          type="text"
          value={matchupTitle}
          onChange={(e) => setMatchupTitle(e.target.value)}
          className="form-control"
          placeholder="Enter matchup title"
          disabled={data.team.length === 0}
        />
      </div>
      <div className="form-group mt-2">
        <input
          type="text"
          value={matchupPaste}
          onChange={(e) => setMatchupPaste(e.target.value)}
          className="form-control"
          placeholder="Enter paste link (optional)"
          disabled={data.team.length === 0}
        />
      </div>
      <div className="d-flex justify-content-center">
        <button
          onClick={addMatchup}
          className="btn btn-secondary mt-3"
          disabled={data.team.length === 0}
        >
          Add Matchup
        </button>
      </div>
      <div className="mt-3">
        {data.matchups.map((matchup, matchupIndex) => (
          <div key={matchupIndex} className="mb-3 card p-3">
            <h3 className="d-flex justify-content-between align-items-center">
              {matchup.title}
              <button
                className="btn btn-link"
                onClick={() =>
                  setExpandedMatchup(
                    expandedMatchup === matchupIndex ? null : matchupIndex
                  )
                }
              >
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
                <button
                  onClick={() => removeMatchup(matchupIndex)}
                  className="btn btn-danger mt-2"
                >
                  Remove Matchup
                </button>
                {matchup.gameplans.map((gameplan, gameplanIndex) => (
                  <div key={gameplanIndex} className="mt-3">
                    <h5 className="d-flex justify-content-between align-items-center">
                      Gameplan {gameplanIndex + 1}
                      <button
                        className="btn btn-link"
                        onClick={() =>
                          setExpandedGameplan({
                            ...expandedGameplan,
                            [matchupIndex]:
                              expandedGameplan[matchupIndex] === gameplanIndex
                                ? null
                                : gameplanIndex,
                          })
                        }
                      >
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
                          onChange={(value) =>
                            handleGameplanChange(
                              matchupIndex,
                              gameplanIndex,
                              value
                            )
                          }
                          theme="snow"
                        />
                        <div>
                          {getPlainText(gameplan.text).length}/{MAX_LENGTH}{" "}
                          characters
                        </div>
                        <h4>Composition</h4>
                        {gameplan.composition.map((comp, compIndex) => (
                          <div key={compIndex} className="mb-2">
                            <select
                              value={comp.pokemon}
                              onChange={(e) =>
                                handleCompositionChange(
                                  matchupIndex,
                                  gameplanIndex,
                                  compIndex,
                                  "pokemon",
                                  e.target.value
                                )
                              }
                              className="compo-form form-control-inline"
                            >
                              <option value="">Select Pokémon</option>
                              {data.team.map((pokemon, i) => (
                                <option key={i} value={pokemon.species}>
                                  {pokemon.species}
                                </option>
                              ))}
                            </select>
                            <select
                              value={comp.role}
                              onChange={(e) =>
                                handleCompositionChange(
                                  matchupIndex,
                                  gameplanIndex,
                                  compIndex,
                                  "role",
                                  e.target.value
                                )
                              }
                              className={`compo-form form-control-inline ${
                                comp.role === "Lead"
                                  ? "lead-select"
                                  : "back-select"
                              }`}
                            >
                              <option value="Lead">Lead</option>
                              <option value="Back">Back</option>
                            </select>
                          </div>
                        ))}
                        <button
                          onClick={() =>
                            removeGameplan(matchupIndex, gameplanIndex)
                          }
                          className="btn btn-danger mt-2"
                        >
                          Remove Gameplan
                        </button>
                      </>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addGameplan(matchupIndex)}
                  className="btn btn-secondary mt-3"
                >
                  Add Gameplan
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchupForm;
