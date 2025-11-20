import { useEffect, useRef, useState, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import api from '../lib/api';
import PokemonCard from '../components/PokemonCard';
import Filters from '../components/Filters';
import DarkModeToggle from '../components/DarkModeToggle';
import ComparisonTool from '../components/ComparisonTool';
import Leaderboards from '../components/Leaderboards';
import { useComparison, useFavorites } from './_app';
import { Pokemon } from '../types';
import styles from '../styles/home.module.css';

type ViewMode = 'grid' | 'list';
type SortOption = 'id' | 'name' | 'hp' | 'attack' | 'defense' | 'speed';

export default function Home() {
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<number[] | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('id');
  const [showLeaderboards, setShowLeaderboards] = useState(false);

  const { comparisonMode, toggleComparisonMode, selectedPokemon, clearSelection } = useComparison();
  const { favorites } = useFavorites();

  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleExportData = () => {
    const dataToExport = showFavoritesOnly 
      ? sortedPokemons.filter(p => favorites.includes(p.pokedexId || p.id))
      : sortedPokemons;

    const exportData = dataToExport.map(p => ({
      id: p.pokedexId || p.id,
      name: p.name,
      types: p.types?.map(t => t.name).join(', ') || 'N/A',
      hp: p.stats?.HP || 'N/A',
      attack: p.stats?.attack || 'N/A',
      defense: p.stats?.defense || 'N/A',
      specialAttack: p.stats?.special_attack || 'N/A',
      specialDefense: p.stats?.special_defense || 'N/A',
      speed: p.stats?.speed || 'N/A',
    }));

    // CSV format
    const csvHeaders = 'ID,Name,Types,HP,Attack,Defense,Sp. Attack,Sp. Defense,Speed\n';
    const csvRows = exportData.map(p => 
      `${p.id},"${p.name}","${p.types}",${p.hp},${p.attack},${p.defense},${p.specialAttack},${p.specialDefense},${p.speed}`
    ).join('\n');
    const csvContent = csvHeaders + csvRows;

    // Create and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pokemon-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  // Sort pokemons based on sortBy
  const sortedPokemons = useMemo(() => {
    const pokemonsToSort = [...displayedPokemons];
    
    switch (sortBy) {
      case 'id':
        return pokemonsToSort.sort((a, b) => (a.pokedexId || a.id) - (b.pokedexId || b.id));
      case 'name':
        return pokemonsToSort.sort((a, b) => a.name.localeCompare(b.name));
      case 'hp':
        return pokemonsToSort.sort((a, b) => (b.stats?.HP || 0) - (a.stats?.HP || 0));
      case 'attack':
        return pokemonsToSort.sort((a, b) => (b.stats?.attack || 0) - (a.stats?.attack || 0));
      case 'defense':
        return pokemonsToSort.sort((a, b) => (b.stats?.defense || 0) - (a.stats?.defense || 0));
      case 'speed':
        return pokemonsToSort.sort((a, b) => (b.stats?.speed || 0) - (a.stats?.speed || 0));
      default:
        return pokemonsToSort;
    }
  }, [displayedPokemons, sortBy]);

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
        <div className={styles.actionGroup}>
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

        <div className={styles.actionGroup}>
          <div className={styles.viewToggle}>
            <button 
              className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
              </svg>
            </button>
            <button 
              className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
          </div>

          <select 
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="id">Sort by ID</option>
            <option value="name">Sort by Name</option>
            <option value="hp">Sort by HP</option>
            <option value="attack">Sort by Attack</option>
            <option value="defense">Sort by Defense</option>
            <option value="speed">Sort by Speed</option>
          </select>

          <button 
            className={styles.actionBtn}
            onClick={() => setShowLeaderboards(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
              <path d="M4 22h16"/>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
            </svg>
            Leaderboards
          </button>

          <button 
            className={styles.actionBtn}
            onClick={handleExportData}
            disabled={sortedPokemons.length === 0}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export CSV
          </button>
        </div>
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
        <div className={viewMode === 'grid' ? styles.pokemonGrid : styles.pokemonList}>
          {sortedPokemons.map((p) => (
            <PokemonCard key={p.pokedexId || p.id} pokemon={p} viewMode={viewMode} />
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

      {showLeaderboards && <Leaderboards onClose={() => setShowLeaderboards(false)} />}
      {selectedPokemon.length >= 2 && <ComparisonTool />}
    </main>
  );
}
