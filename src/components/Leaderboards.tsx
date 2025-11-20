import { useQuery } from '@tanstack/react-query';
import { fetchPokemons } from '../lib/api';
import { Pokemon } from '../types';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/leaderboards.module.css';

const statCategories = [
  { key: 'HP' as const, label: 'HP', emoji: '❤️' },
  { key: 'attack' as const, label: 'Attack', emoji: '⚔️' },
  { key: 'defense' as const, label: 'Defense', emoji: '🛡️' },
  { key: 'special_attack' as const, label: 'Sp. Attack', emoji: '✨' },
  { key: 'special_defense' as const, label: 'Sp. Defense', emoji: '🌟' },
  { key: 'speed' as const, label: 'Speed', emoji: '⚡' },
];

interface LeaderboardsProps {
  onClose: () => void;
}

export default function Leaderboards({ onClose }: LeaderboardsProps) {
  const { data: pokemons = [], isLoading } = useQuery<Pokemon[]>({
    queryKey: ['all-pokemons'],
    queryFn: async () => {
      // Fetch a large batch to get comprehensive data
      const result = await fetchPokemons({ limit: 500 });
      return result;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const getTopPokemonByStat = (statKey: 'HP' | 'attack' | 'defense' | 'special_attack' | 'special_defense' | 'speed') => {
    return [...pokemons]
      .filter(p => p.stats && p.stats[statKey])
      .sort((a, b) => {
        const statA = a.stats?.[statKey] as number || 0;
        const statB = b.stats?.[statKey] as number || 0;
        return statB - statA;
      })
      .slice(0, 10);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>🏆 Stat Leaderboards</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading leaderboards...</p>
          </div>
        ) : (
          <div className={styles.content}>
            {statCategories.map((category) => {
              const topPokemon = getTopPokemonByStat(category.key);
              
              return (
                <div key={category.key} className={styles.leaderboard}>
                  <h3 className={styles.categoryTitle}>
                    <span className={styles.emoji}>{category.emoji}</span>
                    {category.label}
                  </h3>
                  <div className={styles.list}>
                    {topPokemon.map((pokemon, index) => {
                      const id = pokemon.pokedexId || pokemon.id;
                      const image = pokemon.image || pokemon.sprite;
                      const statValue = pokemon.stats?.[category.key] as number;
                      
                      return (
                        <Link 
                          key={id} 
                          href={`/pokemon/${id}`}
                          className={styles.listItem}
                        >
                          <div className={styles.rank}>
                            {index === 0 && '🥇'}
                            {index === 1 && '🥈'}
                            {index === 2 && '🥉'}
                            {index > 2 && `#${index + 1}`}
                          </div>
                          <div className={styles.pokemonImage}>
                            {image && (
                              <Image 
                                src={image} 
                                alt={pokemon.name} 
                                width={40}
                                height={40}
                                style={{ objectFit: 'contain' }}
                              />
                            )}
                          </div>
                          <div className={styles.pokemonInfo}>
                            <span className={styles.pokemonName}>{pokemon.name}</span>
                            <span className={styles.pokemonId}>#{String(id).padStart(3, '0')}</span>
                          </div>
                          <div className={styles.statValue}>{statValue}</div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
