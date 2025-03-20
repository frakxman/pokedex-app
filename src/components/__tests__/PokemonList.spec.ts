import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import PokemonList from '../PokemonList.vue'

// Mock de Vue Router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

// Mock de servicios
vi.mock('../../services/pokemonService', () => ({
  fetchPokemonListFromStore: vi.fn().mockResolvedValue([]),
  loadMorePokemonFromStore: vi.fn().mockResolvedValue([]),
  toggleFavoriteInStore: vi.fn()
}))

// Mock de Pinia store
vi.mock('../../stores/pokemonStore', () => ({
  usePokemonStore: () => ({
    getPokemonList: []
  })
}))

describe('PokemonList', () => {
  it('se renderiza correctamente', () => {
    const wrapper = shallowMount(PokemonList)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.search-bar').exists()).toBe(true)
  })
}) 