import Link from 'next/link';
import Image from 'next/image';
import { Pokemon } from '../types';
import styles from '../styles/pokemonCard.module.css';
import { useFavorites } from '../pages/_app';
import { useComparison } from '../pages/_app';

interface PokemonCardProps {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  if (!pokemon) return null;
  const id = pokemon.pokedexId || pokemon.id;
  const image = pokemon.image || pokemon.sprite;
  const { isFavorite, toggleFavorite } = useFavorites();
  const { comparisonMode, isSelected, toggleSelection, selectedPokemon } = useComparison();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (comparisonMode) {
      e.preventDefault();
      toggleSelection(id);
    }
  };

  const isCardSelected = isSelected(id);
  const canSelect = selectedPokemon.length < 3 || isCardSelected;

  return (
    <div 
      className={`${styles.pokemonCard} ${isCardSelected ? styles.selected : ''} ${comparisonMode && !canSelect ? styles.disabled : ''}`}
      onClick={handleCardClick}
    >
      <button 
        className={`${styles.favoriteBtn} ${isFavorite(id) ? styles.active : ''}`}
        onClick={handleFavoriteClick}
        aria-label={isFavorite(id) ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorite(id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
      {comparisonMode && isCardSelected && (
        <div className={styles.selectionBadge}>
          {selectedPokemon.indexOf(id) + 1}
        </div>
      )}
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
