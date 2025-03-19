<script setup lang="ts">
import { useRouter } from 'vue-router'

// const emit = defineEmits(['go-back'])
const router = useRouter()

const goToList = () => {
  // emit('go-back')
  router.push('/list')
}
</script>

<template>
  <div class="not-found-screen">
    <div class="content">
      <h2 class="title">Uh-oh!</h2>
      <p class="subtitle">You look lost on your journey!</p>
      <button class="home-button" @click="goToList">Go back home</button>
    </div>
  </div>
</template>

<style scoped>
.not-found-screen {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: white;
  align-items: center;
  justify-content: center;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  width: 100%;
  max-width: 400px;
}

.title {
  font-size: 32px;
  color: #333;
  font-weight: 600;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 18px;
  color: #666;
  margin-bottom: 35px;
}

.home-button {
  background-color: #f33;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 30px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 500;
}
</style> 