<script setup lang="ts">
import { computed } from 'vue';
import { useInfiniteQuery } from '@tanstack/vue-query';
import { Button } from '../ui/button';
import PokemonCard from './PokemonCard.vue';
import { fetchPokemons } from '@/lib/api';

const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  status,
  error
} = useInfiniteQuery({
  queryKey: ['pokemons'],
  queryFn: fetchPokemons,
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextOffset,
});

const allPokemons = computed(() => {
  return data.value?.pages.flatMap((page) => page.results) || [];
});
</script>

<template>
  <div class="flex flex-col gap-8 pb-10">
    
    <div v-if="status === 'pending'" class="text-center py-20">
      <p class="text-xl text-muted-foreground animate-pulse">Łapanie Pokemonów...</p>
    </div>

    <div v-else-if="status === 'error'" class="text-center py-20 text-red-500">
      <p>Wystąpił błąd: {{ error?.message }}</p>
      <Button variant="outline" @click="() => fetchNextPage()" class="mt-4">Spróbuj ponownie</Button>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <PokemonCard
          v-for="pokemon in allPokemons"
          :key="pokemon.id"
          :pokemon="pokemon"
        />
      </div>

      <div v-if="hasNextPage" class="flex justify-center mt-12">
        <Button 
          size="lg" 
          @click="() => fetchNextPage()" 
          :disabled="isFetchingNextPage"
          class="px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg transition-all active:scale-95"
        >
          {{ isFetchingNextPage ? 'Loading...' : 'Load More' }}
        </Button>
      </div>
      
      <p v-else class="text-center text-muted-foreground mt-10">
        Złapałeś już wszystkie!
      </p>
    </div>
  </div>
</template>