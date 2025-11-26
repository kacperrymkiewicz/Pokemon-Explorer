<script setup lang="ts">
import { computed } from 'vue';
import { usePokemonStore } from '@/stores/pokemonStore';
import { storeToRefs } from 'pinia';
import { useQuery } from '@tanstack/vue-query';
import { fetchPokemonEvolutionChain, fetchPokemonLocations } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { getPokemonDetail } from '@/lib/api';
import { TYPE_COLORS } from '@/constants/pokemonColors';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const store = usePokemonStore();
const { isModalOpen, selectedPokemonId } = storeToRefs(store);

const { data: pokemonDetails } = useQuery({
  queryKey: ['pokemonDetails', selectedPokemonId],
  queryFn: async () => {
    if (selectedPokemonId.value === null) return null;
    return getPokemonDetail(`https://pokeapi.co/api/v2/pokemon/${selectedPokemonId.value}`);
  },
  enabled: computed(() => selectedPokemonId.value !== null),
});

const { data: locations, isPending: isLocationsLoading } = useQuery({
  queryKey: ['pokemonLocations', selectedPokemonId],
  queryFn: () => fetchPokemonLocations(selectedPokemonId.value!),
  enabled: computed(() => selectedPokemonId.value !== null),
});

const { data: evolutionChain, isPending: isEvolutionLoading } = useQuery({
  queryKey: ['pokemonEvolution', selectedPokemonId],
  queryFn: () => fetchPokemonEvolutionChain(selectedPokemonId.value!),
  enabled: computed(() => selectedPokemonId.value !== null),
});

const parsedEvolutions = computed(() => {
  if (!evolutionChain.value) return [];
  const names = [];
  let currentStage = evolutionChain.value;

  while (currentStage && names.length < 3) {
    names.push(currentStage.species.name);
    currentStage = currentStage.evolves_to[0];
  }
  return names;
});

const modalHeaderStyle = computed(() => {
  const type = pokemonDetails.value?.types[0]?.type.name;
  if (type) {
    return { backgroundColor: TYPE_COLORS[type] || '#777' };
  }
  return {};
});
</script>

<template>
  <Dialog :open="isModalOpen" @update:open="store.closeModal()">
    <DialogContent 
      v-if="pokemonDetails" 
      class="w-[90vw] md:w-[600px] max-h-[90vh] overflow-hidden p-0"
    >
      <DialogHeader 
        class="p-6 pt-8 rounded-t-lg text-white" 
        :style="modalHeaderStyle"
      >
        <DialogTitle class="text-3xl font-extrabold capitalize drop-shadow-lg">
          {{ pokemonDetails.name }}
        </DialogTitle>
        <DialogDescription class="text-white/80 font-mono">
          ID: #{{ pokemonDetails.id.toString().padStart(3, '0') }}
        </DialogDescription>
      </DialogHeader>

      <ScrollArea class="h-full">
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          <div class="space-y-4">
            <img 
              :src="pokemonDetails.sprites.other['official-artwork'].front_default"
              :alt="pokemonDetails.name"
              class="w-full max-h-48 object-contain drop-shadow-2xl"
            />
            
            <div class="flex gap-2 justify-center">
              <Badge 
                v-for="typeInfo in pokemonDetails.types" 
                :key="typeInfo.type.name" 
                :style="{ backgroundColor: TYPE_COLORS[typeInfo.type.name] }"
                class="text-white px-3 capitalize font-semibold"
              >
                {{ typeInfo.type.name }}
              </Badge>
            </div>
          </div>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-bold border-b pb-1 mb-2">Ewolucje:</h3>
              <p v-if="isEvolutionLoading">Ładowanie łańcucha...</p>
              <ul v-else-if="parsedEvolutions.length > 0">
                <li v-for="(name, index) in parsedEvolutions" :key="name" class="capitalize">
                  • {{ name }}
                  <span v-if="index < parsedEvolutions.length - 1" class="text-xs text-gray-500"> →</span>
                </li>
              </ul>
              <p v-else class="text-muted-foreground">Brak ewolucji.</p>
            </div>

            <div>
              <h3 class="text-lg font-bold border-b pb-1 mb-2">Lokacje:</h3>
              <p v-if="isLocationsLoading">Skanowanie regionów...</p>
              <ul v-else-if="locations && locations.length > 0">
                <li v-for="location in locations.slice(0, 5)" :key="location" class="text-sm">
                  • {{ location }}
                </li>
                <li v-if="locations.length > 5" class="text-sm italic">
                    i {{ locations.length - 5 }} innych...
                </li>
              </ul>
              <p v-else class="text-muted-foreground">Nie znaleziono lokacji.</p>
            </div>
          </div>
        </div>
      </ScrollArea>
      
      </DialogContent>
  </Dialog>
</template>