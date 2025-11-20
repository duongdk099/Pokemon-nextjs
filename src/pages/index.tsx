import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import api from '../lib/api';
import PokemonCard from '../components/PokemonCard';
import Filters from '../components/Filters';
import DarkModeToggle from '../components/DarkModeToggle';
import ComparisonTool from '../components/ComparisonTool';
import { useComparison, useFavorites } from './_app';
import styles from '../styles/home.module.css';

export default function Home() {
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<number[] | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { comparisonMode, toggleComparisonMode, selectedPokemon, clearSelection } = useComparison();
  const { favorites } = useFavorites();

  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['pokemons', { limit, typeFilter, search }],
    queryFn: ({ pageParam = 1 }) => 
      api.fetchPokemons({ 
        page: pageParam as number, 
        limit, 
        types: typeFilter || [], 
        name: search || undefined 
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
  });

  const pokemons = data?.pages.flat() || [];

  const displayedPokemons = showFavoritesOnly 
    ? pokemons.filter(p => favorites.includes(p.pokedexId || p.id))
    : pokemons;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isFetchingNextPage && hasNextPage) {
        fetchNextPage();
      }
    }, { rootMargin: '300px' });
    
    obs.observe(el);
    return () => obs.disconnect();
  }, [fetchNextPage, isFetchingNextPage, hasNextPage]);

  return (
    <main className={styles.main}>
      <DarkModeToggle />
      
      <header className={styles.pageHeader}>
        <h1>🎓 Student Directory</h1>
        <p className={styles.subtitle}>Discover and explore our amazing students</p>
      </header>

      <Filters onSearch={setSearch} onTypes={setTypeFilter} onLimit={setLimit} initialLimit={limit} />

      <div className={styles.actionBar}>
        <button 
          className={`${styles.actionBtn} ${comparisonMode ? styles.active : ''}`}
          onClick={toggleComparisonMode}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
          {comparisonMode ? `Compare Mode (${selectedPokemon.length}/3)` : 'Compare Students'}
        </button>
        
        <button 
          className={`${styles.actionBtn} ${showFavoritesOnly ? styles.active : ''}`}
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={showFavoritesOnly ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {showFavoritesOnly ? `Favorites (${favorites.length})` : 'Show Favorites'}
        </button>

        {comparisonMode && selectedPokemon.length > 0 && (
          <button 
            className={styles.clearBtn}
            onClick={clearSelection}
          >
            Clear Selection
          </button>
        )}
      </div>

      {comparisonMode && (
        <div className={styles.comparisonHint}>
          💡 Select 2-3 students to compare. Click cards to select/deselect.
        </div>
      )}

      {isError && (
        <div className={styles.errorBanner}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>Error loading data: {error?.message}</span>
        </div>
      )}

      {isLoading && pokemons.length === 0 ? (
        <div className={styles.loadingGrid}>
          {[...Array(12)].map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonImage}></div>
              <div className={styles.skeletonText}></div>
              <div className={`${styles.skeletonText} ${styles.short}`}></div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.pokemonGrid}>
          {displayedPokemons.map((p) => (
            <PokemonCard key={p.pokedexId || p.id} pokemon={p} />
          ))}
        </div>
      )}

      {showFavoritesOnly && displayedPokemons.length === 0 && (
        <div className={styles.emptyState}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <h3>No favorites yet!</h3>
          <p>Click the ❤️ icon on any student card to add them to your favorites.</p>
        </div>
      )}

      {comparisonMode && selectedPokemon.length >= 2 && (
        <ComparisonTool />
      )}

      <div ref={sentinelRef} style={{ height: 40 }} />
      
      {isFetchingNextPage && (
        <div className={styles.loadingMore}>
          <div className={styles.spinnerLarge}></div>
          <p>Loading more students...</p>
        </div>
      )}
      
      {!hasNextPage && pokemons.length > 0 && (
        <div className={styles.endMessage}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <p>You've reached the end! ({pokemons.length} students total)</p>
        </div>
      )}
    </main>
  );
}
