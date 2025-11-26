import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const usePokemonStore = defineStore('pokemon', () => {
  const searchQuery = ref('');
  const selectedTypes = ref<string[]>([]);

  const selectedPokemonId = ref<number | null>(null);  
  const isModalOpen = computed(() => selectedPokemonId.value !== null);

  const openModal = (id: number) => { selectedPokemonId.value = id; };
  const closeModal = () => { selectedPokemonId.value = null; };

  const toggleType = (type: string) => {
    if (selectedTypes.value.includes(type)) {
      selectedTypes.value = selectedTypes.value.filter((t) => t !== type);
    } else {
      selectedTypes.value.push(type);
    }
  };

  return {
    searchQuery,
    selectedTypes,
    toggleType,
    selectedPokemonId,
    isModalOpen,
    openModal,
    closeModal
  };
});