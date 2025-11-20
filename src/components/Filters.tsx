import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import styles from '../styles/filters.module.css';

interface FiltersProps {
  onSearch?: (search: string) => void;
  onTypes?: (types: number[] | null) => void;
  onLimit?: (limit: number) => void;
  initialLimit?: number;
}

function Filters({ onSearch, onTypes, onLimit, initialLimit = 50 }: FiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [limit, setLimit] = useState(initialLimit);

  const { data: types = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['types'],
    queryFn: api.fetchTypes,
    staleTime: 10 * 60 * 1000, 
    gcTime: 30 * 60 * 1000, 
  });

  useEffect(() => {
    const t = setTimeout(() => onSearch && onSearch(searchQuery.trim()), 250);
    return () => clearTimeout(t);
  }, [searchQuery, onSearch]);

  useEffect(() => {
    onTypes && onTypes(selectedTypes.length ? selectedTypes : null);
  }, [selectedTypes, onTypes]);

  useEffect(() => {
    onLimit && onLimit(limit);
  }, [limit, onLimit]);

  const toggleType = useCallback((id: number) => {
    setSelectedTypes((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      return [...prev, id];
    });
  }, []);

  const typeLabels = useMemo(() => {
    return types.map((t) => {
      const id = `type-${t.id}`;
      return (
        <label key={t.id} className={styles.typeLabel} htmlFor={id}>
          <input id={id} type="checkbox" value={t.id} checked={selectedTypes.includes(t.id)} onChange={() => toggleType(t.id)} />
          <span>{t.name}</span>
        </label>
      );
    });
  }, [types, selectedTypes, toggleType]);

  return (
    <div className={styles.filters}>
      <div className={styles.searchWrapper}>
        <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search student name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.typesFilter}>
        {isLoading ? (
          <div className={styles.typesLoading}>
            <span className={styles.spinner} aria-hidden="true"></span>
            <span className={styles.visuallyHidden}>Loading types…</span>
          </div>
        ) : isError ? (
          <div className={styles.typesError}>
            <span>Failed to load types</span>
            <button type="button" onClick={() => refetch()} aria-label="Retry fetching types">
              Retry
            </button>
          </div>
        ) : (
          <div className={styles.typesList}>
            <span className={styles.filterLabel}>Filter by type:</span>
            {typeLabels}
          </div>
        )}
      </div>

      <div className={styles.limitWrapper}>
        <label htmlFor="limit-select" className={styles.limitLabel}>Per page:</label>
        <select id="limit-select" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  );
}

export default React.memo(Filters);
