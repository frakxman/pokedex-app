import type { PokemonDetails } from './PokemonDetails';

/**
 * Represents a Pokemon entity with basic information
 * 
 * @property id - Unique identifier for the Pokemon
 * @property name - Name of the Pokemon (capitalized)
 * @property url - API URL for the Pokemon
 * @property details - Optional detailed information about the Pokemon
 * @property favorite - Indicates if the Pokemon is marked as a favorite
 */
export interface Pokemon {
  id: number;
  name: string;
  url: string;
  details?: PokemonDetails;
  favorite: boolean;
} 