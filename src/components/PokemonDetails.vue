<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { fetchPokemonDetailsFromStore, toggleFavoriteInStore } from '../services/pokemonService';
import type { Pokemon } from '../interfaces/Pokemon';
import type { PokemonDetails } from '../interfaces/PokemonDetails';
// Importar imágenes
import activeStar from '../assets/images/Active.png';
import disabledStar from '../assets/images/Disabled.png';

// Composición y configuración
const router = useRouter();
const route = useRoute();
const pokemon = ref<Pokemon | null>(null);
const details = ref<PokemonDetails | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const shareStatus = ref('');

// Valores calculados
const formattedTypes = computed(() => {
  if (!details.value?.types) return '';
  return details.value.types
    .map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1))
    .join(', ');
});

const formattedHeight = computed(() => {
  return details.value ? (details.value.height / 10) + 'm' : '';
});

const formattedWeight = computed(() => {
  return details.value ? details.value.weight + 'kg' : '';
});

// Función para generar el texto a compartir
const generateShareText = (): string => {
  if (!pokemon.value || !details.value) return '';
  
  return `Name: ${pokemon.value.name}, Weight: ${formattedWeight.value}, Height: ${formattedHeight.value}, Types: ${formattedTypes.value}`;
};

// Función para copiar texto al portapapeles
const copyToClipboard = (text: string): boolean => {
  try {
    const textInput = document.createElement('input');
    textInput.value = text;
    textInput.style.position = 'absolute';
    textInput.style.left = '-9999px';
    
    document.body.appendChild(textInput);
    textInput.select();
    
    const success = document.execCommand('copy');
    document.body.removeChild(textInput);
    
    return success;
  } catch (error) {
    console.error('Error al copiar:', error);
    return false;
  }
};

// Carga inicial de datos
const loadPokemonDetails = async () => {
  try {
    loading.value = true;
    
    const pokemonData = sessionStorage.getItem('selectedPokemon');
    if (!pokemonData) {
      error.value = 'Pokemon not found';
      return;
    }

    pokemon.value = JSON.parse(pokemonData);
    
    if (pokemon.value) {
      const detailsData = await fetchPokemonDetailsFromStore(pokemon.value.name.toLowerCase());
      details.value = detailsData;
    }
  } catch (err) {
    console.error('Error al cargar los detalles del Pokémon:', err);
    error.value = 'Failed to load Pokémon details';
  } finally {
    loading.value = false;
  }
};

// Acciones de usuario
const toggleFavoriteStatus = (event: Event) => {
  event.stopPropagation();
  if (pokemon.value) {
    // Llamar a la función del store y actualizar el estado local
    const updatedPokemon = toggleFavoriteInStore(pokemon.value);
    
    // Actualizar el estado local para reflejar el cambio inmediatamente
    if (updatedPokemon) {
      pokemon.value = { ...updatedPokemon };
    }
  }
};

const handleShare = () => {
  const shareText = generateShareText();
  if (shareText && copyToClipboard(shareText)) {
    showShareConfirmation();
  }
};

const showShareConfirmation = () => {
  shareStatus.value = 'copied';
  setTimeout(() => {
    shareStatus.value = '';
  }, 2000);
};

const closeModal = () => {
  router.back();
};

// Inicialización
onMounted(loadPokemonDetails);
</script>

<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <!-- Botón cerrar -->
      <button class="close-button" @click="closeModal">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
        </svg>
      </button>
      
      <!-- Mostrar carga -->
      <div v-if="loading" class="loading">
        <p>Loading...</p>
      </div>
      
      <!-- Mostrar error -->
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>
      
      <!-- Mostrar detalles cuando estén disponibles -->
      <div v-else-if="pokemon && details" class="pokemon-details">
        <!-- Imagen del Pokémon -->
        <div class="pokemon-image">
          <img 
            :src="details.sprites.other['official-artwork'].front_default" 
            :alt="pokemon.name" 
          />
        </div>
        
        <!-- Información del Pokémon -->
        <div class="pokemon-info">
          <div class="info-item">
            <h2>Name: {{ pokemon.name }}</h2>
          </div>
          
          <div class="info-item">
            <p>Weight: {{ formattedWeight }}</p>
          </div>
          
          <div class="info-item">
            <p>Height: {{ formattedHeight }}</p>
          </div>
          
          <div class="info-item">
            <p>Types: {{ formattedTypes }}</p>
          </div>
        </div>
        
        <!-- Acciones -->
        <div class="action-buttons">
          <button class="share-button" @click="handleShare">
            Share to my friends
            <span v-if="shareStatus === 'copied'" class="share-confirmation">Copied!</span>
          </button>
          <span 
            class="favorite-button" 
            :class="{ active: pokemon.favorite }"
            @click="toggleFavoriteStatus($event)"
          >
            <img 
              :src="pokemon.favorite ? activeStar : disabledStar" 
              alt="Favorite" 
              class="star-img"
            />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  position: relative;
  width: 85%;
  max-width: 400px;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  z-index: 10;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.loading, .error {
  padding: 40px;
  text-align: center;
  color: #666;
}

.pokemon-details {
  display: flex;
  flex-direction: column;
}

.pokemon-image {
  width: 100%;
  height: 250px;
  background-image: url('../assets/images/pokemonBack.png');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pokemon-image img {
  max-width: 200px;
  max-height: 200px;
  object-fit: contain;
}

.pokemon-info {
  padding: 15px 20px;
}

.info-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item h2 {
  font-size: 20px;
  margin: 0;
  color: #333;
  font-weight: 500;
}

.info-item p {
  font-size: 16px;
  margin: 0;
  color: #555;
}

.action-buttons {
  display: flex;
  align-items: center;
  padding: 10px 20px 20px;
  justify-content: space-between;
}

.share-button {
  position: relative;
  background-color: #f33;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  flex-grow: 1;
  margin-right: 15px;
  overflow: hidden;
}

.share-confirmation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeInOut 2s forwards;
}

@keyframes fadeInOut {
  0% { opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
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

@media (min-width: 768px) {
  .modal-container {
    max-width: 500px;
  }
  
  .pokemon-image {
    height: 300px;
  }
  
  .pokemon-image img {
    max-width: 250px;
    max-height: 250px;
  }
}

@media (min-width: 1024px) {
  .modal-container {
    max-width: 550px;
  }
  
  .pokemon-info {
    padding: 20px 25px;
  }
  
  .info-item h2 {
    font-size: 22px;
  }
  
  .info-item p {
    font-size: 18px;
  }
}

@media (min-width: 1400px) {
  .modal-container {
    max-width: 600px;
  }
}

/* Remove the share section styles */
.share-section, 
.share-info, 
.share-text, 
.share-actions, 
.copy-button {
  display: none;
}
</style>
