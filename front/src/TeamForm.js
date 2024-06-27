import React, { useState, useEffect } from "react";
import { parseTeam } from "./utils/parseTeam";

const TeamForm = ({ data, setData }) => {
  const [teamInput, setTeamInput] = useState("");
  const [pasteId, setPasteId] = useState(data?.paste || "");
  const [pokemonImages, setPokemonImages] = useState([]);
  const [error, setError] = useState("");
  const BACK_URL = process.env.REACT_APP_BACK_URL;

  useEffect(() => {
    if (data?.paste) {
      setPasteId(data.paste);
    }
  }, [data?.paste]);

  useEffect(() => {
    if (pasteId) {
      fetchPokemonImages(pasteId);
    }
// eslint-disable-next-line
  }, [pasteId]);

  const fetchPokemonImages = async (pasteId) => {
    try {
      const response = await fetch(
        `${BACK_URL}/parse-pokebin?pasteId=${pasteId}`
      );
      const images = await response.json();
      setPokemonImages(images);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch Pokémon images");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const newTeam = parseTeam(teamInput);

    if (!Array.isArray(newTeam) || newTeam.length === 0) {
      alert("Invalid team format");
      return;
    }

    setData((prevData) => ({
      ...prevData,
      team: newTeam,
      paste: pasteId,
    }));

    const formData = new URLSearchParams();
    formData.append("title", "");
    formData.append("author", "");
    formData.append("notes", "");
    formData.append("format", "");
    formData.append("rental", "");
    formData.append("encrypted_data", "");
    formData.append("paste", teamInput);

    if (!teamInput) {
      return;
    }

    const response = await fetch("https://pokebin.com/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const responseText = await response.text();
    const pasteIdMatch = responseText.match(/window\.PASTE_ID\s*=\s*"(\w+)";/);
    if (pasteIdMatch) {
      const pasteId = pasteIdMatch[1];
      setPasteId(pasteId);
      setData((prevData) => ({
        ...prevData,
        paste: pasteId,
      }));
    }

    setTeamInput("");
  };

  return (
    <div>
      <h2 className="text-center mb-3">Start with a team</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <textarea
            value={teamInput}
            onChange={(e) => setTeamInput(e.target.value)}
            rows="10"
            className="form-control"
            placeholder="Enter team details (showdown export)"
          ></textarea>
        </div>
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-success mt-3">
            Submit Team
          </button>
        </div>
      </form>
      {pasteId && (
        <div className="mt-3">
          <h3>Paste</h3>
          <a
            href={`https://pokebin.com/${pasteId}`}
            target="_blank"
            rel="noreferrer"
            className="text-primary"
          >
            Your paste is here
          </a>
        </div>
      )}
      {pokemonImages.length > 0 && (
        <div className="mt-3">
          <div className="d-flex flex-wrap">
            {pokemonImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Pokémon ${index + 1}`}
                className="img-thumbnail m-2"
                style={{ width: "100px", height: "100px" }}
              />
            ))}
            {error !== "" && (
              <div className="alert alert-danger mt-3">
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamForm;
