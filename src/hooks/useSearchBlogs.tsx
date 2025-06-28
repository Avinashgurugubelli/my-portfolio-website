
import { useState, useEffect, useMemo } from "react";
import { BlogService } from "@/services/blogService";
import { BlogItem, BlogsData } from "@/models/blog";
import { searchBlogItems } from "@/utils/searchUtils";

interface SearchResult {
  item: BlogItem;
  categoryId: string;
  categoryTitle: string;
  path: string[];
  relevanceScore: number;
}

export const useSearchBlogs = () => {
  const [blogsData, setBlogsData] = useState<BlogsData | null>(null);
  const [allBlogItems, setAllBlogItems] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAllBlogs = async () => {
      try {
        setIsLoading(true);
        const data = await BlogService.fetchBlogsData();
        setBlogsData(data);
        
        // Flatten all blog items for searching
        const allItems: SearchResult[] = [];
        
        for (const category of data.categories) {
          if (category.indexUrl) {
            // Fetch nested structure
            try {
              const nestedIndex = await BlogService.fetchNestedBlogIndex(category.indexUrl);
              const flattenItems = (items: BlogItem[], path: string[] = []): void => {
                items.forEach(item => {
                  const currentPath = [...path, item.title || ''];
                  allItems.push({
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
            } catch (error) {
              console.error(`Failed to load nested index for ${category.id}:`, error);
            }
          } else if (category.children) {
            // Simple articles
            category.children.forEach(post => {
              const blogItem: BlogItem = {
                id: post.id,
                type: "file",
                path: post.path || post.contentPath || '',
                title: post.title || '',
                description: post.description,
                date: post.date,
              };
              
              allItems.push({
                item: blogItem,
                categoryId: category.id,
                categoryTitle: category.title,
                path: [post.title || ''],
                relevanceScore: 0
              });
            });
          }
        }
        
        setAllBlogItems(allItems);
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
      if (!searchQuery.trim() || allBlogItems.length === 0) {
        return [];
      }
      return searchBlogItems(allBlogItems, searchQuery);
    };
  }, [allBlogItems]);

  return {
    searchResults,
    allBlogItems,
    isLoading
  };
};
