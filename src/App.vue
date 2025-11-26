<script setup lang="ts">
import PokemonList from '@/components/pokemon/PokemonList.vue';
import PokemonFilters from '@/components/pokemon/PokemonFilters.vue';
import SearchBar from '@/components/pokemon/SearchBar.vue';
</script>

<template>
  <div class="min-h-screen bg-[#121212] text-foreground font-sans">
    <div class="container mx-auto px-4 py-8">
      
      <header class="flex flex-col items-center mb-10 gap-4">
        <div class="flex items-center gap-3">
           <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="Pokeball" class="w-10 h-10" />
           <h1 class="text-4xl font-extrabold text-orange-400 tracking-tight">Pokémon Explorer</h1>
        </div>
        
        <div class="w-full p-4 rounded-xl text-center">
           <SearchBar />
           <PokemonFilters />
        </div>
      </header>

      <main>
        <PokemonList />
      </main>
      
    </div>
  </div>
</template>