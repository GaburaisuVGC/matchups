import React, { useEffect, useState } from "react";
import "./App.css";

const HowToUse = () => {

    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const darkMode = localStorage.getItem("darkMode") === "true";
        setIsDarkMode(darkMode);
        document.body.className = darkMode ? "dark-mode" : "light-mode";
      }, []);

      useEffect(() => {
        document.body.className = isDarkMode ? "dark-mode" : "light-mode";
      }, [isDarkMode]);


  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">How to use <a href="/" className={`text-decoration-none ${isDarkMode ? "dark-mode" : "light-mode"}`}>Matchups.net</a></h1>
      <ol className="list-group list-group-numbered">
        <li className="list-group-item">
          <h2>Starting with Your Document</h2>
          <p>
            To begin, take a Showdown export to add a team. The export usually
            looks like this:
          </p>
          <pre className="bg-light p-3 rounded">
            {`Urshifu-Rapid-Strike @ Choice Scarf
Ability: Unseen Fist
Tera Type: Steel
EVs: 100 HP / 156 Atk / 4 Def / 76 SpD / 172 Spe
Adamant Nature
- Surging Strikes
- Close Combat
- Aqua Jet
- U-turn

Chien-Pao @ Focus Sash
Ability: Sword of Ruin
Tera Type: Ghost
EVs: 252 Atk / 4 Def / 252 Spe
Adamant Nature
- Protect
- Icicle Crash
- Sucker Punch
- Sacred Sword

Raging Bolt @ Leftovers
Ability: Protosynthesis
Level: 50
Tera Type: Fairy
EVs: 188 HP / 140 Def / 100 SpA / 4 SpD / 76 Spe
Modest Nature
IVs: 20 Atk
- Thunderclap
- Dragon Pulse
- Calm Mind
- Protect

Landorus @ Life Orb
Ability: Sheer Force
Level: 50
Tera Type: Poison
EVs: 132 HP / 12 Def / 116 SpA / 4 SpD / 244 Spe
Modest Nature
IVs: 0 Atk
- Earth Power
- Sludge Bomb
- Substitute
- Protect

Incineroar @ Safety Goggles
Ability: Intimidate
Level: 50
Tera Type: Ghost
EVs: 252 HP / 100 Def / 156 SpD
Careful Nature
- Flare Blitz
- Parting Shot
- Knock Off
- Fake Out

Rillaboom @ Assault Vest
Ability: Grassy Surge
Tera Type: Fire
EVs: 252 HP / 36 Atk / 76 Def / 140 SpD / 4 Spe
Adamant Nature
- Wood Hammer
- Grassy Glide
- U-turn
- Fake Out`}
          </pre>
          <p>
            OR, if you already have one, import a JSON via "Load Draft" to
            continue working on an existing document.
          </p>
        </li>
        <li className="list-group-item">
          <h2>Calcs</h2>
          <p>
            Each Pokémon on your team can contain both offensive and defensive
            calcs. You can also add small notes, such as what your Pokémon
            outspeeds.
          </p>
        </li>
        <li className="list-group-item">
          <h2>Matchups</h2>
          <ul>
            <li>
              Add a matchup with a title and potentially a paste for easy access
              within the same document.
            </li>
            <li>Complete Gameplan 1 with text and a composition.</li>
            <li>You can add alternative gameplans.</li>
            <li>You can add additional matchups.</li>
          </ul>
        </li>
        <li className="list-group-item">
          <h2>Draft</h2>
          <p>
            If you haven't finished your document, you can save it as a draft.
            You will receive a JSON containing your work, which can be reused on
            the homepage by selecting "Load Draft".
          </p>
        </li>
        <li className="list-group-item">
          <h2>Save and Send</h2>
          <ul>
            <li>
              By clicking "Save," you will be taken to the visual page of your
              document.
            </li>
            <li>
              You can share it or download the corresponding JSON document
              (allowing you to modify it as you wish before re-uploading it).
            </li>
          </ul>
        </li>
      </ol>
    </div>
  );
};

export default HowToUse;
