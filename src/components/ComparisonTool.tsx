import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useComparison } from '../pages/_app';
import api from '../lib/api';
import { Pokemon } from '../types';
import StatsRadarChart from './StatsRadarChart';
import styles from '../styles/comparison.module.css';

export default function ComparisonTool() {
  const { selectedPokemon, clearSelection, toggleComparisonMode } = useComparison();
  const [pokemons, setPokemons] = useState<(Pokemon | null)[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPokemon.length === 0) {
      setPokemons([]);
      return;
    }

    setLoading(true);
    Promise.all(
      selectedPokemon.map(id => 
        api.getPokemonByPokedexId(id).catch(() => null)
      )
    ).then(results => {
      setPokemons(results);
      setLoading(false);
    });
  }, [selectedPokemon]);

  if (selectedPokemon.length === 0) {
    return null;
  }

  const handleClose = () => {
    clearSelection();
    toggleComparisonMode();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>📊 Compare Students ({pokemons.filter(p => p).length}/3)</h2>
          <button onClick={handleClose} className={styles.closeBtn} aria-label="Close comparison">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading students...</p>
          </div>
        ) : (
          <div className={styles.content}>
            <div className={styles.comparisonGrid}>
              {pokemons.map((pokemon, index) => {
                if (!pokemon) return null;
                const image = pokemon.image || pokemon.sprite;

                return (
                  <div key={pokemon.pokedexId} className={styles.pokemonColumn}>
                    <div className={styles.pokemonHeader}>
                      <div className={styles.imageWrapper}>
                        {image && (
                          <Image 
                            src={image} 
                            alt={pokemon.name} 
                            width={120}
                            height={120}
                            style={{ objectFit: 'contain' }}
                          />
                        )}
                      </div>
                      <h3>{pokemon.name}</h3>
                      <div className={styles.pokemonId}>#{String(pokemon.pokedexId).padStart(3, '0')}</div>
                      {pokemon.types && (
                        <div className={styles.types}>
                          {pokemon.types.map(t => (
                            <span key={t.id} className={styles.type}>
                              {t.name}
                            </span>
                          ))}
                        </div>
                      )}
                      <Link href={`/pokemon/${pokemon.pokedexId}`} className={styles.viewBtn}>
                        View Details →
                      </Link>
                    </div>

                    {pokemon.stats && (
                      <div className={styles.statsSection}>
                        <h4>Stats</h4>
                        {Object.entries(pokemon.stats).map(([key, value]) => (
                          <div key={key} className={styles.statRow}>
                            <span className={styles.statName}>{key.replace(/_/g, ' ')}</span>
                            <div className={styles.statBar}>
                              <div 
                                className={styles.statFill} 
                                style={{ width: `${Math.min((value || 0) / 2, 100)}%` }}
                              />
                            </div>
                            <span className={styles.statValue}>{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {pokemons.length > 0 && pokemons.every(p => p?.stats) && (
              <div className={styles.radarSection}>
                <h3>📈 Visual Comparison</h3>
                <div className={styles.radarGrid}>
                  {pokemons.map((pokemon, index) => {
                    if (!pokemon?.stats) return null;
                    return (
                      <div key={pokemon.pokedexId} className={styles.radarCard}>
                        <h4>{pokemon.name}</h4>
                        <StatsRadarChart stats={pokemon.stats} size={250} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
