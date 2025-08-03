import React, { useState, useEffect } from "react";

const HowToUse = () => {
  const [showExample, setShowExample] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkMode);
  }, []);

  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "light-mode";
  }, [isDarkMode]);

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-3">
          <i className="fas fa-question-circle text-accent-modern me-3"></i>
          How to use Matchups.net
        </h1>
        <p className="lead text-muted-modern">
          Complete guide to creating and managing your tournament preparation
          documents
        </p>
      </div>

      {/* Guide Steps */}
      <div className="row g-4">
        {/* Step 1 */}
        <div className="col-12">
          <div className="content-card-modern">
            <div className="d-flex align-items-start mb-3">
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{ width: "40px", height: "40px", flexShrink: 0 }}
              >
                <span className="fw-bold">1</span>
              </div>
              <div className="flex-grow-1">
                <h3 className="h4 mb-3">
                  <i className="fas fa-upload me-2 text-accent-modern"></i>
                  Starting with Your Document
                </h3>
                <p className="mb-3">
                  To begin, take a Showdown export to add a team. The export
                  usually looks like this:
                </p>

                <button
                  className="btn btn-secondary-modern mb-3"
                  onClick={() => setShowExample(!showExample)}
                >
                  <i
                    className={`fas fa-${
                      showExample ? "eye-slash" : "eye"
                    } me-2`}
                  ></i>
                  {showExample ? "Hide Example" : "Show Example"}
                </button>

                {showExample && (
                  <div
                    className="border rounded p-3 mb-3"
                    style={{ background: "var(--bg-tertiary-light)" }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <small className="text-muted-modern">
                        <i className="fas fa-code me-1"></i>
                        Pokémon Showdown Export Example
                      </small>
                      <button
                        className="btn btn-secondary-modern btn-sm"
                        onClick={() =>
                          navigator.clipboard
                            .writeText(`Urshifu-Rapid-Strike @ Choice Scarf
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
- Fake Out`)
                        }
                        title="Copy to clipboard"
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                    </div>
                    <pre
                      className="calc-text mb-0"
                      style={{
                        fontSize: "0.75rem",
                        maxHeight: "300px",
                        overflow: "auto",
                      }}
                    >
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
                  </div>
                )}

                <div
                  className="alert alert-info d-flex align-items-center"
                  role="alert"
                >
                  <i className="fas fa-lightbulb me-2"></i>
                  <span>
                    <strong>Alternative:</strong> If you already have a saved
                    document, use "Load Draft" to continue working on an
                    existing document.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="col-12">
          <div className="content-card-modern">
            <div className="d-flex align-items-start mb-3">
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{ width: "40px", height: "40px", flexShrink: 0 }}
              >
                <span className="fw-bold">2</span>
              </div>
              <div className="flex-grow-1">
                <h3 className="h4 mb-3">
                  <i className="fas fa-calculator me-2 text-accent-modern"></i>
                  Damage Calculations
                </h3>
                <p className="mb-3">
                  Each Pokémon on your team can contain both offensive and
                  defensive calculations. You can also add small notes, such as
                  what your Pokémon outspeeds.
                </p>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <h6 className="text-success mb-2">
                        <i className="fas fa-sword me-2"></i>
                        Offensive Calculations
                      </h6>
                      <ul className="small mb-0">
                        <li>Damage output against common threats</li>
                        <li>KO ranges and percentages</li>
                        <li>After item/ability boosts</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <h6 className="text-primary mb-2">
                        <i className="fas fa-shield me-2"></i>
                        Defensive Calculations
                      </h6>
                      <ul className="small mb-0">
                        <li>Damage taken from common attacks</li>
                        <li>Survival thresholds</li>
                        <li>Speed comparisons</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="col-12">
          <div className="content-card-modern">
            <div className="d-flex align-items-start mb-3">
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{ width: "40px", height: "40px", flexShrink: 0 }}
              >
                <span className="fw-bold">3</span>
              </div>
              <div className="flex-grow-1">
                <h3 className="h4 mb-3">
                  <i className="fas fa-swords me-2 text-accent-modern"></i>
                  Matchup Analysis
                </h3>
                <div className="mb-3">
                  <p className="mb-2">
                    Add matchups with titles and opponent paste links for easy
                    access within the same document. You can add multiple
                    matchups for different opponents or team archetypes.
                  </p>

                  <div
                    className="alert alert-success d-flex align-items-center mb-3"
                    role="alert"
                  >
                    <i className="fas fa-star me-2"></i>
                    <span>
                      <strong>Pro Tip:</strong> Each matchup can contain
                      multiple gameplans for different scenarios.
                    </span>
                  </div>
                </div>

                <h6 className="mb-3">
                  <i className="fas fa-chess me-2"></i>
                  Gameplans Features
                </h6>
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="text-center p-3 border rounded">
                      <i className="fas fa-scroll fa-2x text-accent-modern mb-2"></i>
                      <h6>Strategy Notes</h6>
                      <small className="text-muted-modern">
                        Rich text editor for detailed strategies
                      </small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-3 border rounded">
                      <i className="fas fa-users fa-2x text-accent-modern mb-2"></i>
                      <h6>Team Composition</h6>
                      <small className="text-muted-modern">
                        Lead/Back role assignments for each Pokémon
                      </small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-3 border rounded">
                      <i className="fas fa-play fa-2x text-accent-modern mb-2"></i>
                      <h6>Replay Links</h6>
                      <small className="text-muted-modern">
                        Store links to practice games and battles
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="col-12">
          <div className="content-card-modern">
            <div className="d-flex align-items-start mb-3">
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{ width: "40px", height: "40px", flexShrink: 0 }}
              >
                <span className="fw-bold">4</span>
              </div>
              <div className="flex-grow-1">
                <h3 className="h4 mb-3">
                  <i className="fas fa-share-alt me-2 text-accent-modern"></i>
                  Best Method to Save Locally & Share
                </h3>
                <p className="mb-3">
                  While not the most user-friendly method, the best way to save
                  your document locally and share it with others is to follow
                  these steps:
                </p>

                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="text-center p-3 border rounded h-100">
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                        style={{ width: "50px", height: "50px" }}
                      >
                        <i className="fas fa-save"></i>
                      </div>
                      <h6>Step 1</h6>
                      <p className="small mb-0">
                        After saving your document locally, download the JSON
                        file using "Download Draft"
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-3 border rounded h-100">
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                        style={{ width: "50px", height: "50px" }}
                      >
                        <i className="fas fa-paper-plane"></i>
                      </div>
                      <h6>Step 2</h6>
                      <p className="small mb-0">
                        Send the JSON file to the person you want to share your
                        document with
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-3 border rounded h-100">
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                        style={{ width: "50px", height: "50px" }}
                      >
                        <i className="fas fa-upload"></i>
                      </div>
                      <h6>Step 3</h6>
                      <p className="small mb-0">
                        They load the JSON file using "Load Draft" then "Save
                        Locally" to access it
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="content-card-modern mt-5">
        <div className="text-center">
          <h4 className="mb-3">
            <i className="fas fa-rocket me-2 text-accent-modern"></i>
            Ready to Get Started?
          </h4>
          <p className="text-muted-modern mb-4">
            Create your first tournament preparation document now!
          </p>
          <a href="/" className="btn btn-primary-modern">
            <i className="fas fa-plus me-2"></i>
            Create New Document
          </a>
        </div>
      </div>
    </div>
  );
};

export default HowToUse;
