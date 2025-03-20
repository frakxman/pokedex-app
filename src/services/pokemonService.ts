// Imports
import type { Pokemon } from '../interfaces/Pokemon';
import type { PokemonDetails } from '../interfaces/PokemonDetails';
import { usePokemonStore } from '../stores/pokemonStore';

/**
 * Fetches the initial list of Pokemon from the PokeAPI
 * 
 * @returns Promise that resolves to an array of Pokemon objects
 */
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

/**
 * Fetches detailed information for a specific Pokemon
 * 
 * @param name - The name of the Pokemon to fetch details for
 * @returns Promise that resolves to a PokemonDetails object
 */
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

/**
 * Loads additional Pokemon with pagination
 * 
 * @param offset - The starting index for pagination
 * @returns Promise that resolves to an array of Pokemon objects
 */
export async function loadMorePokemon(offset: number): Promise<Pokemon[]> {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if there are results
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

// Helper functions for components that retrieve data from the store

/**
 * Retrieves the current Pokemon list from the store
 * 
 * @returns Array of Pokemon objects from the store
 */
export const getPokemonFromStore = () => {
  const store = usePokemonStore();
  return store.getPokemonList;
};

/**
 * Retrieves the favorited Pokemon from the store
 * 
 * @returns Array of favorited Pokemon objects
 */
export const getFavoritesFromStore = () => {
  const store = usePokemonStore();
  return store.getFavorites;
};

/**
 * Fetches the Pokemon list from the store, triggering API call if needed
 * 
 * @returns Promise that resolves to an array of Pokemon objects
 */
export const fetchPokemonListFromStore = async () => {
  const store = usePokemonStore();
  return await store.fetchPokemonList();
};

/**
 * Fetches detailed information for a specific Pokemon from the store
 * 
 * @param name - The name of the Pokemon to fetch details for
 * @returns Promise that resolves to a PokemonDetails object
 */
export const fetchPokemonDetailsFromStore = async (name: string) => {
  const store = usePokemonStore();
  return await store.fetchPokemonDetails(name);
};

/**
 * Toggles the favorite status of a Pokemon in the store
 * 
 * @param pokemon - The Pokemon object to toggle favorite status for
 * @returns The updated Pokemon object
 */
export const toggleFavoriteInStore = (pokemon: Pokemon) => {
  const store = usePokemonStore();
  return store.toggleFavorite(pokemon);
};

/**
 * Loads more Pokemon from the store, triggering pagination API call
 * 
 * @returns Promise that resolves to the updated array of Pokemon objects
 */
export const loadMorePokemonFromStore = async () => {
  const store = usePokemonStore();
  return await store.loadMorePokemon();
};

/**
 * Shares Pokemon information via clipboard from the store
 * 
 * @param pokemon - The Pokemon object to share
 * @returns The text that was copied to clipboard
 */
export const sharePokemonFromStore = (pokemon: Pokemon) => {
  const store = usePokemonStore();
  return store.sharePokemon(pokemon);
}; 