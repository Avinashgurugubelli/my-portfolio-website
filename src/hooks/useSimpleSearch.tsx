
import { useState, useEffect, useMemo } from 'react';
import { searchBlogItems } from '@/utils/searchUtils';

interface SearchResult {
  item: any;
  categoryId: string;
  categoryTitle: string;
  path: string[];
  relevanceScore: number;
  allItems?: any[];
}

export const useSimpleSearch = () => {
  const [allItems, setAllItems] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAllBlogs = async () => {
      try {
        setIsLoading(true);
        
        // Import the blogs data directly
        const blogsModule = await import('@/config/blogs.json');
        const blogsData = blogsModule.default;
        
        const allBlogItems: SearchResult[] = [];
        
        for (const category of blogsData.categories) {
          if (category.indexUrl) {
            // For nested structures, we'll need to fetch them
            try {
              const response = await fetch(category.indexUrl);
              if (response.ok) {
                const nestedIndex = await response.json();
                const flattenItems = (items: any[], path: string[] = []): void => {
                  items.forEach(item => {
                    const currentPath = [...path, item.title || ''];
                    allBlogItems.push({
                      item,
                      categoryId: category.id,
                      categoryTitle: category.title,
                      path: currentPath,
                      relevanceScore: 0
                    });
                    
                    if (item.type === "directory" && item.children) {
                      flattenItems(item.children, currentPath);
                    }
                  });
                };
                
                if (nestedIndex.children) {
                  flattenItems(nestedIndex.children);
                }
              }
            } catch (error) {
              console.error(`Failed to load nested index for ${category.id}:`, error);
            }
          } else if (category.children) {
            // Simple articles
            category.children.forEach(post => {
              allBlogItems.push({
                item: {
                  id: post.id,
                  type: "file",
                  path: post.path || post.contentPath || '',
                  title: post.title || '',
                  description: post.description,
                  date: post.date,
                },
                categoryId: category.id,
                categoryTitle: category.title,
                path: [post.title || ''],
                relevanceScore: 0
              });
            });
          }
        }
        
        setAllItems(allBlogItems);
      } catch (error) {
        console.error('Failed to load blogs data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAllBlogs();
  }, []);

  const searchResults = useMemo(() => {
    return (searchQuery: string) => {
      if (!searchQuery.trim() || allItems.length === 0) {
        return [];
      }
      return searchBlogItems(allItems, searchQuery);
    };
  }, [allItems]);

  return {
    searchResults,
    isLoading,
    allItems
  };
};
