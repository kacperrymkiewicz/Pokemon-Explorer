<script setup lang="ts">
import { TYPE_COLORS } from '@/constants/pokemonColors';
import { Badge } from '@/components/ui/badge';
import { usePokemonStore } from '@/stores/pokemonStore';
import { storeToRefs } from 'pinia';

const store = usePokemonStore();
const { selectedTypes } = storeToRefs(store);

const allTypes = Object.keys(TYPE_COLORS);
</script>

<template>
  <div class="flex flex-wrap gap-2 justify-center py-4">
    <Badge
      v-for="type in allTypes"
      :key="type"
      class="cursor-pointer px-4 py-1 capitalize transition-all duration-200 select-none"
      :style="{
        backgroundColor: TYPE_COLORS[type],
        opacity: selectedTypes.length === 0 || selectedTypes.includes(type) ? 1 : 0.4
      }"
      :class="{
        'ring-2 ring-white ring-offset-2 ring-offset-[#121212] scale-110': selectedTypes.includes(type)
      }"
      @click="store.toggleType(type)"
    >
      {{ type }}
    </Badge>
  </div>
</template>