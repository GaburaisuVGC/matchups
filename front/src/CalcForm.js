import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const CalcForm = ({ data, setData }) => {
  const [calcInput, setCalcInput] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(data.team[0]?.species || "");
  const [calcType, setCalcType] = useState("offensive");
  const [selectedPokemonTab, setSelectedPokemonTab] = useState(0);
  const [activeCalcTab, setActiveCalcTab] = useState("offensive");

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
  
  const selectedPokemonForTab = data.team[selectedPokemonTab];

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
              <option value="offensive">Offensive</option>
              <option value="defensive">Defensive</option>
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
      <div className="content-card-modern p-0-mobile">
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
          <>
            <div className="pokemon-tabs">
              {data.team.map((pokemon, index) => (
                <div
                  key={index}
                  className={`pokemon-tab ${selectedPokemonTab === index ? 'active' : ''}`}
                  onClick={() => setSelectedPokemonTab(index)}
                >
                  {pokemon.species}
                </div>
              ))}
            </div>
            
            {selectedPokemonForTab && (
              <div className="border rounded p-3">
                <div className="calc-tabs">
                  <div
                    className={`calc-tab ${activeCalcTab === 'offensive' ? 'active' : ''}`}
                    onClick={() => setActiveCalcTab('offensive')}
                  >
                    <i className="fas fa-sword me-2"></i>&nbsp;Offensive
                  </div>
                  <div
                    className={`calc-tab ${activeCalcTab === 'defensive' ? 'active' : ''}`}
                    onClick={() => setActiveCalcTab('defensive')}
                  >
                    <i className="fas fa-shield me-2"></i>&nbsp;Defensive
                  </div>
                </div>

                <div className="calc-content">
                  {activeCalcTab === 'offensive' && (
                    <div>
                      {selectedPokemonForTab.calcs[0]?.offensive?.length > 0 ? (
                        <div className="row g-2">
                          {selectedPokemonForTab.calcs[0].offensive.map((calc, calcIndex) => (
                            <div key={calcIndex} className="col-12">
                              <div className="input-group">
                                <textarea
                                  value={calc}
                                  onChange={(e) => handleCalcChange(selectedPokemonTab, calcIndex, "offensive", e.target.value)}
                                  rows="2"
                                  className="form-control form-control-modern"
                                  style={{ resize: "none" }}
                                />
                                <button
                                  onClick={() => handleCalcDelete(selectedPokemonTab, calcIndex, "offensive")}
                                  className="btn btn-outline-danger"
                                  title="Delete calculation"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-modern">No offensive calculations.</p>
                      )}
                    </div>
                  )}
                  {activeCalcTab === 'defensive' && (
                    <div>
                      {selectedPokemonForTab.calcs[0]?.defensive?.length > 0 ? (
                        <div className="row g-2">
                          {selectedPokemonForTab.calcs[0].defensive.map((calc, calcIndex) => (
                            <div key={calcIndex} className="col-12">
                              <div className="input-group">
                                <textarea
                                  value={calc}
                                  onChange={(e) => handleCalcChange(selectedPokemonTab, calcIndex, "defensive", e.target.value)}
                                  rows="2"
                                  className="form-control form-control-modern"
                                  style={{ resize: "none" }}
                                />
                                <button
                                  onClick={() => handleCalcDelete(selectedPokemonTab, calcIndex, "defensive")}
                                  className="btn btn-outline-danger"
                                  title="Delete calculation"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-modern">No defensive calculations.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
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