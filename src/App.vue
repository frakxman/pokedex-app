<script setup lang="ts">
import { useRoute } from 'vue-router'
import { watch, ref, computed } from 'vue'

// Estado para la transición actual
const route = useRoute()
const transitionName = ref('fade')

// Determinar si la ruta actual es un modal
const isModal = computed(() => route.meta.modal === true)

// Actualizar la transición cuando cambia la ruta
watch(
  () => route.meta.transition as string,
  (newTransition) => {
    transitionName.value = newTransition || 'fade'
  },
  { immediate: true }
)
</script>

<template>
  <RouterView v-slot="{ Component }">
    <transition :name="transitionName" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </RouterView>
</template>

<style>
/* Estilos globales para transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-out;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Media queries para mantener los estilos responsivos */
@media (min-width: 768px) {
  body {
    background-color: white;
  }
}

@media (min-width: 1024px) {
  body {
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
}
</style>
