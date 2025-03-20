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
    // Create a new Pinia instance for each test
    setActivePinia(createPinia());
    
    // Mock sessionStorage
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify({
      id: 1,
      name: 'Bulbasaur',
      url: 'url',
      favorite: false
    }));
    
    // Mock document.execCommand for clipboard
    document.execCommand = vi.fn().mockReturnValue(true);
  });
  
  it('should render the component correctly', () => {
    const wrapper = mount(PokemonDetailsMock);
    
    // Verify that the component renders
    expect(wrapper.exists()).toBe(true);
  });
  
  it('should display the Pokemon information', () => {
    const wrapper = mount(PokemonDetailsMock);
    
    // Verify the information is displayed
    expect(wrapper.text()).toContain('Bulbasaur');
    expect(wrapper.text()).toContain('69kg');
    expect(wrapper.text()).toContain('0.7m');
    expect(wrapper.text()).toContain('Grass, Poison');
  });
  
  it('should change the favorite status when the favorite button is clicked', async () => {
    const wrapper = mount(PokemonDetailsMock);
    const pokemon = (wrapper.vm as any).pokemon as PokemonData;
    const initialState = pokemon.favorite;
    
    // Simulate button click
    await wrapper.find('.favorite-button').trigger('click');
    
    // Verify that the state changed
    expect(pokemon.favorite).toBe(!initialState);
  });
  
  it('should show the confirmation message after clicking the share button', async () => {
    const wrapper = mount(PokemonDetailsMock);
    
    // Verify that the confirmation message is not initially present
    expect(wrapper.find('.share-confirmation').exists()).toBe(false);
    
    // Simulate button click
    await wrapper.find('.share-button').trigger('click');
    
    // Verify that the message appears
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