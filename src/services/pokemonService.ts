// Imports
import type { Pokemon } from '../interfaces/Pokemon';
import type { PokemonDetails } from '../interfaces/PokemonDetails';
import { usePokemonStore } from '../stores/pokemonStore';

// Pure service functions to interact with the API
export async function fetchPokemonList(): Promise<Pokemon[]> {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
    const data = await response.json();
    
    return data.results.map((pokemon: any, index: number) => {
      const id = index + 1;
      return {
        id,
        name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
        url: pokemon.url,
        favorite: false
      };
    });
  } catch (error) {
    console.error('Error fetching pokemon list:', error);
    throw error;
  }
}

export async function fetchPokemonDetails(name: string): Promise<PokemonDetails> {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    const data = await response.json();
    
    return {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      height: data.height,
      weight: data.weight,
      types: data.types,
      sprites: data.sprites
    };
  } catch (error) {
    console.error(`Error fetching details for pokemon ${name}:`, error);
    throw error;
  }
}

export async function loadMorePokemon(offset: number): Promise<Pokemon[]> {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Verificar si hay resultados
    if (data.results && data.results.length > 0) {
      return data.results.map((pokemon: any, index: number) => {
        const id = offset + index + 1;
        return {
          id,
          name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
          url: pokemon.url,
          favorite: false
        };
      });
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching more Pokémon:', error);
    throw error;
  }
}

// Funciones auxiliares para componentes que obtienen datos del store
export const getPokemonFromStore = () => {
  const store = usePokemonStore();
  return store.getPokemonList;
};

export const getFavoritesFromStore = () => {
  const store = usePokemonStore();
  return store.getFavorites;
};

export const fetchPokemonListFromStore = async () => {
  const store = usePokemonStore();
  return await store.fetchPokemonList();
};

export const fetchPokemonDetailsFromStore = async (name: string) => {
  const store = usePokemonStore();
  return await store.fetchPokemonDetails(name);
};

export const toggleFavoriteInStore = (pokemon: Pokemon) => {
  const store = usePokemonStore();
  return store.toggleFavorite(pokemon);
};

export const loadMorePokemonFromStore = async () => {
  const store = usePokemonStore();
  return await store.loadMorePokemon();
};

export const sharePokemonFromStore = (pokemon: Pokemon) => {
  const store = usePokemonStore();
  return store.sharePokemon(pokemon);
}; 