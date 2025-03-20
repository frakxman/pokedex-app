<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { 
  fetchPokemonListFromStore, 
  loadMorePokemonFromStore, 
  toggleFavoriteInStore 
} from '../services/pokemonService';
import type { Pokemon } from '../interfaces/Pokemon';
import { usePokemonStore } from '../stores/pokemonStore';
import EmptyListScreen from './EmptyListScreen.vue';
// Import images
import activeStar from '../assets/images/Active.png';
import disabledStar from '../assets/images/Disabled.png';

const emit = defineEmits(['select-pokemon', 'show-favorites', 'show-empty']);

// Access the store directly
const pokemonStore = usePokemonStore();

// Router for navigation
const router = useRouter();

// State for Pokemon list
const searchQuery = ref('');
const loading = ref(false);
const loadingMore = ref(false);
const hasMorePokemon = ref(true);

// Get the Pokemon list
const pokemonList = computed(() => pokemonStore.getPokemonList);

// Filter Pokemon by search
const filteredList = computed(() => {
  if (!searchQuery.value) {
    return pokemonList.value;
  } else {
    const query = searchQuery.value.toLowerCase();
    return pokemonList.value.filter(pokemon =>
      pokemon.name.toLowerCase().includes(query)
    );
  }
});

// Check if search has no results
const hasNoResults = computed(() => {
  return searchQuery.value !== '' && filteredList.value.length === 0;
});

// Load more Pokemon (with button)
const loadMorePokemonHandler = async () => {
  if (loadingMore.value) return;
  
  loadingMore.value = true;
  try {
    const previousLength = pokemonList.value.length;
    await loadMorePokemonFromStore();
    
    // If after loading more, the length hasn't changed,
    // it means there are no more Pokemon to load
    if (pokemonList.value.length === previousLength) {
      hasMorePokemon.value = false;
    }
  } catch (error) {
    console.error('Error loading more Pokemon:', error);
  } finally {
    loadingMore.value = false;
  }
};

// Function to toggle favorites
const togglePokemonFavorite = (pokemon: Pokemon, event: Event) => {
  event.stopPropagation();
  toggleFavoriteInStore(pokemon);
};

// Clear search
const resetSearch = () => {
  searchQuery.value = '';
};

// Add this function that's missing
const handleSearchChange = () => {
  // This function is called when the user types in the search field
  console.log('Search query changed:', searchQuery.value);
};

// Function to select a Pokemon
const selectPokemon = (pokemon: Pokemon) => {
  // Save the Pokemon in the store or sessionStorage for access from the details page
  sessionStorage.setItem('selectedPokemon', JSON.stringify(pokemon));
  router.push(`/pokemon/${pokemon.id}`);
};

// Show favorites
const showFavorites = () => {
  router.push('/favorites');
};

