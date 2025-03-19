import { defineStore } from 'pinia';
import type { Pokemon } from '../interfaces/Pokemon';
import { fetchPokemonList as fetchPokemonListService, 
         fetchPokemonDetails as fetchPokemonDetailsService,
         loadMorePokemon as loadMorePokemonService } from '../services/pokemonService';

// Store para manejar el estado global de Pokémon usando Pinia
export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemonList: [] as Pokemon[],
    favorites: [] as Pokemon[],
    isLoading: false,
  }),
  
  getters: {
    getFavorites: (state) => state.favorites,
    getPokemonList: (state) => state.pokemonList,
  },
  
  actions: {
    async fetchPokemonList() {
      if (this.pokemonList.length > 0) return this.pokemonList;
      
      this.isLoading = true;
      try {
        this.pokemonList = await fetchPokemonListService();
        
        // Verificar cuáles están en favoritos
        this.pokemonList = this.pokemonList.map(pokemon => {
          const isFavorite = this.favorites.some(f => f.id === pokemon.id);
          return { ...pokemon, favorite: isFavorite };
        });
        
        this.isLoading = false;
        return this.pokemonList;
      } catch (error) {
        console.error('Error fetching pokemon list from store:', error);
        this.isLoading = false;
        throw error;
      }
    },
    
    async fetchPokemonDetails(name: string) {
      try {
        const details = await fetchPokemonDetailsService(name);
        
        // Actualizar detalles en el Pokémon correspondiente
        const index = this.pokemonList.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
        if (index !== -1) {
          this.pokemonList[index].details = details;
        }
        
        return details;
      } catch (error) {
        console.error(`Error fetching details for pokemon ${name} from store:`, error);
        throw error;
      }
    },
    
    toggleFavorite(pokemon: Pokemon) {
      const index = this.pokemonList.findIndex(p => p.id === pokemon.id);
      
      if (index !== -1) {
        // Toggle el estado de favorito
        this.pokemonList[index].favorite = !this.pokemonList[index].favorite;
        
        if (this.pokemonList[index].favorite) {
          // Agregar a favoritos si no existe
          if (!this.favorites.some(f => f.id === pokemon.id)) {
            this.favorites.push({...this.pokemonList[index]});
          }
        } else {
          // Quitar de favoritos
          this.favorites = this.favorites.filter(f => f.id !== pokemon.id);
        }
        
        return this.pokemonList[index];
      }
      
      return pokemon;
    },
    
    // Función para cargar más Pokémon
    async loadMorePokemon() {
      const offset = this.pokemonList.length;
      
      try {
        this.isLoading = true;
        const newPokemonList = await loadMorePokemonService(offset);
        
        // Verificar cuáles están en favoritos
        const newPokemonWithFavorites = newPokemonList.map(pokemon => {
          const isFavorite = this.favorites.some(f => f.id === pokemon.id);
          return { ...pokemon, favorite: isFavorite };
        });
        
        this.pokemonList.push(...newPokemonWithFavorites);
        this.isLoading = false;
        return this.pokemonList;
      } catch (error) {
        console.error('Error fetching more Pokémon from store:', error);
        this.isLoading = false;
        throw error;
      }
    },
    
    // Copiar información del Pokémon al portapapeles
    sharePokemon(pokemon: Pokemon) {
      if (!pokemon.details) return '';
      
      const types = pokemon.details.types.map(t => t.type.name).join(', ');
      const shareText = `Name: ${pokemon.name}, Weight: ${pokemon.details.weight}, Height: ${pokemon.details.height}, Types: ${types}`;
      
      // Log de la información que se copiará al portapapeles
      console.log('Intentando copiar al portapapeles:', shareText);
      
      // Método principal usando Clipboard API
      const copyWithClipboardAPI = () => {
        return navigator.clipboard.writeText(shareText)
          .then(() => {
            console.log('Copiado exitosamente con Clipboard API');
            return true;
          })
          .catch(err => {
            console.error('Error con Clipboard API:', err);
            return false;
          });
      };
      
      // Método de respaldo usando document.execCommand (método antiguo)
      const copyWithExecCommand = () => {
        try {
          // Crear un elemento temporal
          const textArea = document.createElement('textarea');
          textArea.value = shareText;
          
          // Asegurarse de que esté fuera de la vista
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          
          // Intentar copiar el texto
          const success = document.execCommand('copy');
          document.body.removeChild(textArea);
          
          if (success) {
            console.log('Copiado exitosamente con execCommand');
            return true;
          } else {
            console.error('execCommand falló sin error');
            return false;
          }
        } catch (err) {
          console.error('Error con execCommand:', err);
          return false;
        }
      };
      
      // Intentar con ambos métodos
      copyWithClipboardAPI().then(success => {
        if (!success) {
          const backupSuccess = copyWithExecCommand();
          if (!backupSuccess) {
            console.error('No se pudo copiar al portapapeles con ningún método');
            // Almacenar en localStorage como último recurso
            localStorage.setItem('lastSharedPokemon', shareText);
            console.log('Guardado en localStorage como último recurso');
          }
        }
      });
      
      return shareText;
    }
  }
}); 