import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPokemonList, fetchPokemonDetails, loadMorePokemon } from '../services/pokemonService';

// Mock de fetch global
global.fetch = vi.fn();

function mockFetchSuccess(data: any) {
  global.fetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(data)
  });
}

describe('Pokemon Service', () => {
  beforeEach(() => {
    // Resetear todos los mocks antes de cada prueba
    vi.clearAllMocks();
  });
  
  describe('fetchPokemonList', () => {
    it('debería realizar un fetch a la API correcta', async () => {
      // Mock de la respuesta
      mockFetchSuccess({
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' }
        ]
      });
      
      // Llamar a la función
      await fetchPokemonList();
      
      // Verificar que se hizo el fetch a la URL correcta
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=20');
    });
    
    it('debería formatear correctamente los nombres de Pokémon', async () => {
      // Mock de la respuesta
      mockFetchSuccess({
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' }
        ]
      });
      
      // Llamar a la función
      const result = await fetchPokemonList();
      
      // Verificar formato
      expect(result[0].name).toBe('Bulbasaur');
      expect(result[1].name).toBe('Ivysaur');
    });
    
    it('debería manejar errores correctamente', async () => {
      // Mock de error
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('API Error'));
      
      // Esperar que lance un error
      await expect(fetchPokemonList()).rejects.toThrow();
    });
  });
  
  describe('fetchPokemonDetails', () => {
    it('debería realizar un fetch a la API correcta con el nombre del Pokémon', async () => {
      // Mock de la respuesta
      mockFetchSuccess({
        id: 1,
        name: 'bulbasaur',
        height: 7,
        weight: 69,
        types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
        sprites: { other: { 'official-artwork': { front_default: 'url' } } }
      });
      
      // Llamar a la función
      await fetchPokemonDetails('bulbasaur');
      
      // Verificar URL
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/bulbasaur');
    });
    
    it('debería devolver detalles del Pokémon formateados correctamente', async () => {
      // Mock de la respuesta
      mockFetchSuccess({
        id: 1,
        name: 'bulbasaur',
        height: 7,
        weight: 69,
        types: [{ type: { name: 'grass' } }],
        sprites: { other: { 'official-artwork': { front_default: 'url' } } }
      });
      
      // Llamar a la función
      const result = await fetchPokemonDetails('bulbasaur');
      
      // Verificar formato
      expect(result.name).toBe('Bulbasaur');
      expect(result.height).toBe(7);
      expect(result.weight).toBe(69);
      expect(result.types[0].type.name).toBe('grass');
    });
  });
  
  describe('loadMorePokemon', () => {
    it('debería usar el offset correcto para cargar más Pokémon', async () => {
      // Mock de la respuesta
      mockFetchSuccess({
        results: [
          { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
          { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon/5/' }
        ]
      });
      
      // Llamar a la función con offset de 20
      await loadMorePokemon(20);
      
      // Verificar URL con offset
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=20&offset=20');
    });
    
    it('debería manejar correctamente el caso de respuesta sin resultados', async () => {
      // Mock de respuesta vacía
      mockFetchSuccess({ results: [] });
      
      // Llamar a la función
      const result = await loadMorePokemon(100);
      
      // Verificar array vacío
      expect(result).toEqual([]);
    });
    
    it('debería manejar errores HTTP correctamente', async () => {
      // Mock de respuesta con error HTTP
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404
      });
      
      // Esperar que lance un error
      await expect(loadMorePokemon(20)).rejects.toThrow('HTTP error! status: 404');
    });
  });
}); 