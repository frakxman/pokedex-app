<script setup lang="ts">
import { useRoute } from 'vue-router'
import { watch, ref, computed } from 'vue'

// State for the current transition
const route = useRoute()
const transitionName = ref('fade')

// Determine if the current route is a modal
const isModal = computed(() => route.meta.modal === true)

// Update the transition when the route changes
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
/* Global styles for transitions */
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

/* Media queries to maintain responsive styles */
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
