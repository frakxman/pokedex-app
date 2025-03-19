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