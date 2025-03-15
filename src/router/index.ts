// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from '../views/WelcomeView.vue'
import ListView from '../views/ListView.vue'
import FavoritesView from '../views/FavoritesView.vue'
import DetailView from '../views/DetailView.vue'
import ErrorView from '../views/ErrorView.vue'

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: WelcomeView
  },
  {
    path: '/list',
    name: 'list',
    component: ListView
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: FavoritesView
  },
  {
    path: '/pokemon/:id',
    name: 'detail',
    component: DetailView
  },
  {
    path: '/error',
    name: 'error',
    component: ErrorView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
