
import { useEffect } from 'react';

export const useHashNavigation = (content: string | undefined) => {
  // Helper function to scroll to element with proper offset
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      // Calculate offset for fixed navbar (120px) plus some padding
      const offset = 140;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Handle hash navigation after content loads
  useEffect(() => {
    if (content && window.location.hash) {
      const hash = window.location.hash.slice(1);
      setTimeout(() => {
        scrollToElement(hash);
      }, 200); // Increased timeout to ensure content is fully rendered
    }
  }, [content]);

  // Listen for hash changes in the URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setTimeout(() => {
          scrollToElement(hash);
        }, 100);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
};
