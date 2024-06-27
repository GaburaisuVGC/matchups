import { parsePokemon } from "./parsePokemon";

export const parseTeam = (input) => {
  const pokemonBlocks = input
    .split("\n\n")
    .map((block) => block.trim())
    .filter((block) => block.length > 0);
  return pokemonBlocks.map((block) => {
    const pokemon = parsePokemon(block);
    return { species: pokemon.species, calcs: [] };
  });
};
