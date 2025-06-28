
import { useState, useEffect, useMemo } from "react";
import { BlogService } from "@/services/blogService";
import { BlogItem, BlogsData } from "@/models/blog";

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
            // Simple articles - BlogPost doesn't have tags, so we don't include them
            category.children.forEach(post => {
              const blogItem: BlogItem = {
                id: post.id,
                type: "file",
                path: post.path || post.contentPath || '',
                title: post.title || '',
                description: post.description,
                date: post.date,
                // Don't add tags here as BlogPost type doesn't have tags property
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

      const query = searchQuery.toLowerCase();
      const searchTerms = query.split(/\s+/).filter(term => term.length > 0);
      
      const scoredResults = allBlogItems.map(result => {
        let score = 0;
        const item = result.item;
        
        // Title matching (highest weight) - with null checks
        const title = item?.title || '';
        if (title.toLowerCase().includes(query)) {
          score += 15;
        }
        searchTerms.forEach(term => {
          if (title.toLowerCase().includes(term)) {
            score += 8;
          }
        });
        
        // Description matching - with null checks
        const description = item?.description || '';
        if (description.toLowerCase().includes(query)) {
          score += 12;
        }
        searchTerms.forEach(term => {
          if (description.toLowerCase().includes(term)) {
            score += 6;
          }
        });
        
        // Tags matching (highest priority for exact matches) - with null checks
        if (item.type === "file" && item.tags && Array.isArray(item.tags)) {
          item.tags.forEach(tag => {
            const tagStr = (tag || '').toLowerCase();
            // Exact tag match gets very high score
            if (tagStr === query) {
              score += 20;
            } else if (tagStr.includes(query)) {
              score += 10;
            }
            searchTerms.forEach(term => {
              if (tagStr === term) {
                score += 15;
              } else if (tagStr.includes(term)) {
                score += 5;
              }
            });
          });
        }
        
        // Author matching - with null checks
        const author = item?.author || '';
        if (author.toLowerCase().includes(query)) {
          score += 8;
        }
        searchTerms.forEach(term => {
          if (author.toLowerCase().includes(term)) {
            score += 4;
          }
        });
        
        // References matching - check title, authors, publisher
        if (item.type === "file" && item.references && Array.isArray(item.references)) {
          item.references.forEach(ref => {
            // Reference title
            const refTitle = (ref.title || '').toLowerCase();
            if (refTitle.includes(query)) {
              score += 6;
            }
            searchTerms.forEach(term => {
              if (refTitle.includes(term)) {
                score += 3;
              }
            });
            
            // Reference authors (both single author and authors array)
            const authors = ref.authors || (ref.author ? [ref.author] : []);
            authors.forEach(author => {
              const authorStr = (author || '').toLowerCase();
              if (authorStr.includes(query)) {
                score += 5;
              }
              searchTerms.forEach(term => {
                if (authorStr.includes(term)) {
                  score += 2;
                });
              });
            });
            
            // Reference publisher
            const publisher = (ref.publisher || '').toLowerCase();
            if (publisher.includes(query)) {
              score += 4;
            }
            searchTerms.forEach(term => {
              if (publisher.includes(term)) {
                score += 2;
              }
            });
          });
        }
        
        // Category matching - with null checks
        const categoryTitle = result.categoryTitle || '';
        if (categoryTitle.toLowerCase().includes(query)) {
          score += 5;
        }
        searchTerms.forEach(term => {
          if (categoryTitle.toLowerCase().includes(term)) {
            score += 2;
          }
        });
        
        return { ...result, relevanceScore: score };
      });
      
      return scoredResults
        .filter(result => result.relevanceScore > 0)
        .sort((a, b) => b.relevanceScore - a.relevanceScore);
    };
  }, [allBlogItems]);

  return {
    searchResults,
    allBlogItems,
    isLoading
  };
};
