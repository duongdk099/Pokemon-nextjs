import { useState, useEffect, createContext, useContext } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { DarkModeContextValue } from '../types';
import '../styles/globals.css';

const DarkModeContext = createContext<DarkModeContextValue | undefined>(undefined);

export function useDarkMode(): DarkModeContextValue {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeContext.Provider');
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

  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
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

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  if (!mounted) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <Component {...pageProps} />
      </DarkModeContext.Provider>
    </QueryClientProvider>
  );
}

export default MyApp;
