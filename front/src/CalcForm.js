import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const CalcForm = ({ data, setData }) => {
  const [calcInput, setCalcInput] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState("");
  const [calcType, setCalcType] = useState("offensive");
  const [expandedPokemon, setExpandedPokemon] = useState(null);

  const addCalc = () => {
    if (!selectedPokemon || !calcInput.trim()) {
      return;
    }

    const updatedTeam = data.team.map((pokemon) => {
      if (pokemon.species === selectedPokemon) {
        const updatedCalcs = {
          ...pokemon.calcs[0],
          [calcType]: [...(pokemon.calcs[0]?.[calcType] || []), calcInput.trim()],
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
  const hasAnyCalcs = data.team.some(pokemon => 
    (pokemon.calcs[0]?.offensive && pokemon.calcs[0].offensive.length > 0) ||
    (pokemon.calcs[0]?.defensive && pokemon.calcs[0].defensive.length > 0)
  );

  return (
    <div>
      <h2 className="form-title-modern mb-4">
        <i className="fas fa-calculator me-2 text-accent-modern"></i>
        Damage Calculations
      </h2>

      {/* Add Calculation Form */}
      <div className="content-card-modern mb-4">
        <h5 className="mb-3">
          <i className="fas fa-plus me-2"></i>
          Add New Calculation
        </h5>
        
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label-modern">
              <i className="fas fa-user-circle me-2"></i>
              Select Pokémon
            </label>
            <select
              value={selectedPokemon}
              onChange={(e) => setSelectedPokemon(e.target.value)}
              className="form-control form-control-modern"
              disabled={!teamExists}
            >
              <option value="">Choose a Pokémon...</option>
              {data.team.map((pokemon, index) => (
                <option key={index} value={pokemon.species}>
                  {pokemon.species}
                </option>
              ))}
            </select>
          </div>
          
          <div className="col-md-3">
            <label className="form-label-modern">
              <i className="fas fa-crosshairs me-2"></i>
              Calculation Type
            </label>
            <select
              value={calcType}
              onChange={(e) => setCalcType(e.target.value)}
              className="form-control form-control-modern"
              disabled={!teamExists}
            >
              <option value="offensive">
                <i className="fas fa-sword"></i> Offensive
              </option>
              <option value="defensive">
                <i className="fas fa-shield"></i> Defensive
              </option>
            </select>
          </div>
          
          <div className="col-md-5">
            <label className="form-label-modern">
              <i className="fas fa-edit me-2"></i>
              Calculation Details
            </label>
            <div className="input-group">
              <textarea
                value={calcInput}
                onChange={(e) => setCalcInput(e.target.value)}
                rows="1"
                className="form-control form-control-modern"
                placeholder="Enter damage calculation..."
                disabled={!teamExists}
                style={{ resize: "none", minHeight: "38px" }}
              />
              <button
                onClick={addCalc}
                className="btn btn-primary-modern"
                disabled={!teamExists || !selectedPokemon || !calcInput.trim()}
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>

        {!teamExists && (
          <div className="alert alert-info mt-3 mb-0" role="alert">
            <i className="fas fa-info-circle me-2"></i>
            Please submit a team first to add calculations.
          </div>
        )}
      </div>

      {/* Calculations Display */}
      <div className="content-card-modern">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="mb-0">
            <i className="fas fa-list me-2"></i>
            Team Calculations
          </h5>
          {hasAnyCalcs && (
            <span className="badge bg-success">
              {data.team.reduce((total, pokemon) => 
                total + (pokemon.calcs[0]?.offensive?.length || 0) + (pokemon.calcs[0]?.defensive?.length || 0), 0
              )} total
            </span>
          )}
        </div>

        {teamExists ? (
          <div className="row g-3">
            {data.team.map((pokemon, pokemonIndex) => {
              const hasOffensiveCalcs = pokemon.calcs[0]?.offensive && pokemon.calcs[0].offensive.length > 0;
              const hasDefensiveCalcs = pokemon.calcs[0]?.defensive && pokemon.calcs[0].defensive.length > 0;
              const hasAnyCalcsForPokemon = hasOffensiveCalcs || hasDefensiveCalcs;
              const isExpanded = expandedPokemon === pokemonIndex;

              return (
                <div key={pokemonIndex} className="col-12">
                  <div className="border rounded p-3">
                    <div 
                      className="d-flex align-items-center justify-content-between"
                      style={{ cursor: "pointer" }}
                      onClick={() => setExpandedPokemon(isExpanded ? null : pokemonIndex)}
                    >
                      <div className="d-flex align-items-center">
                        <h6 className="mb-0 fw-bold">{pokemon.species}</h6>
                        {hasAnyCalcsForPokemon && (
                          <span className="badge bg-primary ms-2">
                            {(pokemon.calcs[0]?.offensive?.length || 0) + (pokemon.calcs[0]?.defensive?.length || 0)} calcs
                          </span>
                        )}
                      </div>
                      <div className="d-flex align-items-center">
                        {!hasAnyCalcsForPokemon && (
                          <span className="text-muted-modern me-2">No calculations</span>
                        )}
                        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                      </div>
                    </div>

                    {isExpanded && hasAnyCalcsForPokemon && (
                      <div className="mt-3">
                        {/* Offensive Calculations */}
                        {hasOffensiveCalcs && (
                          <div className="mb-3">
                            <h6 className="text-success mb-2">
                              <i className="fas fa-sword me-2"></i>
                              Offensive Calculations
                            </h6>
                            <div className="row g-2">
                              {pokemon.calcs[0].offensive.map((calc, calcIndex) => (
                                <div key={calcIndex} className="col-12">
                                  <div className="input-group">
                                    <textarea
                                      value={calc}
                                      onChange={(e) =>
                                        handleCalcChange(pokemonIndex, calcIndex, "offensive", e.target.value)
                                      }
                                      rows="2"
                                      className="form-control form-control-modern"
                                      style={{ resize: "none" }}
                                    />
                                    <button
                                      onClick={() => handleCalcDelete(pokemonIndex, calcIndex, "offensive")}
                                      className="btn btn-outline-danger"
                                      title="Delete calculation"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Defensive Calculations */}
                        {hasDefensiveCalcs && (
                          <div>
                            <h6 className="text-primary mb-2">
                              <i className="fas fa-shield me-2"></i>
                              Defensive Calculations
                            </h6>
                            <div className="row g-2">
                              {pokemon.calcs[0].defensive.map((calc, calcIndex) => (
                                <div key={calcIndex} className="col-12">
                                  <div className="input-group">
                                    <textarea
                                      value={calc}
                                      onChange={(e) =>
                                        handleCalcChange(pokemonIndex, calcIndex, "defensive", e.target.value)
                                      }
                                      rows="2"
                                      className="form-control form-control-modern"
                                      style={{ resize: "none" }}
                                    />
                                    <button
                                      onClick={() => handleCalcDelete(pokemonIndex, calcIndex, "defensive")}
                                      className="btn btn-outline-danger"
                                      title="Delete calculation"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {isExpanded && !hasAnyCalcsForPokemon && (
                      <div className="mt-3 text-center py-4">
                        <i className="fas fa-calculator fa-2x text-muted mb-2"></i>
                        <p className="text-muted-modern mb-0">No calculations yet for {pokemon.species}</p>
                        <small className="text-muted-modern">Add one using the form above</small>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-5">
            <i className="fas fa-users fa-3x text-muted mb-3"></i>
            <h6 className="text-muted-modern">No team submitted yet</h6>
            <p className="text-muted-modern mb-0">Submit your team first to start adding calculations</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalcForm;