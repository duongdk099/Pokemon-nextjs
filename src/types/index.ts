
export interface PokemonType {
  id: number;
  name: string;
  image?: string;
}

export interface PokemonStats {
  hp?: number;
  attack?: number;
  defense?: number;
  special_attack?: number;
  special_defense?: number;
  speed?: number;
  [key: string]: number | undefined;
}

export interface PokemonEvolution {
  pokedexId: number;
  name: string;
  condition?: string;
}

export interface Pokemon {
  id: number;
  pokedexId: number;
  name: string;
  image?: string;
  sprite?: string;
  types?: PokemonType[];
  stats?: PokemonStats;
  evolutions?: PokemonEvolution[];
}

export interface FetchPokemonsParams {
  page?: number;
  limit?: number;
  types?: number[];
  typeId?: number;
  name?: string;
}

export interface DarkModeContextValue {
  darkMode: boolean | undefined;
  toggleDarkMode: () => void;
}
