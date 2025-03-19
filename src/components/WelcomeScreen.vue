<script setup lang="ts">
// import { defineEmits } from 'vue' // Ya no necesitamos emits
import { useRouter } from 'vue-router'

// const emit = defineEmits(['start']) // Reemplazado por router

const router = useRouter()

const startPokemonJourney = () => {
  // emit('start') // Reemplazado por navigate
  router.push('/loading')
}
</script>

<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <div class="pikachu-container">
        <img src="../assets/images/Ellipse10.png" alt="Circle background" class="ellipse-image" />
        <img src="../assets/images/pikachu.png" alt="Pikachu" class="pikachu-image" />
      </div>
      
      <h1>Welcome to Pokédex</h1>
      
      <p class="welcome-text">
        The digital encyclopedia created by<br>
        Professor Oak is an invaluable tool to<br>
        Trainers in the Pokémon world.
      </p>
      
      <button class="start-button" @click="startPokemonJourney">Get started</button>
    </div>
  </div>
</template>

<style scoped>
.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background-color: white;
}

.welcome-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  max-width: 400px;
  padding: 40px 20px;
}

.pikachu-container {
  position: relative;
  width: 150px;
  height: 150px;
  margin-bottom: 40px;
}

.ellipse-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.pikachu-image {
  position: absolute;
  top: -25%;
  left: -20%;
  width: 150%;
  height: 130%;
  z-index: 2;
}

h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.welcome-text {
  color: #666;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 40px;
}

.start-button {
  background-color: #f33;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 10px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 500;
}

.start-button:hover {
  background-color: #e22;
}

/* Media queries para pantallas más grandes */
@media (min-width: 768px) {
  .welcome-content {
    max-width: 500px;
  }
}

@media (min-width: 1024px) {
  .welcome-content {
    max-width: 600px;
  }
  
  .pikachu-container {
    width: 180px;
    height: 180px;
    margin-bottom: 50px;
  }
  
  h1 {
    font-size: 28px;
    margin-bottom: 24px;
  }
  
  .welcome-text {
    font-size: 16px;
    margin-bottom: 50px;
  }
  
  .start-button {
    padding: 12px 30px;
    font-size: 18px;
  }
}

@media (min-width: 1400px) {
  .welcome-content {
    max-width: 700px;
  }
  
  .pikachu-container {
    width: 200px;
    height: 200px;
  }
}
</style> 