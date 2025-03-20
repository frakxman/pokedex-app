<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchPokemonList } from '../services/pokemonService';

// We no longer need to emit events
// const emit = defineEmits(['loaded']);
const router = useRouter();

onMounted(async () => {
  try {
    // Load data in the background
    await fetchPokemonList();
    // Go to the Pokemon list using the router
    setTimeout(() => {
      // emit('loaded');
      router.push('/list');
    }, 2500);
  } catch (error) {
    console.error('Error loading Pokemon list:', error);
    setTimeout(() => {
      // emit('loaded');
      router.push('/list');
    }, 2500);
  }
});
</script>

<template>
  <div class="loading-container">
    <div class="loading-content">
      <div class="pokeball">
        <div class="pokeball-top"></div>
        <div class="pokeball-middle"></div>
        <div class="pokeball-bottom"></div>
        <div class="pokeball-center"></div>
      </div>
      <p class="loading-text">Loading Pokémons...</p>
    </div>
  </div>
</template>

<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(245, 245, 245, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.pokeball {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  animation: 
    spin 1.5s linear infinite,
    grow 2.5s ease-in-out forwards;
  transform-origin: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.pokeball-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background-color: #f33;
}

.pokeball-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.pokeball-middle {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #333;
  transform: translateY(-50%);
  z-index: 2;
}

.pokeball-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  background-color: white;
  border: 3px solid #333;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  animation: pulse 1s infinite alternate;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.pokeball-center::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background-color: #ccc;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.loading-text {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-top: 50px;
}

@keyframes spin {
  0% { transform: rotate(0deg) scale(0.8); }
  100% { transform: rotate(360deg) scale(0.8); }
}

@keyframes grow {
  0% { transform: rotate(0deg) scale(0.8); }
  30% { transform: rotate(360deg) scale(0.8); }
  90% { transform: rotate(1080deg) scale(1.75); }
  100% { transform: rotate(1080deg) scale(1.75); }
}

@keyframes pulse {
  from { background-color: #ccc; }
  to { background-color: #fff; }
}

@media (min-width: 1024px) {
  .pokeball {
    width: 100px;
    height: 100px;
  }
}

@media (min-width: 1400px) {
  .pokeball {
    width: 120px;
    height: 120px;
  }
}
</style>
