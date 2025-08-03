import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AddCalcForm from "./AddCalcForm";

const CalcForm = ({ data, setData, selectedPokemonIndex }) => {
  // State for mobile accordion
  const [expandedPokemon, setExpandedPokemon] = useState(0);

  const handleCalcChange = (pokemonIndex, calcIndex, type, value) => {
    const updatedTeam = [...data.team];
    updatedTeam[pokemonIndex].calcs[0][type][calcIndex] = value;
    setData((prevData) => ({ ...prevData, team: updatedTeam }));
  };

  const handleCalcDelete = (pokemonIndex, calcIndex, type) => {
    const updatedTeam = [...data.team];
    updatedTeam[pokemonIndex].calcs[0][type].splice(calcIndex, 1);
    setData((prevData) => ({ ...prevData, team: updatedTeam }));
  };

  const toggleExpand = (index) => {
    setExpandedPokemon(expandedPokemon === index ? null : index);
  };

  const teamExists = data.team.length > 0;
  const selectedPokemonForDesktop = data.team[selectedPokemonIndex];

  return (
    <>
      {/* Mobile View: Accordion */}
      <div className="d-lg-none">
        <AddCalcForm data={data} setData={setData} />
        <div className="accordion" id="calcAccordionMobile">
          {teamExists ? (
            data.team.map((pokemon, index) => {
              const isExpanded = expandedPokemon === index;
              const hasOffensiveCalcs = pokemon.calcs[0]?.offensive?.length > 0;
              const hasDefensiveCalcs = pokemon.calcs[0]?.defensive?.length > 0;
              const totalCalcs = (pokemon.calcs[0]?.offensive?.length || 0) + (pokemon.calcs[0]?.defensive?.length || 0);

              return (
                <div key={index} className="accordion-item-modern">
                  <h2 className="accordion-header-modern mb-0" onClick={() => toggleExpand(index)}>
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <span className="fw-medium">{pokemon.species}</span>
                      <div className="d-flex align-items-center">
                        <span className="badge bg-primary me-3">{totalCalcs} calc{totalCalcs !== 1 ? 's' : ''}</span>
                        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                      </div>
                    </div>
                  </h2>
                  {isExpanded && (
                    <div className="accordion-body-modern">
                      {/* Offensive Calcs */}
                      <h6 className="text-success mb-2"><i className="fas fa-khanda me-2"></i>Offensive</h6>
                      {hasOffensiveCalcs ? (
                        <div className="row g-2 mb-3">
                          {pokemon.calcs[0].offensive.map((calc, calcIndex) => (
                            <div key={calcIndex} className="col-12">
                              <div className="input-group">
                                <textarea value={calc} onChange={(e) => handleCalcChange(index, calcIndex, "offensive", e.target.value)} rows="2" className="form-control form-control-modern" style={{ resize: "none" }} />
                                <button onClick={() => handleCalcDelete(index, calcIndex, "offensive")} className="btn btn-outline-danger" title="Delete calc"><i className="fas fa-trash"></i></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : <p className="text-muted-modern small mb-3">No offensive calcs.</p>}
                      {/* Defensive Calcs */}
                      <h6 className="text-primary mb-2"><i className="fas fa-shield me-2"></i>Defensive</h6>
                      {hasDefensiveCalcs ? (
                        <div className="row g-2">
                          {pokemon.calcs[0].defensive.map((calc, calcIndex) => (
                            <div key={calcIndex} className="col-12">
                              <div className="input-group">
                                <textarea value={calc} onChange={(e) => handleCalcChange(index, calcIndex, "defensive", e.target.value)} rows="2" className="form-control form-control-modern" style={{ resize: "none" }} />
                                <button onClick={() => handleCalcDelete(index, calcIndex, "defensive")} className="btn btn-outline-danger" title="Delete calc"><i className="fas fa-trash"></i></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : <p className="text-muted-modern small">No defensive calcs.</p>}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-users fa-3x text-muted mb-3"></i>
              <h6 className="text-muted-modern">No team submitted yet</h6>
            </div>
          )}
        </div>
      </div>

      {/* Desktop View: Editing Area */}
      <div className="d-none d-lg-block">
        {teamExists && selectedPokemonForDesktop ? (
          <div className="form-section-modern p-3 p-lg-4">
            <h2 className="form-title-modern mb-4">
              <i className="fas fa-edit me-2 text-accent-modern"></i>
              Editing Calcs for {selectedPokemonForDesktop.species}
            </h2>
            <div className="row">
              <div className="col-md-6">
                <h6 className="text-success mb-2"><i className="fas fa-khanda me-2"></i>Offensive</h6>
                {(selectedPokemonForDesktop.calcs[0]?.offensive?.length > 0) ? (
                  <div className="row g-2">
                    {selectedPokemonForDesktop.calcs[0].offensive.map((calc, calcIndex) => (
                      <div key={calcIndex} className="col-12">
                        <div className="input-group">
                          <textarea value={calc} onChange={(e) => handleCalcChange(selectedPokemonIndex, calcIndex, "offensive", e.target.value)} rows="2" className="form-control form-control-modern" style={{ resize: "none" }} />
                          <button onClick={() => handleCalcDelete(selectedPokemonIndex, calcIndex, "offensive")} className="btn btn-outline-danger" title="Delete calc"><i className="fas fa-trash"></i></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-muted-modern">No offensive calcs.</p>}
              </div>
              <div className="col-md-6">
                <h6 className="text-primary mb-2"><i className="fas fa-shield me-2"></i>Defensive</h6>
                {(selectedPokemonForDesktop.calcs[0]?.defensive?.length > 0) ? (
                  <div className="row g-2">
                    {selectedPokemonForDesktop.calcs[0].defensive.map((calc, calcIndex) => (
                      <div key={calcIndex} className="col-12">
                        <div className="input-group">
                          <textarea value={calc} onChange={(e) => handleCalcChange(selectedPokemonIndex, calcIndex, "defensive", e.target.value)} rows="2" className="form-control form-control-modern" style={{ resize: "none" }} />
                          <button onClick={() => handleCalcDelete(selectedPokemonIndex, calcIndex, "defensive")} className="btn btn-outline-danger" title="Delete calc"><i className="fas fa-trash"></i></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-muted-modern">No defensive calcs.</p>}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-5">
            <i className="fas fa-users fa-3x text-muted mb-3"></i>
            <h6 className="text-muted-modern">No team submitted yet</h6>
            <p className="text-muted-modern mb-0">Submit your team first to start adding calcs</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CalcForm;