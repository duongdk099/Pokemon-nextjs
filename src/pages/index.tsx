import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import api from '../lib/api';
import PokemonCard from '../components/PokemonCard';
import Filters from '../components/Filters';
import DarkModeToggle from '../components/DarkModeToggle';
import styles from '../styles/home.module.css';

export default function Home() {
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<number[] | null>(null);

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
          {pokemons.map((p) => (
            <PokemonCard key={p.pokedexId || p.id} pokemon={p} />
          ))}
        </div>
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
