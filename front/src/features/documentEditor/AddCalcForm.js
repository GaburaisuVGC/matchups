import React, { useState } from "react";

const AddCalcForm = ({ data, setData }) => {
  const [calcInput, setCalcInput] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(data.team[0]?.species || "");
  const [calcType, setCalcType] = useState("offensive");

  const addCalc = () => {
    if (!selectedPokemon || !calcInput.trim()) {
      return;
    }
    const updatedTeam = data.team.map((pokemon) => {
      if (pokemon.species === selectedPokemon) {
        const newCalcs = pokemon.calcs && pokemon.calcs.length > 0 ? { ...pokemon.calcs[0] } : { offensive: [], defensive: [] };
        if (!newCalcs[calcType]) {
          newCalcs[calcType] = [];
        }
        newCalcs[calcType].push(calcInput.trim());
        return { ...pokemon, calcs: [newCalcs] };
      }
      return pokemon;
    });
    setData((prevData) => ({ ...prevData, team: updatedTeam }));
    setCalcInput("");
  };

  const teamExists = data.team.length > 0;

  return (
    <div className="form-section-modern p-3 p-lg-4 mb-4">
      <h2 className="form-title-modern mb-4">
        <i className="fas fa-plus me-2 text-accent-modern"></i>
        Add New Calc
      </h2>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label-modern">Pokémon</label>
          <select value={selectedPokemon} onChange={(e) => setSelectedPokemon(e.target.value)} className="form-control form-control-modern" disabled={!teamExists}>
            <option value="">Choose a Pokémon...</option>
            {data.team.map((pokemon, index) => (
              <option key={index} value={pokemon.species}>{pokemon.species}</option>
            ))}
          </select>
          <label className="form-label-modern mt-3">Calc Type</label>
          <select value={calcType} onChange={(e) => setCalcType(e.target.value)} className="form-control form-control-modern" disabled={!teamExists}>
            <option value="offensive">Offensive</option>
            <option value="defensive">Defensive</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label-modern">Calc Details</label>
          <textarea value={calcInput} onChange={(e) => setCalcInput(e.target.value)} rows="4" className="form-control form-control-modern" placeholder="e.g., 252+ Atk Choice Band Urshifu-Rapid-Strike-Gmax Surging Strikes vs. 252 HP / 4 Def Incineroar: 204-240 (101.4 - 119.4%) -- guaranteed OHKO" disabled={!teamExists} style={{ resize: "none" }} />
        </div>
      </div>
      <div className="mt-3">
        <button onClick={addCalc} className="btn btn-primary-modern" disabled={!teamExists || !selectedPokemon || !calcInput.trim()}>
          <i className="fas fa-plus me-2"></i>Add Calc
        </button>
      </div>
       {!teamExists && (
        <div className="alert alert-info mt-3 mb-0" role="alert">
          Please submit a team first to add calcs.
        </div>
      )}
    </div>
  );
};

export default AddCalcForm;
