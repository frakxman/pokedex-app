import type { PokemonDetails } from './PokemonDetails';

export interface Pokemon {
  id: number;
  name: string;
  url: string;
  details?: PokemonDetails;
  favorite: boolean;
} 