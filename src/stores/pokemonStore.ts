import { defineStore } from 'pinia';
import type { Pokemon } from '../interfaces/Pokemon';
import { fetchPokemonList as fetchPokemonListService, 
         fetchPokemonDetails as fetchPokemonDetailsService,
         loadMorePokemon as loadMorePokemonService } from '../services/pokemonService';

/**
 * Pokemon store for managing global Pokemon state
 * Contains all Pokemon data, favorites, and loading state
 */
export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemonList: [] as Pokemon[],
    favorites: [] as Pokemon[],
    isLoading: false,
  }),
  
  getters: {
    /**
     * Get all favorited Pokemon
     * @returns Array of favorite Pokemon objects
     */
    getFavorites: (state) => state.favorites,
    
    /**
     * Get all Pokemon in the list
     * @returns Array of Pokemon objects
     */
    getPokemonList: (state) => state.pokemonList,
  },
  
  actions: {
    /**
     * Fetches the initial Pokemon list if not already loaded
     * Marks Pokemon as favorites if they exist in the favorites list
     * 
     * @returns Promise that resolves to an array of Pokemon objects
     */
    async fetchPokemonList() {
      if (this.pokemonList.length > 0) return this.pokemonList;
      
      this.isLoading = true;
      try {
        this.pokemonList = await fetchPokemonListService();
        
        // Check which ones are in favorites
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
    
    /**
     * Fetches detailed information for a specific Pokemon
     * Updates the Pokemon in the list with the detailed information
     * 
     * @param name - The name of the Pokemon to fetch details for
     * @returns Promise that resolves to the Pokemon details
     */
    async fetchPokemonDetails(name: string) {
      try {
        const details = await fetchPokemonDetailsService(name);
        
        // Update details in the corresponding Pokemon
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
    
    /**
     * Toggles the favorite status of a Pokemon
     * Adds or removes the Pokemon from the favorites array
     * 
     * @param pokemon - The Pokemon object to toggle favorite status
     * @returns The updated Pokemon object
     */
    toggleFavorite(pokemon: Pokemon) {
      const index = this.pokemonList.findIndex(p => p.id === pokemon.id);
      
      if (index !== -1) {
        // Toggle favorite status
        this.pokemonList[index].favorite = !this.pokemonList[index].favorite;
        
        if (this.pokemonList[index].favorite) {
          // Add to favorites if it doesn't exist
          if (!this.favorites.some(f => f.id === pokemon.id)) {
            this.favorites.push({...this.pokemonList[index]});
          }
        } else {
          // Remove from favorites
          this.favorites = this.favorites.filter(f => f.id !== pokemon.id);
        }
        
        return this.pokemonList[index];
      }
      
      return pokemon;
    },
    
    /**
     * Loads more Pokemon with pagination
     * Appends new Pokemon to the existing list
     * Marks new Pokemon as favorites if they exist in the favorites list
     * 
     * @returns Promise that resolves to the updated Pokemon list
     */
    async loadMorePokemon() {
      const offset = this.pokemonList.length;
      
      try {
        this.isLoading = true;
        const newPokemonList = await loadMorePokemonService(offset);
        
        // Check which ones are in favorites
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
    
    /**
     * Copies Pokemon information to the clipboard
     * Uses multiple methods for cross-browser compatibility
     * 
     * @param pokemon - The Pokemon object to share
     * @returns The formatted text that was copied to clipboard
     */
    sharePokemon(pokemon: Pokemon) {
      if (!pokemon.details) return '';
      
      const types = pokemon.details.types.map(t => t.type.name).join(', ');
      const shareText = `Name: ${pokemon.name}, Weight: ${pokemon.details.weight}, Height: ${pokemon.details.height}, Types: ${types}`;
      
      // Log of the information that will be copied to clipboard
      console.log('Attempting to copy to clipboard:', shareText);
      
      /**
       * Attempts to copy text using the modern Clipboard API
       * @returns Promise that resolves to a boolean indicating success
       */
      const copyWithClipboardAPI = () => {
        return navigator.clipboard.writeText(shareText)
          .then(() => {
            console.log('Successfully copied with Clipboard API');
            return true;
          })
          .catch(err => {
            console.error('Error with Clipboard API:', err);
            return false;
          });
      };
      
      /**
       * Attempts to copy text using the legacy document.execCommand method
       * @returns Boolean indicating success
       */
      const copyWithExecCommand = () => {
        try {
          // Create a temporary element
          const textArea = document.createElement('textarea');
          textArea.value = shareText;
          
          // Make sure it's out of view
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          
          // Try to copy the text
          const success = document.execCommand('copy');
          document.body.removeChild(textArea);
          
          if (success) {
            console.log('Successfully copied with execCommand');
            return true;
          } else {
            console.error('execCommand failed without error');
            return false;
          }
        } catch (err) {
          console.error('Error with execCommand:', err);
          return false;
        }
      };
      
      // Try with both methods
      copyWithClipboardAPI().then(success => {
        if (!success) {
          const backupSuccess = copyWithExecCommand();
          if (!backupSuccess) {
            console.error('Could not copy to clipboard with any method');
            // Store in localStorage as a last resort
            localStorage.setItem('lastSharedPokemon', shareText);
            console.log('Saved in localStorage as a last resort');
          }
        }
      });
      
      return shareText;
    }
  }
}); 