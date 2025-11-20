import Link from 'next/link';
import Image from 'next/image';
import { Pokemon } from '../types';
import styles from '../styles/pokemonCard.module.css';

interface PokemonCardProps {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  if (!pokemon) return null;
  const id = pokemon.pokedexId || pokemon.id;
  const image = pokemon.image || pokemon.sprite;

  return (
    <div className={styles.pokemonCard}>
      <Link href={`/pokemon/${id}`}>
        <div className={styles.cardContent}>
          <div className={styles.imgWrap}>
            {image ? (
              <Image 
                src={image} 
                alt={pokemon.name} 
                width={110}
                height={110}
                style={{ objectFit: 'contain' }}
                loading="lazy"
              />
            ) : (
              <div className={styles.noImg}>
                <span className={styles.placeholderIcon}>?</span>
              </div>
            )}
          </div>
          <div className={styles.meta}>
            <h3>{pokemon.name}</h3>
            <div className={styles.metaId}>#{String(pokemon.pokedexId || pokemon.id).padStart(3, '0')}</div>
            <div className={styles.types}>
              {pokemon.types?.map((t) => {
                const typeName = t.name.toLowerCase();
                const typeClass = `type${t.name.charAt(0).toUpperCase() + t.name.slice(1).toLowerCase()}`;
                return (
                  <span key={t.id} className={`${styles.type} ${styles[typeClass] || ''}`}>
                    {t.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
