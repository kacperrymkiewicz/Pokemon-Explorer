<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { usePokemonStore } from '@/stores/pokemonStore';
import { storeToRefs } from 'pinia';

const store = usePokemonStore();
const { searchQuery } = storeToRefs(store);
</script>

<template>
  <div class="relative w-full max-w-md mx-auto mb-5">
    <Input
      v-model="searchQuery"
      type="text"
      placeholder="Search Pokémon..."
      class="w-full bg-[#1e1e1e] border-none rounded-3xl text-white placeholder:text-gray-400 focus-visible:ring-orange-400"
    />
  </div>
</template>