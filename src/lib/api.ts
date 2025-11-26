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

export const fetchPokemonLocations = async (id: number) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`);
  if (!response.ok) return [];

  const data = await response.json();
  return data.map((item: any) => item.location_area.name.replace(/-/g, ' '));
};

export const fetchPokemonEvolutionChain = async (id: number) => {
  const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  if (!speciesResponse.ok) throw new Error('Failed to fetch species data');
  const speciesData = await speciesResponse.json();

  const evolutionChainUrl = speciesData.evolution_chain.url;

  const chainResponse = await fetch(evolutionChainUrl);
  if (!chainResponse.ok) throw new Error('Failed to fetch evolution chain');
  const chainData = await chainResponse.json();
  
  return chainData.chain;
};