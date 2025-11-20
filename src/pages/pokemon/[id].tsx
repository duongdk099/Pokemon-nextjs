import React from 'react';
import { GetServerSideProps } from 'next';
import api from '../../lib/api';
import Link from 'next/link';
import Image from 'next/image';
import DarkModeToggle from '../../components/DarkModeToggle';
import { Pokemon } from '../../types';
import styles from '../../styles/pokemonDetail.module.css';

interface PokemonDetailProps {
  pokemon: Pokemon | null;
  error?: string;
}

export default function PokemonDetail({ pokemon, error }: PokemonDetailProps) {
  if (!pokemon) {
    return (
      <main className={styles.main}>
        <DarkModeToggle />
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Home
          </Link>
          
          <div className={styles.errorCard}>
            <h1>Pokémon not found</h1>
            {error && (
              <div className={styles.errorDetails}>
                <strong>Error:</strong>
                <pre>{error}</pre>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  const currentId = pokemon.pokedexId || pokemon.id;
  const prevId = currentId - 1;
  const nextId = currentId + 1;
  const image = pokemon.image || pokemon.sprite;

  return (
    <main className={styles.main}>
      <DarkModeToggle />
      <div className={styles.container}>
        <div className={styles.navigation}>
          <Link href="/" className={styles.backLink}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Home
          </Link>
          
          <div className={styles.pokemonNav}>
            {currentId > 1 && (
              <Link href={`/pokemon/${prevId}`} className={styles.navButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
                Previous
              </Link>
            )}
            <Link href={`/pokemon/${nextId}`} className={styles.navButton}>
              Next
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </Link>
          </div>
        </div>
        
        <div className={styles.detailCard}>
          <div className={styles.detailHeader}>
            <div className={styles.imageSection}>
              {image && (
                <div className={styles.imageWrapper}>
                  <Image 
                    src={image} 
                    alt={pokemon.name} 
                    width={300}
                    height={300}
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
              )}
            </div>
            
            <div className={styles.infoSection}>
              <h1>{pokemon.name}</h1>
              <div className={styles.studentId}>#{String(pokemon.pokedexId || pokemon.id).padStart(3, '0')}</div>
              
              {pokemon.types && pokemon.types.length > 0 && (
                <div className={styles.types}>
                  {pokemon.types.map((t) => (
                    <span key={t.id} className={`${styles.type} ${styles['type' + t.name.charAt(0).toUpperCase() + t.name.slice(1).toLowerCase()]}`}>
                      {t.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {pokemon.stats && Object.keys(pokemon.stats).length > 0 && (
            <div className={styles.statsSection}>
              <h2>📊 Grades</h2>
              <div className={styles.statsGrid}>
                {Object.entries(pokemon.stats).map(([k, v]) => (
                  <div key={k} className={styles.statItem}>
                    <div className={styles.statLabel}>{k.replace(/_/g, ' ')}</div>
                    <div className={styles.statBar}>
                      <div className={styles.statFill} style={{ width: `${Math.min((v || 0) / 2, 100)}%` }}></div>
                      <span className={styles.statValue}>{v}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pokemon.evolutions && pokemon.evolutions.length > 0 && (
            <div className={styles.evolutionSection}>
              <h2>📈 Academic Progression</h2>
              <div className={styles.evolutionChain}>
                {pokemon.evolutions.map((e, index) => (
                  <React.Fragment key={e.pokedexId}>
                    <Link href={`/pokemon/${e.pokedexId}`} className={styles.evolutionLink}>
                      <div className={styles.evolutionCard}>
                        <div className={styles.evolutionName}>{e.name}</div>
                        <div className={styles.evolutionId}>#{String(e.pokedexId).padStart(3, '0')}</div>
                      </div>
                    </Link>
                    {index < (pokemon.evolutions?.length || 0) - 1 && (
                      <svg className={styles.arrow} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<PokemonDetailProps> = async (context) => {
  const { id } = context.params as { id: string };
  
  try {
    const pokemon = await api.getPokemonByPokedexId(id);
    return { props: { pokemon } };
  } catch (e: any) {
    return { props: { pokemon: null, error: String(e.message || e) } };
  }
};
