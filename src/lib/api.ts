import axios from 'axios';
import { Pokemon, PokemonType, FetchPokemonsParams } from '../types';

const BASE =
  process.env.NEXT_PUBLIC_API_BASE || process.env.API_BASE || 'https://nestjs-pokedex-api.vercel.app';

const client = axios.create({ baseURL: BASE, timeout: 10000 });

function buildQuery(paramsObj: Record<string, any>): string {
  const params = new URLSearchParams();
  Object.entries(paramsObj).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    if (Array.isArray(v)) {
      v.forEach((item) => params.append(k, item));
    } else {
      params.append(k, v);
    }
  });
  return params.toString();
}

export async function fetchPokemons(params: FetchPokemonsParams = {}): Promise<Pokemon[]> {
  const { page = 1, limit = 50, types = [], typeId, name } = params;
  
  try {
    const qs = buildQuery({ page, limit, types, typeId, name });
    const path = `/pokemons${qs ? `?${qs}` : ''}`;
    const res = await client.get<Pokemon[]>(path);
    return res.data;
  } catch (err: any) {
    if (err.response) {
      const text = err.response.data || '';
      throw new Error(`Failed to fetch ${BASE}/pokemons: ${err.response.status} ${err.response.statusText} ${JSON.stringify(text)}`);
    }
    throw new Error(`Error fetching ${BASE}/pokemons: ${err.message}`);
  }
}

export async function getPokemonByPokedexId(pokedexId: string | number): Promise<Pokemon> {
  try {
    const res = await client.get<Pokemon>(`/pokemons/${pokedexId}`);
    return res.data;
  } catch (err: any) {
    if (err.response) {
      const text = err.response.data || '';
      throw new Error(`Failed to fetch ${BASE}/pokemons/${pokedexId}: ${err.response.status} ${err.response.statusText} ${JSON.stringify(text)}`);
    }
    throw new Error(`Error fetching ${BASE}/pokemons/${pokedexId}: ${err.message}`);
  }
}

export async function fetchTypes(): Promise<PokemonType[]> {
  try {
    const res = await client.get<PokemonType[]>('/types');
    return res.data;
  } catch (err: any) {
    if (err.response) {
      const text = err.response.data || '';
      throw new Error(`Failed to fetch ${BASE}/types: ${err.response.status} ${err.response.statusText} ${JSON.stringify(text)}`);
    }
    throw new Error(`Error fetching ${BASE}/types: ${err.message}`);
  }
}

export default {
  fetchPokemons,
  getPokemonByPokedexId,
  fetchTypes,
};
