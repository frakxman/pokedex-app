import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePokemonStore } from '../stores/pokemonStore';
import { createPinia, setActivePinia } from 'pinia';

// Mock fetch for tests
global.fetch = vi.fn();

function mockFetchSuccess(data: any) {
  global.fetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(data)
  });
}

describe('Pokemon Utilities', () => {
  beforeEach(() => {
    // Create a new Pinia instance for each test
    setActivePinia(createPinia());
    
    // Reset all mocks
    vi.clearAllMocks();
  });
  
  describe('usePokemonStore', () => {
    it('should initialize with an empty state', () => {
      const store = usePokemonStore();
      expect(store.pokemonList).toEqual([]);
      expect(store.favorites).toEqual([]);
      expect(store.isLoading).toBe(false);
    });
    
    it('should add a Pokemon to favorites when using toggleFavorite', () => {
      const store = usePokemonStore();
      
      // Prepare test data
      const pokemon = { id: 1, name: 'Bulbasaur', url: 'url', favorite: false };
      store.pokemonList = [pokemon];
      
      // Execute the action to test
      const result = store.toggleFavorite(pokemon);
      
      // Verify results
      expect(result.favorite).toBe(true);
      expect(store.favorites.length).toBe(1);
      expect(store.favorites[0].id).toBe(1);
    });
    
    it('should remove a Pokemon from favorites when it is already in favorites', () => {
      const store = usePokemonStore();
      
      // Prepare test data
      const pokemon = { id: 1, name: 'Bulbasaur', url: 'url', favorite: true };
      store.pokemonList = [pokemon];
      store.favorites = [{...pokemon}];
      
      // Execute the action to test
      const result = store.toggleFavorite(pokemon);
      
      // Verify results
      expect(result.favorite).toBe(false);
      expect(store.favorites.length).toBe(0);
    });
    
    it('should correctly format a Pokemon name', () => {
      // Example of utility function test
      const formatPokemonName = (name: string): string => {
        return name.charAt(0).toUpperCase() + name.slice(1);
      };
      
      expect(formatPokemonName('pikachu')).toBe('Pikachu');
      expect(formatPokemonName('bulbasaur')).toBe('Bulbasaur');
    });
  });
}); 