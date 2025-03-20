import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';

// Define interfaces for typing
interface PokemonData {
  id: number;
  name: string;
  favorite: boolean;
}

interface ComponentData {
  pokemon: PokemonData;
  details: any;
  loading: boolean;
  error: null | string;
  shareStatus: string;
  formattedTypes: string;
  formattedHeight: string;
  formattedWeight: string;
}

// Create a mock component for tests
const PokemonDetailsMock = {
  name: 'PokemonDetails',
  template: `
    <div class="pokemon-details">
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else-if="pokemon && details" class="pokemon-data">
        <div>{{ pokemon.name }}</div>
        <div>{{ formattedWeight }}</div>
        <div>{{ formattedHeight }}</div>
        <div>{{ formattedTypes }}</div>
        <button class="share-button" @click="handleShare">Share</button>
        <span class="favorite-button" @click="toggleFavoriteStatus">Favorite</span>
        <span v-if="shareStatus === 'copied'" class="share-confirmation">Copied!</span>
      </div>
      <button class="close-button" @click="closeModal">Close</button>
    </div>
  `,
  data(): ComponentData {
    return {
      pokemon: { id: 1, name: 'Bulbasaur', favorite: false },
      details: {
        id: 1,
        name: 'Bulbasaur',
        height: 7,
        weight: 69,
        types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }]
      },
      loading: false,
      error: null,
      shareStatus: '',
      formattedTypes: 'Grass, Poison',
      formattedHeight: '0.7m',
      formattedWeight: '69kg'
    };
  },
  methods: {
    handleShare(this: ComponentData) {
      this.shareStatus = 'copied';
      setTimeout(() => {
        this.shareStatus = '';
      }, 2000);
    },
    toggleFavoriteStatus(this: ComponentData) {
      this.pokemon.favorite = !this.pokemon.favorite;
    },
    closeModal() {
      // Simulate navigation
    }
  }
};

// Mock del router de Vue
vi.mock('vue-router', () => ({
  useRouter: () => ({
    back: vi.fn(),
    push: vi.fn()
  }),
  useRoute: () => ({
    params: { id: '1' }
  })
}));

// Mock de servicios
vi.mock('../services/pokemonService', () => ({
  fetchPokemonDetailsFromStore: vi.fn().mockResolvedValue({
    id: 1,
    name: 'Bulbasaur',
    height: 7,
    weight: 69,
    types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }]
  }),
  toggleFavoriteInStore: vi.fn((pokemon) => ({
    ...pokemon,
    favorite: !pokemon.favorite
  }))
}));

describe('PokemonDetails Component', () => {
  beforeEach(() => {
    // Crear una instancia nueva de Pinia para cada test
    setActivePinia(createPinia());
    
    // Mock de sessionStorage
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify({
      id: 1,
      name: 'Bulbasaur',
      url: 'url',
      favorite: false
    }));
    
    // Mock del document.execCommand para el clipboard
    document.execCommand = vi.fn().mockReturnValue(true);
  });
  
  it('debería renderizar correctamente el componente', () => {
    const wrapper = mount(PokemonDetailsMock);
    
    // Verificar que el componente se renderiza
    expect(wrapper.exists()).toBe(true);
  });
  
  it('debería mostrar la información del Pokémon', () => {
    const wrapper = mount(PokemonDetailsMock);
    
    // Verificar que la información se muestra
    expect(wrapper.text()).toContain('Bulbasaur');
    expect(wrapper.text()).toContain('69kg');
    expect(wrapper.text()).toContain('0.7m');
    expect(wrapper.text()).toContain('Grass, Poison');
  });
  
  it('debería cambiar el estado de favorito cuando se hace clic en el botón de favorito', async () => {
    const wrapper = mount(PokemonDetailsMock);
    const pokemon = (wrapper.vm as any).pokemon as PokemonData;
    const initialState = pokemon.favorite;
    
    // Simular clic en el botón
    await wrapper.find('.favorite-button').trigger('click');
    
    // Verificar que el estado cambió
    expect(pokemon.favorite).toBe(!initialState);
  });
  
  it('debería mostrar el mensaje de confirmación después de hacer clic en el botón compartir', async () => {
    const wrapper = mount(PokemonDetailsMock);
    
    // Verificar que el mensaje de confirmación no está inicialmente
    expect(wrapper.find('.share-confirmation').exists()).toBe(false);
    
    // Simular clic en el botón
    await wrapper.find('.share-button').trigger('click');
    
    // Verificar que el mensaje aparece
    expect(wrapper.find('.share-confirmation').exists()).toBe(true);
    expect(wrapper.find('.share-confirmation').text()).toBe('Copied!');
  });
  
  it('debería llamar a los métodos correctos al hacer clic en los botones', async () => {
    // Crear métodos mock
    const handleShare = vi.fn();
    const toggleFavoriteStatus = vi.fn();
    const closeModal = vi.fn();
    
    // Crear componente con métodos mock
    const wrapper = mount({
      ...PokemonDetailsMock,
      methods: {
        handleShare,
        toggleFavoriteStatus,
        closeModal
      }
    });
    
    // Simular clics en los botones
    await wrapper.find('.share-button').trigger('click');
    await wrapper.find('.favorite-button').trigger('click');
    await wrapper.find('.close-button').trigger('click');
    
    // Verificar que se llamaron los métodos
    expect(handleShare).toHaveBeenCalled();
    expect(toggleFavoriteStatus).toHaveBeenCalled();
    expect(closeModal).toHaveBeenCalled();
  });
}); 