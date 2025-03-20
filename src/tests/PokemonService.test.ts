import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPokemonList, fetchPokemonDetails, loadMorePokemon } from '../services/pokemonService';

// Mock global fetch
function mockFetchSuccess(data: any) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data)
  });
}

function mockFetchError() {
  global.fetch = vi.fn().mockRejectedValue(new Error("API Error"));
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('fetchPokemonList', () => {
  it('should fetch from the correct API', async () => {
    // Mock response
    mockFetchSuccess({
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' }
      ]
    });
    
    // Call function
    await fetchPokemonList();
    
    // Verify fetch to correct URL
    expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=20');
  });
  
  it('should correctly format Pokemon names', async () => {
    // Mock response
    mockFetchSuccess({
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' }
      ]
    });
    
    // Call function
    const result = await fetchPokemonList();
    
    // Verify format
    expect(result[0].name).toBe('Bulbasaur');
    expect(result[1].name).toBe('Ivysaur');
  });
  
  it('should handle errors properly', async () => {
    // Mock error
    mockFetchError();
    
    // Verify error is thrown
    await expect(fetchPokemonList()).rejects.toThrow();
  });
});

describe('fetchPokemonDetails', () => {
  it('should fetch from the correct API with the right Pokemon name', async () => {
    // Mock response
    mockFetchSuccess({
      id: 1,
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
      sprites: { other: { 'official-artwork': { front_default: 'image.png' } } }
    });
    
    // Call function
    await fetchPokemonDetails('bulbasaur');
    
    // Verify correct URL
    expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/bulbasaur');
  });
  
  it('should handle errors properly', async () => {
    // Mock error
    mockFetchError();
    
    // Verify error is thrown
    await expect(fetchPokemonDetails('mewtwo')).rejects.toThrow();
  });
});

describe('loadMorePokemon', () => {
  it('should fetch from the correct API with the right offset', async () => {
    // Mock response
    mockFetchSuccess({
      results: [
        { name: 'pokemon21', url: 'https://pokeapi.co/api/v2/pokemon/21/' },
        { name: 'pokemon22', url: 'https://pokeapi.co/api/v2/pokemon/22/' }
      ]
    });
    
    // Call function with offset of 20
    await loadMorePokemon(20);
    
    // Verify fetch with offset
    expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=20&offset=20');
  });
  
  it('should return empty array for empty results', async () => {
    // Mock empty response
    mockFetchSuccess({ results: [] });
    
    // Call function
    const result = await loadMorePokemon(40);
    
    // Verify empty array
    expect(result).toEqual([]);
  });
  
  it('should handle errors properly', async () => {
    // Mock error
    mockFetchError();
    
    // Verify error is thrown
    await expect(loadMorePokemon(20)).rejects.toThrow();
  });
}); 