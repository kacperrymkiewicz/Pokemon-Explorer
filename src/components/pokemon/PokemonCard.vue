<script setup lang="ts">
import { computed } from 'vue';
import { Badge } from '@/components/ui/badge';
import { TYPE_COLORS } from '@/constants/pokemonColors';
import type { PokemonDetail } from '@/types/pokemon';

const props = defineProps<{
  pokemon: PokemonDetail;
}>();

const formattedId = computed(() => {
  return `#${props.pokemon.id.toString().padStart(3, '0')}`;
});

const cardBackground = computed(() => {
  const types = props.pokemon.types.map((t) => t.type.name);
  const primaryType = types[0];

  if (!primaryType) {
    return { backgroundColor: '#777' };
  }

  const color1 = TYPE_COLORS[primaryType] || '#777';

  if (types.length === 2) {
    const secondaryType = types[1];

    if (secondaryType) {
      const color2 = TYPE_COLORS[secondaryType] || '#777';
      return {
        background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
      };
    }
  }

  return {
    backgroundColor: color1,
  };
});
</script>

<template>
  <div
    class="group relative flex flex-col items-center justify-between overflow-hidden rounded-3xl p-6 transition-transform hover:scale-105 hover:shadow-xl cursor-pointer"
    :style="cardBackground"
  >

    <div class="relative z-10 my-2 h-32 w-32 transition-transform duration-300 group-hover:scale-110">
      <img
        :src="pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default"
        :alt="pokemon.name"
        class="h-full w-full"
        loading="lazy"
      />
    </div>

    <div class="flex w-full flex-col items-center z-10 mb-2">
      <h2 class="text-2xl font-bold text-white capitalize drop-shadow-md">
        {{ pokemon.name }}
      </h2>
      <span class="text-sm font-bold text-white/80 font-mono mt-1">
        {{ formattedId }}
      </span>
    </div>

    <div class="flex gap-2 z-10">
      <Badge
        v-for="typeInfo in pokemon.types"
        :key="typeInfo.type.name"
        variant="secondary"
        class="bg-white/25 text-white hover:bg-white/40 border-none px-3 capitalize text-sm"
      >
        {{ typeInfo.type.name }}
      </Badge>
    </div>
  </div>
</template>