
import { useState, useEffect, useRef, useCallback } from 'react';
import { BlogCategory } from '@/models/blog';

interface UseLazyBlogsProps {
  categories: BlogCategory[];
  itemsPerPage?: number;
}

export const useLazyBlogs = ({ categories, itemsPerPage = 3 }: UseLazyBlogsProps) => {
  const [visibleItems, setVisibleItems] = useState<BlogCategory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const loadMoreItems = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    // Simulate network delay for smooth loading
    setTimeout(() => {
      const nextItems = categories.slice(currentIndex, currentIndex + itemsPerPage);
      
      if (nextItems.length === 0) {
        setHasMore(false);
      } else {
        setVisibleItems(prev => [...prev, ...nextItems]);
        setCurrentIndex(prev => prev + itemsPerPage);
        
        if (currentIndex + itemsPerPage >= categories.length) {
          setHasMore(false);
        }
      }
      
      setIsLoading(false);
    }, 300);
  }, [categories, currentIndex, itemsPerPage, isLoading, hasMore]);

  // Initialize with first batch
  useEffect(() => {
    if (categories.length > 0 && visibleItems.length === 0) {
      const initialItems = categories.slice(0, itemsPerPage);
      setVisibleItems(initialItems);
      setCurrentIndex(itemsPerPage);
      setHasMore(categories.length > itemsPerPage);
    }
  }, [categories, itemsPerPage]);

  // Set up intersection observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, loadMoreItems]);

  return {
    visibleItems,
    isLoading,
    hasMore,
    loadingRef
  };
};
