export const parsePokemon = (input) => {
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const pokemon = {};

  if (lines[0] && lines[0].includes(" @ ")) {
    const firstLineParts = lines[0].split(" @ ");
    pokemon.species = firstLineParts[0].trim();
    pokemon.item = firstLineParts[1].trim();
  } else if (lines[0]) {
    pokemon.species = lines[0].trim();
  }

  let currentIndex = 1;

  if (lines[currentIndex] && lines[currentIndex].includes("Ability:")) {
    const abilityLineParts = lines[currentIndex].split(": ");
    pokemon.ability = abilityLineParts[1].trim();
    currentIndex++;
  }

  if (lines[currentIndex] && lines[currentIndex].includes("Level:")) {
    const levelLineParts = lines[currentIndex].split(": ");
    pokemon.level = parseInt(levelLineParts[1].trim(), 10);
    currentIndex++;
  } else {
    pokemon.level = 100;
  }

  if (lines[currentIndex] && lines[currentIndex].includes("Tera Type:")) {
    const teraTypeLineParts = lines[currentIndex].split(": ");
    pokemon.teraType = teraTypeLineParts[1].trim();
    currentIndex++;
  }

  if (lines[currentIndex] && lines[currentIndex].includes("EVs:")) {
    const evsLineParts = lines[currentIndex].split(": ");
    pokemon.evs = parseStats(evsLineParts[1].trim());
    currentIndex++;
  } else {
    pokemon.evs = {
      hp: 0,
      attack: 0,
      defense: 0,
      spAttack: 0,
      spDefense: 0,
      speed: 0,
    };
  }

  if (lines[currentIndex] && lines[currentIndex].includes(" Nature")) {
    const natureLineParts = lines[currentIndex].split(" Nature");
    pokemon.nature = natureLineParts[0].trim();
    currentIndex++;
  }

  const ivsLineIndex = lines.findIndex((line) => line.startsWith("IVs:"));
  if (ivsLineIndex !== -1) {
    pokemon.ivs = parseIVs(lines[ivsLineIndex].split(": ")[1].trim());
    pokemon.moves = lines
      .slice(ivsLineIndex + 1)
      .map((line) => line.replace("- ", "").trim());
  } else {
    pokemon.ivs = defaultIVs();
    pokemon.moves = lines
      .slice(currentIndex)
      .map((line) => line.replace("- ", "").trim());
  }

  return pokemon;
};

const parseStats = (statString) => {
  const stats = {
    hp: 0,
    attack: 0,
    defense: 0,
    spAttack: 0,
    spDefense: 0,
    speed: 0,
  };
  statString.split(" / ").forEach((stat) => {
    const [value, type] = stat.split(" ");
    const key = type
      .toLowerCase()
      .replace("atk", "attack")
      .replace("def", "defense")
      .replace("spa", "spAttack")
      .replace("spd", "spDefense")
      .replace("spe", "speed")
      .replace("hp", "hp");
    stats[key] = parseInt(value, 10);
  });
  return stats;
};

const parseIVs = (ivString) => {
  const ivs = defaultIVs();
  ivString.split(" / ").forEach((iv) => {
    const [value, type] = iv.split(" ");
    const key = type
      .toLowerCase()
      .replace("atk", "attack")
      .replace("def", "defense")
      .replace("spa", "spAttack")
      .replace("spd", "spDefense")
      .replace("spe", "speed")
      .replace("hp", "hp");
    ivs[key] = parseInt(value, 10);
  });
  return ivs;
};

const defaultIVs = () => ({
  hp: 31,
  attack: 31,
  defense: 31,
  spAttack: 31,
  spDefense: 31,
  speed: 31,
});
