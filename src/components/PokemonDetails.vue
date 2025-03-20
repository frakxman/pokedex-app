<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { fetchPokemonDetailsFromStore, toggleFavoriteInStore } from '../services/pokemonService';
import type { Pokemon } from '../interfaces/Pokemon';
import type { PokemonDetails } from '../interfaces/PokemonDetails';
// Import images
import activeStar from '../assets/images/Active.png';
import disabledStar from '../assets/images/Disabled.png';

// Composition and configuration
const router = useRouter();
const route = useRoute();
const pokemon = ref<Pokemon | null>(null);
const details = ref<PokemonDetails | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const shareStatus = ref('');

// Computed values
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

// Function to generate text to share
const generateShareText = (): string => {
  if (!pokemon.value || !details.value) return '';
  
  return `Name: ${pokemon.value.name}, Weight: ${formattedWeight.value}, Height: ${formattedHeight.value}, Types: ${formattedTypes.value}`;
};

// Function to copy text to clipboard - simplified
const copyToClipboard = (text: string): boolean => {
  try {
    // Try the modern Clipboard API first 
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback to legacy method
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    } catch (err) {
      document.body.removeChild(textArea);
      console.error('Error with execCommand:', err);
      return false;
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

// Function to copy Pokemon information to clipboard - simplified
const sharePokemon = () => {
  try {
    const textToShare = generateShareText();
    const success = copyToClipboard(textToShare);
    
    // Show success/failure message
    shareStatus.value = success ? 'Copied to clipboard!' : 'Failed to copy!';
    
    // Clear message after a delay
    setTimeout(() => {
      shareStatus.value = '';
    }, 2000);
  } catch (error) {
    console.error('Copy operation failed:', error);
    shareStatus.value = 'Copy failed';
    setTimeout(() => {
      shareStatus.value = '';
    }, 2000);
  }
};

// Function to toggle favorite
const toggleFavorite = () => {
  if (pokemon.value) {
    const updatedPokemon = toggleFavoriteInStore(pokemon.value);
    pokemon.value = { ...updatedPokemon };
  }
};

// Function to go back
const goBack = () => {
  router.go(-1);
};

// Initialization
onMounted(async () => {
  loading.value = true;
  try {
    const pokemonId = route.params.id as string;
    
    // Try to get from sessionStorage first
    const storedPokemon = sessionStorage.getItem('selectedPokemon');
    if (storedPokemon) {
      try {
        const parsedPokemon = JSON.parse(storedPokemon);
        if (parsedPokemon.id.toString() === pokemonId || parsedPokemon.name.toLowerCase() === pokemonId.toLowerCase()) {
          pokemon.value = parsedPokemon;
        }
      } catch (e) {
        console.error('Error parsing stored Pokemon:', e);
      }
    }
    
    // Fetch details in any case
    const fetchedDetails = await fetchPokemonDetailsFromStore(pokemonId);
    details.value = fetchedDetails;
    
    loading.value = false;
  } catch (err) {
    error.value = 'Error loading Pokemon details';
    loading.value = false;
    console.error('Error in component:', err);
  }
});
</script>

<template>
  <div class="modal-overlay" @click="goBack">
    <div class="modal-container" @click.stop>
      <!-- Close button -->
      <button class="close-button" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
        </svg>
      </button>
      
      <!-- Show loading -->
      <div v-if="loading" class="loading">
        <p>Loading...</p>
      </div>
      
      <!-- Show error -->
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>
      
      <!-- Show details when available -->
      <div v-else-if="pokemon && details" class="pokemon-details">
        <!-- Pokemon image -->
        <div class="pokemon-image">
          <img 
            :src="details.sprites.other['official-artwork'].front_default" 
            :alt="pokemon.name" 
          />
        </div>
        
        <!-- Pokemon information -->
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
        
        <!-- Actions -->
        <div class="action-buttons">
          <button class="share-button" @click="sharePokemon">
            Copy to clipboard
            <span v-if="shareStatus" class="share-confirmation">{{ shareStatus }}</span>
          </button>
          <span 
            class="favorite-button" 
            :class="{ active: pokemon.favorite }"
            @click="toggleFavorite"
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
  font-size: 14px;
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
