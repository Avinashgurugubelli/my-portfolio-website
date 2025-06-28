
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SearchIcon, ArrowLeftIcon, TagIcon, CalendarIcon, UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlogService } from "@/services/blogService";
import { BlogItem, BlogsData } from "@/models/blog";

interface SearchResult {
  item: BlogItem;
  categoryId: string;
  categoryTitle: string;
  path: string[];
  relevanceScore: number;
}

const BlogSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [blogsData, setBlogsData] = useState<BlogsData | null>(null);
  const [allBlogItems, setAllBlogItems] = useState<SearchResult[]>([]);

  // Load all blog data on mount
  useEffect(() => {
    const loadAllBlogs = async () => {
      try {
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
                  const currentPath = [...path, item.title];
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
                title: post.title,
                description: post.description,
                date: post.date,
              };
              
              allItems.push({
                item: blogItem,
                categoryId: category.id,
                categoryTitle: category.title,
                path: [post.title],
                relevanceScore: 0
              });
            });
          }
        }
        
        setAllBlogItems(allItems);
      } catch (error) {
        console.error('Failed to load blogs data:', error);
      }
    };
    
    loadAllBlogs();
  }, []);

  // Perform search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || allBlogItems.length === 0) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    const searchTerms = query.split(/\s+/).filter(term => term.length > 0);
    
    const scoredResults = allBlogItems.map(result => {
      let score = 0;
      const item = result.item;
      
      // Title matching (highest weight)
      if (item?.title?.toLowerCase().includes(query)) {
        score += 10;
      }
      searchTerms.forEach(term => {
        if (item?.title?.toLowerCase().includes(term)) {
          score += 5;
        }
      });
      
      // Description matching
      if (item?.description?.toLowerCase().includes(query)) {
        score += 8;
      }
      searchTerms.forEach(term => {
        if (item?.description?.toLowerCase().includes(term)) {
          score += 3;
        }
      });
      
      // Tags matching (only for files)
      if (item.type === "file" && item.tags) {
        item.tags.forEach(tag => {
          if (tag.toLowerCase().includes(query)) {
            score += 6;
          }
          searchTerms.forEach(term => {
            if (tag.toLowerCase().includes(term)) {
              score += 2;
            }
          });
        });
      }
      
      // Author matching
      if (item.author?.toLowerCase().includes(query)) {
        score += 4;
      }
      
      // Category matching
      if (result.categoryTitle.toLowerCase().includes(query)) {
        score += 3;
      }
      
      return { ...result, relevanceScore: score };
    });
    
    return scoredResults
      .filter(result => result.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }, [searchQuery, allBlogItems]);

  // Update URL when search changes
  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    } else {
      setSearchParams({});
    }
  }, [searchQuery, setSearchParams]);

  // Highlight search terms in text
  const highlightText = (text: string, searchQuery: string): React.ReactNode => {
    if (!searchQuery.trim()) return text;
    
    const terms = searchQuery.toLowerCase().split(/\s+/).filter(term => term.length > 0);
    let highlightedText = text;
    
    terms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '|||HIGHLIGHT_START|||$1|||HIGHLIGHT_END|||');
    });
    
    const parts = highlightedText.split(/\|\|\|HIGHLIGHT_START\|\|\||HIGHLIGHT_END\|\|\|/);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">{part}</mark>;
      }
      return part;
    });
  };

  const handleResultClick = (result: SearchResult) => {
    const fullPath = BlogService.findItemPath(allBlogItems.filter(r => r.categoryId === result.categoryId).map(r => r.item), result.item);
    if (fullPath) {
      const urlPath = fullPath.join('/');
      navigate(`/blogs/${result.categoryId}/${urlPath}`);
    } else {
      navigate(`/blogs/${result.categoryId}`);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background text-foreground"
      >
        <Navbar />
        <main className="pt-[120px] pb-20">
          <div className="max-w-4xl mx-auto px-4">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/blogs')}
                  className="gap-2"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Back to Blogs
                </Button>
                <div>
                  <h1 className="text-3xl font-bold">Search Blogs</h1>
                  <p className="text-muted-foreground">Find articles by title, content, tags, or author</p>
                </div>
              </div>

              {/* Search Input */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                  autoFocus
                />
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {searchQuery.trim() && (
                <div className="text-sm text-muted-foreground">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                </div>
              )}
              
              {searchResults.map((result, index) => (
                <motion.div
                  key={`${result.categoryId}-${result.item.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleResultClick(result)}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">
                            {highlightText(result.item.title, searchQuery)}
                          </CardTitle>
                          <CardDescription className="text-base mb-3">
                            {result.item.description && highlightText(result.item.description, searchQuery)}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">{result.categoryTitle}</Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {result.item.author && (
                          <div className="flex items-center gap-1">
                            <UserIcon className="h-3 w-3" />
                            <span>{result.item.author}</span>
                          </div>
                        )}
                        
                        {(result.item.date || (result.item.type === "file" && result.item.createdOn)) && (
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            <span>{result.item.date || (result.item.type === "file" ? result.item.createdOn : '')}</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    
                    {result.item.type === "file" && result.item.tags && result.item.tags.length > 0 && (
                      <CardContent className="pt-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <TagIcon className="h-3 w-3 text-muted-foreground" />
                          {result.item.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {highlightText(tag, searchQuery)}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              ))}
              
              {searchQuery.trim() && searchResults.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No articles found for "{searchQuery}"</p>
                  <p className="text-muted-foreground text-sm mt-2">Try different keywords or browse categories</p>
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default BlogSearch;
