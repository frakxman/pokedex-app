/**
 * Represents detailed information about a Pokemon
 * 
 * @property id - Unique identifier for the Pokemon
 * @property name - Name of the Pokemon (capitalized)
 * @property height - Height of the Pokemon in decimeters
 * @property weight - Weight of the Pokemon in hectograms
 * @property types - Array of Pokemon types
 * @property sprites - Object containing URLs to Pokemon images
 */
export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Array<{type: {name: string}}>;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
} 