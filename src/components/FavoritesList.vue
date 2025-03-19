<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { toggleFavoriteInStore } from '../services/pokemonService';
import type { Pokemon } from '../interfaces/Pokemon';
import { usePokemonStore } from '../stores/pokemonStore';
import EmptyListScreen from './EmptyListScreen.vue';
import NotFoundScreen from './NotFoundScreen.vue';
// Importar imágenes
import activeStar from '../assets/images/Active.png';
import disabledStar from '../assets/images/Disabled.png';

const emit = defineEmits(['select-pokemon', 'show-all']);

// Acceder al store directamente
const pokemonStore = usePokemonStore();

// Router para navegación
const router = useRouter();

// Estado para la lista de favoritos
const searchQuery = ref('');
const loading = ref(false);

// Obtener la lista de favoritos del store
const favorites = computed(() => pokemonStore.getFavorites);

// Filtrar favoritos por búsqueda
const filteredFavorites = computed(() => {
  if (!searchQuery.value) {
    return favorites.value;
  } else {
    const query = searchQuery.value.toLowerCase();
    return favorites.value.filter(pokemon =>
      pokemon.name.toLowerCase().includes(query)
    );
  }
});

// Computar si no hay favoritos
const hasFavorites = computed(() => favorites.value.length > 0);

// Verificar si la búsqueda no tiene resultados
const hasNoResults = computed(() => {
  return searchQuery.value !== '' && filteredFavorites.value.length === 0;
});

// Función para alternar favorito
const togglePokemonFavorite = (pokemon: Pokemon, event: Event) => {
  event.stopPropagation();
  toggleFavoriteInStore(pokemon);
};

// Función para mostrar todos los Pokémon
const showAll = () => {
  router.push('/list');
};

// Función para seleccionar un Pokémon para ver sus detalles
const selectPokemon = (pokemon: Pokemon) => {
  sessionStorage.setItem('selectedPokemon', JSON.stringify(pokemon));
  router.push(`/pokemon/${pokemon.id}`);
};

// Limpiar búsqueda
const resetSearch = () => {
  searchQuery.value = '';
};
</script>

<template>
  <div class="favorites-container">
    <div class="search-container">
      <div class="search-bar">
        <input 
          type="text" 
          placeholder="Search" 
          v-model="searchQuery"
        />
      </div>
    </div>
    
    <!-- Mostrar mensaje de no resultados de búsqueda -->
    <div v-if="hasNoResults" class="empty-content">
      <h2 class="title">Uh-oh!</h2>
      <p class="subtitle">You look lost on your journey!</p>
      <button class="reset-button" @click="resetSearch">Go back home</button>
    </div>
    
    <!-- Mostrar mensaje de no favoritos -->
    <div v-else-if="!hasFavorites">
      <NotFoundScreen @go-back="showAll" />
    </div>
    
    <!-- Mostrar indicador de carga -->
    <div v-else-if="loading" class="loading-indicator">
      <p>Loading favorites...</p>
    </div>
    
    <!-- Mostrar la lista de favoritos -->
    <div v-else class="pokemon-list">
      <button 
        v-for="pokemon in filteredFavorites" 
        :key="pokemon.id" 
        class="pokemon-item"
        @click="selectPokemon(pokemon)"
      >
        <span class="pokemon-name">{{ pokemon.name }}</span>
        <span 
          class="favorite-button active" 
          @click.stop="togglePokemonFavorite(pokemon, $event)"
        >
          <img 
            :src="activeStar" 
            alt="Favorite" 
            class="star-img"
          />
        </span>
      </button>
    </div>
    
    <!-- Footer fijo con botones -->
    <div class="footer">
      <div class="filter-buttons">
        <button class="filter-button all-button" @click="showAll">
          <svg class="list-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12">
            <path fill="currentColor" d="M0 0h16v2H0zM0 5h16v2H0zM0 10h16v2H0z"/>
          </svg>
          All
        </button>
        <button class="filter-button favorites-button active">
          <img 
            :src="activeStar" 
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
.favorites-container {
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

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  color: #666;
  background-color: white;
}

/* Lista de Pokémon en formato vertical */
.pokemon-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  gap: 8px;
  background-color: white;
  min-height: calc(100vh - 150px);
}

/* Cada elemento Pokémon es un botón completo */
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
  border-radius: 30px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: white;
}

.all-button {
  background-color: #bbb;
}

.favorites-button {
  background-color: #f33;
}

.all-button.active {
  background-color: #f33;
}

.favorites-button.inactive {
  background-color: #bbb;
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

/* Estilos para pantalla vacía */
.empty-content, .not-found-content {
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

.not-found-title {
  font-size: 32px;
  font-weight: 600;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.not-found-subtitle {
  font-size: 18px;
  margin-bottom: 35px;
}

.reset-button, .home-button {
  background-color: #f33;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  font-size: 15px;
  cursor: pointer;
  font-weight: 500;
}

.home-button {
  padding: 12px 30px;
  font-size: 16px;
}

/* Media queries para mantener la compatibilidad con pantallas grandes */
@media (min-width: 768px) {
  .favorites-container {
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

@media (min-width: 1024px) {
  .favorites-container {
    max-width: 582px;
    margin: 0 auto;
  }
  
  .pokemon-list {
    padding: 20px;
    gap: 12px;
    padding-bottom: 100px;
  }
  
  .pokemon-name {
    font-size: 18px;
  }
  
  .filter-button {
    padding: 20px 0;
  }
}

@media (min-width: 1400px) {
  .favorites-container {
    max-width: 582px;
  }
}
</style>