// Function to scroll to the top of the list
const scrollToTop = () => {
  try {
    // Get the first element of the list
    const firstElement = document.querySelector('.search-container');
    if (firstElement) {
      firstElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    } else {
      // As a fallback, use the traditional method
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    
    // Additional fallback in case the smooth scroll fails
    setTimeout(() => {
      if (window.scrollY > 10) {
        window.scrollTo(0, 0);
      }
    }, 600);
  } catch (error) {
    // Final fallback method if there's any error
    console.error('Error in scrollToTop:', error);
    window.scrollTo(0, 0);
  }
};

// Load the first page of Pokemon
onMounted(async () => {
  try {
    loading.value = true;
    await fetchPokemonListFromStore();
  } catch (error) {
    console.error('Error loading Pokemon list:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="list-container">
    <div class="search-container">
      <div class="search-bar">
        <input 
          type="text" 
          placeholder="Search" 
          v-model="searchQuery"
          @input="handleSearchChange"
        />
      </div>
    </div>
    
    <!-- Show no results message -->
    <div v-if="hasNoResults" class="empty-content">
      <h2 class="title">Uh-oh!</h2>
      <p class="subtitle">You look lost on your journey!</p>
      <button class="reset-button" @click="resetSearch">Go back home</button>
    </div>
    
    <!-- Show loading indicator -->
    <div v-else-if="loading" class="loading-indicator">
      <p>Loading Pokémon...</p>
    </div>
    
    <!-- Show the Pokemon list when loaded -->
    <div v-else class="pokemon-list">
      <button 
        v-for="pokemon in filteredList" 
        :key="pokemon.id" 
        class="pokemon-item"
        @click="selectPokemon(pokemon)"
      >
        <span class="pokemon-name">{{ pokemon.name }}</span>
        <span 
          class="favorite-button" 
          :class="{ active: pokemon.favorite }"
          @click.stop="togglePokemonFavorite(pokemon, $event)"
        >
          <img 
            :src="pokemon.favorite ? activeStar : disabledStar" 
            alt="Favorite" 
            class="star-img"
          />
        </span>
      </button>
      
      <!-- Loading indicator for more Pokemon -->
      <div v-if="loadingMore" class="load-more-indicator">
        <p>Loading more Pokémon...</p>
      </div>
      
      <!-- Navigation buttons at the end of the list -->
      <div class="navigation-buttons" v-if="!searchQuery">
        <button 
          v-if="!loadingMore && hasMorePokemon" 
          @click="loadMorePokemonHandler" 
          class="nav-button load-more-button"
          title="Load more pokemones"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        
        <button 
          @click="scrollToTop" 
          class="nav-button scroll-top-button"
          title="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Fixed footer with buttons -->
    <div class="footer">
      <div class="filter-buttons">
        <button class="filter-button all-button active">
          <svg class="list-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12">
            <path fill="currentColor" d="M0 0h16v2H0zM0 5h16v2H0zM0 10h16v2H0z"/>
          </svg>
          All
        </button>
        <button class="filter-button favorites-button" @click="showFavorites">
          <img 
            src="../assets/images/Disabled.png" 
            alt="Favorite" 
            class="filter-star-img" 
          />
          Favorites
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-container {
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 0;
  min-height: 100vh;
  padding-bottom: 70px;
  position: relative;
}

.search-container {
  padding: 15px;
  background-color: white;
}

.search-bar {
  position: relative;
}

.search-bar input {
  width: 100%;
  padding: 12px 15px 12px 40px;
  border-radius: 25px;
  border: 1px solid #ddd;
  font-size: 15px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23999' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 15px center;
  background-size: 16px;
}

.loading-indicator, .load-more-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  color: #666;
  background-color: white;
}

/* Pokemon list in vertical format */
.pokemon-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 10px;
  gap: 8px;
  background-color: white;
  padding-bottom: 120px;
}

/* Each Pokemon element is a complete button */
.pokemon-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: white;
  border: none;
  border-radius: 8px;
  padding: 15px;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.pokemon-name {
  font-size: 18px;
  color: #333;
  font-weight: 500;
  flex: 1;
}

.favorite-button {
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
}

.star-img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 15px 15px;
  background-color: white;
  box-shadow: 0 -2px 5px rgba(0,0,0,0.1);
  z-index: 100;
  width: 100%;
}

.filter-buttons {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  max-width: 582px;
  margin: 0 auto;
}

.filter-button {
  flex: 1;
  padding: 18px 0;
  border-radius: 25px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: white;
  transition: all 0.3s ease;
}

.all-button {
  background-color: #F22539;
}

.favorites-button {
  background-color: #757575;
}

.all-button.inactive {
  background-color: #757575;
}

.favorites-button.active {
  background-color: #F22539;
}

.list-icon {
  width: 16px;
  height: 12px;
  margin-right: 10px;
}

.filter-star-img {
  width: 18px;
  height: 18px;
  margin-right: 10px;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 20px;
  background-color: white;
  height: 70vh;
}

.title {
  font-size: 26px;
  color: #333;
  font-weight: 500;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.reset-button {
  background-color: #F22539;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 28px;
  font-size: 15px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.reset-button:hover {
  background-color: #E01B2F;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.reset-button:active {
  transform: translateY(1px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.load-more-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  color: #666;
  background-color: white;
  padding: 10px 0;
  margin: 5px 0;
  width: 100%;
  font-weight: bold;
}

.scroll-sentinel {
  display: none;
}

.navigation-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 1.5rem 0;
  position: static;
  z-index: 99;
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.nav-button svg {
  width: 20px;
  height: 20px;
}

.load-more-button {
  background-color: #F22539;
}

.scroll-top-button {
  background-color: #3663AD;
}

.nav-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
}

.nav-button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* Media queries for tablets */
@media (min-width: 768px) {
  .list-container {
    max-width: 100%;
    padding-bottom: 80px;
  }
  
  .pokemon-list {
    padding: 15px;
    gap: 10px;
  }
  
  .pokemon-item {
    padding: 18px;
  }
  
  .footer {
    padding: 15px;
  }
}

/* Media queries for desktops */
@media (min-width: 1024px) {
  .list-container {
    max-width: 582px;
    margin: 0 auto;
  }
  
  .pokemon-list {
    padding: 20px;
    gap: 12px;
    padding-bottom: 120px;
  }
  
  .pokemon-name {
    font-size: 18px;
  }
  
  .filter-button {
    padding: 20px 0;
  }
}

/* Media queries for large screens */
@media (min-width: 1400px) {
  .list-container {
    max-width: 582px;
  }
}
</style>
