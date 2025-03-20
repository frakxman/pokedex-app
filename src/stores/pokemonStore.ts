import { defineStore } from 'pinia';
import type { Pokemon } from '../interfaces/Pokemon';
import { fetchPokemonList as fetchPokemonListService, 
         fetchPokemonDetails as fetchPokemonDetailsService,
         loadMorePokemon as loadMorePokemonService } from '../services/pokemonService';

// Store to handle global Pokemon state using Pinia
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
    
    // Function to load more Pokemon
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
    
    // Copy Pokemon information to clipboard
    sharePokemon(pokemon: Pokemon) {
      if (!pokemon.details) return '';
      
      const types = pokemon.details.types.map(t => t.type.name).join(', ');
      const shareText = `Name: ${pokemon.name}, Weight: ${pokemon.details.weight}, Height: ${pokemon.details.height}, Types: ${types}`;
      
      // Log of the information that will be copied to clipboard
      console.log('Attempting to copy to clipboard:', shareText);
      
      // Main method using Clipboard API
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
      
      // Fallback method using document.execCommand (old method)
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