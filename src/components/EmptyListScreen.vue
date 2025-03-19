<script setup lang="ts">
import { useRouter } from 'vue-router'

// const emit = defineEmits(['go-back'])
const router = useRouter()

const goToWelcomeScreen = () => {
  // emit('go-back')
  router.push('/')
}
</script>

<template>
  <div class="empty-screen">
    <div class="search-container">
      <div class="search-bar">
        <input type="text" placeholder="asdfdsf" disabled />
      </div>
    </div>
    
    <div class="content">
      <h2 class="title">Uh-oh!</h2>
      <p class="subtitle">You look lost on your journey!</p>
      <button class="reset-button" @click="goToWelcomeScreen">Go back home</button>
    </div>
  </div>
</template>

<style scoped>
.empty-screen {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: white;
}

.search-container {
  padding: 15px;
  background-color: white;
  border-bottom: 1px solid #eee;
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
  color: #333;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 20px;
  flex: 1;
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
  background-color: #f33;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  font-size: 15px;
  cursor: pointer;
  font-weight: 500;
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
</style> 