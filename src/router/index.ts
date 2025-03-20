// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WelcomeScreen from '../components/WelcomeScreen.vue'
import LoadingScreen from '../components/LoadingScreen.vue'
import EmptyListScreen from '../components/EmptyListScreen.vue'
import PokemonList from '../components/PokemonList.vue'
import FavoritesList from '../components/FavoritesList.vue'
import PokemonDetails from '../components/PokemonDetails.vue'
import NotFoundScreen from '../components/NotFoundScreen.vue'

const routes = [
  {
    path: '/',
    component: WelcomeScreen,
    meta: { transition: 'slide-left' }
  },
  {
    path: '/loading',
    component: LoadingScreen,
    meta: { transition: 'fade' }
  },
  {
    path: '/empty',
    component: EmptyListScreen,
    meta: { transition: 'fade' }
  },
  {
    path: '/list',
    component: PokemonList,
    meta: { transition: 'slide-left' }
  },
  {
    path: '/favorites',
    component: FavoritesList,
    meta: { transition: 'slide-right' }
  },
  {
    path: '/pokemon/:id',
    component: PokemonDetails,
    meta: { 
      transition: 'fade',
      modal: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFoundScreen,
    meta: { transition: 'fade' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Restore scroll position when navigating
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
