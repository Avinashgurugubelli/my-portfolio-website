
import { useState, useEffect, useRef } from 'react';

interface SearchResult {
  item: any;
  categoryId: string;
  categoryTitle: string;
  path: string[];
  relevanceScore: number;
  allItems?: any[];
}

export const useWebWorkerSearch = () => {
  const [isLoading, setIsLoading] = useState(true);
  const workerRef = useRef<Worker | null>(null);
  const [searchCache, setSearchCache] = useState<Map<string, SearchResult[]>>(new Map());
  const [allItems, setAllItems] = useState<SearchResult[]>([]);

  useEffect(() => {
    // Initialize the web worker
    try {
      // Use dynamic import instead of new URL() to avoid Vite worker bundling issues
      workerRef.current = new Worker('/src/workers/searchWorker.ts', {
        type: 'module'
      });

      workerRef.current.onmessage = (event) => {
        const { type, data, query, error } = event.data;
        
        if (type === 'SEARCH_RESULTS') {
          setSearchCache(prev => new Map(prev.set(query, data)));
        } else if (type === 'INIT_COMPLETE') {
          setIsLoading(false);
          setAllItems(data || []);
          console.log('Search worker initialized successfully');
        } else if (type === 'INIT_ERROR') {
          console.error('Search worker initialization error:', error);
          setIsLoading(false);
        }
      };

      workerRef.current.onerror = (error) => {
        console.error('Search worker error:', error);
        setIsLoading(false);
      };

      // Initialize the worker
      workerRef.current.postMessage({ type: 'INIT' });

    } catch (error) {
      console.error('Failed to create search worker:', error);
      setIsLoading(false);
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const searchResults = (query: string): SearchResult[] => {
    if (!query.trim()) return [];
    
    // Check cache first
    if (searchCache.has(query)) {
      return searchCache.get(query) || [];
    }

    // Send search request to worker
    if (workerRef.current && !isLoading) {
      workerRef.current.postMessage({ 
        type: 'SEARCH', 
        query: query.trim() 
      });
    }

    return [];
  };

  return {
    searchResults,
    isLoading,
    allItems
  };
};
