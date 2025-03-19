import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePokemonStore } from '../stores/pokemonStore';
import { createPinia, setActivePinia } from 'pinia';

// Mock de fetch para tests
global.fetch = vi.fn();

function mockFetchSuccess(data: any) {
  global.fetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(data)
  });
}

describe('Utilidades de Pokémon', () => {
  beforeEach(() => {
    // Crear una instancia nueva de Pinia para cada test
    setActivePinia(createPinia());
    
    // Resetear todos los mocks
    vi.clearAllMocks();
  });
  
  describe('usePokemonStore', () => {
    it('debería inicializarse con un estado vacío', () => {
      const store = usePokemonStore();
      expect(store.pokemonList).toEqual([]);
      expect(store.favorites).toEqual([]);
      expect(store.isLoading).toBe(false);
    });
    
    it('debería añadir un Pokémon a favoritos cuando se usa toggleFavorite', () => {
      const store = usePokemonStore();
      
      // Preparar datos de prueba
      const pokemon = { id: 1, name: 'Bulbasaur', url: 'url', favorite: false };
      store.pokemonList = [pokemon];
      
      // Ejecutar la acción a probar
      const result = store.toggleFavorite(pokemon);
      
      // Verificar resultados
      expect(result.favorite).toBe(true);
      expect(store.favorites.length).toBe(1);
      expect(store.favorites[0].id).toBe(1);
    });
    
    it('debería quitar un Pokémon de favoritos cuando ya está en favoritos', () => {
      const store = usePokemonStore();
      
      // Preparar datos de prueba
      const pokemon = { id: 1, name: 'Bulbasaur', url: 'url', favorite: true };
      store.pokemonList = [pokemon];
      store.favorites = [{...pokemon}];
      
      // Ejecutar la acción a probar
      const result = store.toggleFavorite(pokemon);
      
      // Verificar resultados
      expect(result.favorite).toBe(false);
      expect(store.favorites.length).toBe(0);
    });
    
    it('debería formatear correctamente un nombre de Pokémon', () => {
      // Ejemplo de prueba de función utilitaria
      const formatPokemonName = (name: string): string => {
        return name.charAt(0).toUpperCase() + name.slice(1);
      };
      
      expect(formatPokemonName('pikachu')).toBe('Pikachu');
      expect(formatPokemonName('bulbasaur')).toBe('Bulbasaur');
    });
  });
}); 