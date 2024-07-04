import React, { useState } from "react";

const HowToUse = () => {
  const [showExample, setShowExample] = useState(false);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">How to use Matchups.net</h1>
      <ol className="list-group list-group-numbered">
        <li className="list-group-item">
          <h2>Starting with Your Document</h2>
          <p>
            To begin, take a Showdown export to add a team. The export usually
            looks like this:
          </p>
          <button
            className="btn btn-link"
            onClick={() => setShowExample(!showExample)}
          >
            {showExample ? "Hide Example" : "Show Example"}
          </button>
          {showExample && (
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
          )}
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
              within the same document. You can also add multiple matchups.
            </li>
            <li>Complete Gameplan 1 with text and a composition.</li>
            <li>You can add alternative gameplans.</li>
            <li>In each gameplan, you can add Pokémon Showdown Replays.</li>
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
              You can share it, edit the document, or download the corresponding JSON document
              (also allowing you to modify it as you wish before re-uploading it).
            </li>
          </ul>
        </li>
        <li className="list-group-item">
          <h2>Save Locally</h2>
          <ul>
            <li>
              If you don't want to make your document public, you can "Save Locally". (Only one document can be saved locally at a time.)
            </li>
            <li>
                You'll be able to access it with the "View Local Doc" button, or <a href="/stored">by clicking here</a>.
            </li>
            <li>
                This will allow you to visualize your document without sharing it with others, thanks to the data stored in your web browser. However, your document will not be available in other web browsers or devices, unless you Save Locally everywhere you want to access it.
            </li>
            <li>
                If you clear your browser data, you will lose your document.
            </li>
          </ul>
        </li>
        <li className="list-group-item">
          <h2>Best method to Save Locally & Share</h2>
          <p>
            While not being the most user-friendly method, the best way to save your document locally and share it with others is to:
          </p>
          <ul>
            <li>
                After saving your document locally, download the JSON file.
            </li>
            <li>
                Send the JSON file to the person you want to share your document with.
            </li>
            <li>
                They can then load and save the JSON file to Matchups.net by clicking "Load Draft" then "Save Locally".
            </li>
          </ul>
        </li>
      </ol>
    </div>
  );
};

export default HowToUse;
