import { useState, useEffect, createContext, useContext } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { DarkModeContextValue, FavoritesContextValue, ComparisonContextValue } from '../types';
import '../styles/globals.css';

const DarkModeContext = createContext<DarkModeContextValue | undefined>(undefined);
const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);
const ComparisonContext = createContext<ComparisonContextValue | undefined>(undefined);

export function useDarkMode(): DarkModeContextValue {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeContext.Provider');
  }
  return context;
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesContext.Provider');
  }
  return context;
}

export function useComparison(): ComparisonContextValue {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within ComparisonContext.Provider');
  }
  return context;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,  
      gcTime: 10 * 60 * 1000, 
      refetchOnMount: false, 
      refetchOnReconnect: true, 
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState<boolean | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<number[]>([]);

  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Failed to parse favorites:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (darkMode !== undefined) {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('darkMode', String(darkMode));
    }
  }, [darkMode]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, mounted]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const toggleFavorite = (pokedexId: number) => {
    setFavorites(prev => 
      prev.includes(pokedexId) 
        ? prev.filter(id => id !== pokedexId)
        : [...prev, pokedexId]
    );
  };

  const isFavorite = (pokedexId: number) => {
    return favorites.includes(pokedexId);
  };

  const toggleComparisonMode = () => {
    setComparisonMode(prev => !prev);
    if (comparisonMode) {
      setSelectedPokemon([]);
    }
  };

  const toggleSelection = (pokedexId: number) => {
    setSelectedPokemon(prev => {
      if (prev.includes(pokedexId)) {
        return prev.filter(id => id !== pokedexId);
      } else if (prev.length < 3) {
        return [...prev, pokedexId];
      }
      return prev;
    });
  };

  const clearSelection = () => {
    setSelectedPokemon([]);
  };

  const isSelected = (pokedexId: number) => {
    return selectedPokemon.includes(pokedexId);
  };

  if (!mounted) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
          <ComparisonContext.Provider value={{ comparisonMode, selectedPokemon, toggleComparisonMode, toggleSelection, clearSelection, isSelected }}>
            <Component {...pageProps} />
          </ComparisonContext.Provider>
        </FavoritesContext.Provider>
      </DarkModeContext.Provider>
    </QueryClientProvider>
  );
}

export default MyApp;
