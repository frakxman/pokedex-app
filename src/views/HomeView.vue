<script setup lang="ts">
import { ref, provide } from 'vue'
import WelcomeScreen from '../components/WelcomeScreen.vue'
import LoadingScreen from '../components/LoadingScreen.vue'
import EmptyListScreen from '../components/EmptyListScreen.vue'
import PokemonList from '../components/PokemonList.vue'
import FavoritesList from '../components/FavoritesList.vue'
import PokemonDetails from '../components/PokemonDetails.vue'
import NotFoundScreen from '../components/NotFoundScreen.vue'

// State to control which screen to show
const currentScreen = ref('welcome') // welcome, loading, emptyList, list, favList, details
const selectedPokemon = ref(null)

// Function to change screen
const changeScreen = (screen: string) => {
  currentScreen.value = screen
}

// Function to select a Pokemon to view its details
const selectPokemon = (pokemon: any) => {
  selectedPokemon.value = pokemon
  changeScreen('details')
}

// Function to get the screen number for the header
const getScreenNumber = () => {
  const screenMap: Record<string, number> = {
    'welcome': 1,
    'loading': 2,
    'emptyList': 3,
    'list': 4,
    'favList': 5,
    'details': 6
  }
  return screenMap[currentScreen.value]
}

// Function to get the screen title for the header
const getScreenTitle = () => {
  const titleMap: Record<string, string> = {
    'welcome': 'Welcome',
    'loading': 'Loading',
    'emptyList': 'EmptyList',
    'list': 'List',
    'favList': 'FavList',
    'details': 'Details'
  }
  return titleMap[currentScreen.value]
}

const showAllPokemon = () => {
  currentScreen.value = 'list'
}

const showFavorites = () => {
  currentScreen.value = 'favList'
}

const goBack = () => {
  currentScreen.value = 'list'
}

// Provide the changeScreen function to make it accessible by child components
provide('changeScreen', changeScreen);
</script>

<template>
  <main>
    <div class="screen-container">
      <WelcomeScreen v-if="currentScreen === 'welcome'" @start="changeScreen('loading')" />
      <LoadingScreen v-else-if="currentScreen === 'loading'" @loaded="changeScreen('list')" />
      <EmptyListScreen v-else-if="currentScreen === 'emptyList'" @go-back="changeScreen('welcome')" />
      <PokemonList 
        v-else-if="currentScreen === 'list'" 
        @select-pokemon="selectPokemon" 
        @show-favorites="showFavorites"
      />
      <FavoritesList 
        v-else-if="currentScreen === 'favList'" 
        @select-pokemon="selectPokemon" 
        @show-all="showAllPokemon"
      />
      <PokemonDetails 
        v-else-if="currentScreen === 'details'" 
        :pokemon="selectedPokemon"
        @close="goBack"
      />
      <NotFoundScreen v-else-if="currentScreen === 'notFound'" @go-back="changeScreen('list')" />
    </div>
  </main>
</template>

<style scoped>
main {
  max-width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background-color: white;
  width: 100vw;
  overflow-x: hidden;
  position: relative;
}

.screen-container {
  position: relative;
  width: 100%;
  background-color: white;
  min-height: 100vh;
  overflow: visible;
}

/* Media queries for tablets and larger devices */
@media (min-width: 768px) {
  main {
    background-color: white;
    padding: 0;
  }
  
  .screen-container {
    width: 100%;
    max-width: 582px;
    border-radius: 0;
    overflow: visible;
    margin: 0 auto;
    min-height: 100vh;
  }
}

/* Media queries for desktops */
@media (min-width: 1024px) {
  main {
    background-color: white;
    align-items: flex-start;
    justify-content: center;
    height: 100vh;
  }
  
  .screen-container {
    width: 100%;
    max-width: 582px;
    min-height: 100vh;
    margin: 0 auto;
    padding-top: 20px;
  }
}

/* Media queries for large screens */
@media (min-width: 1400px) {
  .screen-container {
    max-width: 582px; /* Keep the same maximum width */
  }
}
</style>
