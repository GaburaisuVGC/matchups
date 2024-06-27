import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const CalcForm = ({ data, setData }) => {
  const [calcInput, setCalcInput] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState("");
  const [calcType, setCalcType] = useState("offensive");
  const [expandedPokemon, setExpandedPokemon] = useState(null);

  const addCalc = () => {
    const updatedTeam = data.team.map((pokemon) => {
      if (pokemon.species === selectedPokemon) {
        const updatedCalcs = {
          ...pokemon.calcs[0],
          [calcType]: [...(pokemon.calcs[0]?.[calcType] || []), calcInput],
        };

        return {
          ...pokemon,
          calcs: [updatedCalcs],
        };
      }
      return pokemon;
    });

    setData((prevData) => ({
      ...prevData,
      team: updatedTeam,
    }));
    setCalcInput("");
  };

  const handleCalcChange = (pokemonIndex, calcIndex, type, value) => {
    const updatedTeam = [...data.team];
    updatedTeam[pokemonIndex].calcs[0][type][calcIndex] = value;
    setData((prevData) => ({
      ...prevData,
      team: updatedTeam,
    }));
  };

  const handleCalcDelete = (pokemonIndex, calcIndex, type) => {
    const updatedTeam = [...data.team];
    updatedTeam[pokemonIndex].calcs[0][type].splice(calcIndex, 1);
    setData((prevData) => ({
      ...prevData,
      team: updatedTeam,
    }));
  };

  const teamExists = data.team.length > 0;

  return (
    <div>
      <h2 className="text-center mb-3">Add Calc</h2>
      <div className="form-group">
        <select
          value={selectedPokemon}
          onChange={(e) => setSelectedPokemon(e.target.value)}
          className="form-control"
          disabled={!teamExists}
        >
          <option value="">Select Pokémon</option>
          {data.team.map((pokemon, index) => (
            <option key={index} value={pokemon.species}>
              {pokemon.species}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group mt-2">
        <select
          value={calcType}
          onChange={(e) => setCalcType(e.target.value)}
          className="form-control"
          disabled={!teamExists}
        >
          <option value="offensive">Offensive</option>
          <option value="defensive">Defensive</option>
        </select>
      </div>
      <div className="form-group mt-2">
        <textarea
          value={calcInput}
          onChange={(e) => setCalcInput(e.target.value)}
          rows="3"
          className="form-control"
          placeholder="Enter calc details"
          disabled={!teamExists}
        ></textarea>
      </div>
      <div className="d-flex justify-content-center">
        <button
          onClick={addCalc}
          className="btn btn-secondary mt-3"
          disabled={!teamExists}
        >
          Add Calc
        </button>
      </div>
      <div className="mt-3">
        {data.team.map((pokemon, pokemonIndex) => (
          <div key={pokemonIndex} className="mb-3 card p-3">
            <h3 className="d-flex justify-content-between align-items-center">
              {pokemon.species}
              <button
                className="btn btn-link"
                onClick={() =>
                  setExpandedPokemon(
                    expandedPokemon === pokemonIndex ? null : pokemonIndex
                  )
                }
              >
                {expandedPokemon === pokemonIndex ? (
                  <i className="fas fa-chevron-up"></i>
                ) : (
                  <i className="fas fa-chevron-down"></i>
                )}
              </button>
            </h3>
            {expandedPokemon === pokemonIndex && (
              <>
                {pokemon.calcs[0]?.offensive &&
                  pokemon.calcs[0].offensive.length > 0 && (
                    <div>
                      <h4>Offensive Calcs</h4>
                      {pokemon.calcs[0].offensive.map((calc, calcIndex) => (
                        <div key={calcIndex} className="mb-2">
                          <textarea
                            value={calc}
                            onChange={(e) =>
                              handleCalcChange(
                                pokemonIndex,
                                calcIndex,
                                "offensive",
                                e.target.value
                              )
                            }
                            rows="2"
                            className="form-control"
                            style={{ resize: "none", height: "auto" }}
                          ></textarea>
                          <button
                            onClick={() =>
                              handleCalcDelete(
                                pokemonIndex,
                                calcIndex,
                                "offensive"
                              )
                            }
                            className="btn btn-danger mt-1"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                {pokemon.calcs[0]?.defensive &&
                  pokemon.calcs[0].defensive.length > 0 && (
                    <div>
                      <h4>Defensive Calcs</h4>
                      {pokemon.calcs[0].defensive.map((calc, calcIndex) => (
                        <div key={calcIndex} className="mb-2">
                          <textarea
                            value={calc}
                            onChange={(e) =>
                              handleCalcChange(
                                pokemonIndex,
                                calcIndex,
                                "defensive",
                                e.target.value
                              )
                            }
                            rows="2"
                            className="form-control"
                            style={{ resize: "none", height: "auto" }}
                          ></textarea>
                          <button
                            onClick={() =>
                              handleCalcDelete(
                                pokemonIndex,
                                calcIndex,
                                "defensive"
                              )
                            }
                            className="btn btn-danger mt-1"
                          >
                            Delete
                          </button>
                        </div>
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
  );
};

export default CalcForm;
