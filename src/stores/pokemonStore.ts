import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePokemonStore = defineStore('pokemon', () => {
  const searchQuery = ref('');
  const selectedTypes = ref<string[]>([]);

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
  };
});