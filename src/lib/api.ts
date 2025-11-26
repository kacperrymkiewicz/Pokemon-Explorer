import type { PokemonDetail, PokemonListResponse } from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const getPokemonDetail = async (url: string): Promise<PokemonDetail> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

export const fetchPokemons = async ({ pageParam = 0 }: { pageParam?: number }) => {
  const limit = 24;
  const offset = pageParam;
  
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  const data: PokemonListResponse = await response.json();

  const detailedPokemons = await Promise.all(
    data.results.map((pokemon) => getPokemonDetail(pokemon.url))
  );

  return {
    results: detailedPokemons,
    nextOffset: data.next ? offset + limit : null,
  };
};