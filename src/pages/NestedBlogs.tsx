import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { NestedBlogsData, BlogDirectory, BlogFile, BlogItem } from "@/models/blog";
import nestedBlogsJson from "@/config/nested-blogs.json";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { EmptyBlogState } from "@/components/blog/EmptyBlogState";
import { MobileBlogMenu } from "@/components/blog/MobileBlogMenu";
import { BottomMobileBlogMenu } from "@/components/blog/BottomMobileBlogMenu";

const NestedBlogs = () => {
  const { "*": wildcardPath } = useParams();
  const navigate = useNavigate();
  const [blogsData, setBlogsData] = useState<NestedBlogsData | null>(null);
  const [selectedItem, setSelectedItem] = useState<BlogDirectory | BlogFile | null>(null);
  const [selectedPath, setSelectedPath] = useState<string>("");

  // Helper function to find first file in the tree
  const findFirstFile = (items: BlogItem[]): BlogItem | null => {
    for (const item of items) {
      if (item.type === "file") {
        return item;
      }
      if (item.type === "directory" && item.children) {
        const found = findFirstFile(item.children);
        if (found) return found;
      }
    }
    return null;
  };

  // Load nested blogs data
  useEffect(() => {
    console.log("Loading nested blogs data...");
    console.log("Nested blogs JSON:", nestedBlogsJson);
    setBlogsData(nestedBlogsJson as NestedBlogsData);
  }, []);

  // Auto-select first article when data is loaded and no URL path
  useEffect(() => {
    if (blogsData && !wildcardPath) {
      const firstFile = findFirstFile(blogsData.blogs as BlogItem[]);
      if (firstFile) {
        setSelectedItem(firstFile);
        setSelectedPath(firstFile.type === "file" ? firstFile.path : firstFile.id);
      }
    }
  }, [blogsData, wildcardPath]);

  // Improved helper function to find item by path
  const findItemByPath = (items: BlogItem[], pathSegments: string[]): BlogDirectory | BlogFile | null => {
    if (pathSegments.length === 0) return null;
    
    console.log("Finding item for segments:", pathSegments);
    const currentSegment = decodeURIComponent(pathSegments[0]);
    console.log("Looking for segment:", currentSegment);
    
    const item = items.find(item => {
      // Try multiple matching strategies
      const titleMatch = item.title.toLowerCase() === currentSegment.toLowerCase();
      const idMatch = item.id === currentSegment;
      const urlEncodedMatch = encodeURIComponent(item.title) === pathSegments[0];
      
      // For files, also check path-based matching
      if (item.type === "file") {
        const pathMatch = item.path.includes(currentSegment);
        const filenameMatch = item.path.split('/').pop()?.replace('.md', '') === currentSegment;
        return titleMatch || idMatch || urlEncodedMatch || pathMatch || filenameMatch;
      }
      
      return titleMatch || idMatch || urlEncodedMatch;
    });
    
    console.log("Found item:", item);
    
    if (!item) return null;
    
    if (pathSegments.length === 1) {
      return item;
    }
    
    if (item.type === "directory" && item.children) {
      return findItemByPath(item.children, pathSegments.slice(1));
    }
    
    return null;
  };

  // Handle direct URL access with improved path parsing
  useEffect(() => {
    console.log("Wildcard path:", wildcardPath);
    if (wildcardPath && blogsData) {
      const pathSegments = wildcardPath.split('/').filter(Boolean);
      console.log("Path segments:", pathSegments);
      
      const foundItem = findItemByPath(blogsData.blogs as BlogItem[], pathSegments);
      
      if (foundItem) {
        console.log("Found item:", foundItem);
        setSelectedItem(foundItem);
        setSelectedPath(foundItem.type === "file" ? foundItem.path : foundItem.id);
      } else {
        console.log("Item not found for path:", pathSegments);
        const findByPartialTitle = (items: BlogItem[], searchTerm: string): BlogItem | null => {
          for (const item of items) {
            const normalizedTitle = item.title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
            const normalizedSearch = searchTerm.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
            
            if (normalizedTitle.includes(normalizedSearch) || normalizedSearch.includes(normalizedTitle)) {
              return item;
            }
            
            if (item.type === "directory" && item.children) {
              const found = findByPartialTitle(item.children, searchTerm);
              if (found) return found;
            }
          }
          return null;
        };
        
        const lastSegment = pathSegments[pathSegments.length - 1];
        const alternativeItem = findByPartialTitle(blogsData.blogs as BlogItem[], lastSegment);
        if (alternativeItem) {
          setSelectedItem(alternativeItem);
          setSelectedPath(alternativeItem.type === "file" ? alternativeItem.path : alternativeItem.id);
        }
      }
    }
  }, [wildcardPath, blogsData]);

  const handleItemClick = (item: BlogDirectory | BlogFile) => {
    // Only update content, don't navigate
    setSelectedItem(item);
    const newPath = item.type === "file" ? item.path : item.id;
    setSelectedPath(newPath);
    
    // Update URL without navigation for deep linking support
    const urlPath = encodeURIComponent(item.title);
    const parentPath = findParentPath(blogsData?.blogs as BlogItem[] || [], item);
    const fullPath = parentPath ? `${parentPath}/${urlPath}` : urlPath;
    
    console.log("Updating URL to:", fullPath);
    window.history.replaceState(null, '', `/nested-blogs/${fullPath}`);
  };

  const findParentPath = (items: BlogItem[], targetItem: BlogDirectory | BlogFile, currentPath = ""): string | null => {
    for (const item of items) {
      if (item === targetItem) {
        return currentPath;
      }
      
      if (item.type === "directory" && item.children) {
        const childPath = currentPath ? 
          `${currentPath}/${encodeURIComponent(item.title)}` : 
          encodeURIComponent(item.title);
        
        const result = findParentPath(item.children, targetItem, childPath);
        if (result !== null) {
          return result;
        }
      }
    }
    return null;
  };

  if (!blogsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading blogs...</p>
      </div>
    );
  }

  console.log("Rendering with blogs data:", blogsData);

  return (
    <TooltipProvider>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-background text-foreground relative"
        >
          <Navbar />
          <main className="pt-[120px]">
            <div className="max-w-7xl mx-auto min-h-[calc(100vh-120px)]">
              <div className="p-4 border-b border-border">
                <div className="flex flex-col gap-4 mb-4">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/blogs')}
                      className="gap-2"
                    >
                      <ArrowLeftIcon className="h-4 w-4" />
                      Back to Articles
                    </Button>
                    {blogsData && (
                      <MobileBlogMenu 
                        blogItems={blogsData.blogs as BlogItem[]}
                        onItemClick={handleItemClick}
                        selectedPath={selectedPath}
                      />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2">Nested Blogs</h1>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-muted-foreground line-clamp-3 cursor-help">
                          Explore the nested blog structure with organized content and categories
                        </p>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-md">
                        <p>Explore the nested blog structure with organized content and categories</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>

              <div className="flex">
                <div className="hidden lg:block w-80 border-r border-border">
                  <BlogSidebar 
                    blogItems={blogsData?.blogs as BlogItem[] || []}
                    onItemClick={handleItemClick}
                    selectedPath={selectedPath}
                  />
                </div>
                
                <div className="flex-1 min-h-[calc(100vh-200px)]">
                  {selectedItem ? (
                    <BlogArticle 
                      selectedItem={selectedItem}
                      blogItems={blogsData?.blogs as BlogItem[] || []}
                      onItemClick={handleItemClick}
                    />
                  ) : (
                    <EmptyBlogState />
                  )}
                </div>
              </div>

              {blogsData && (
                <BottomMobileBlogMenu 
                  blogItems={blogsData.blogs as BlogItem[]}
                  onItemClick={handleItemClick}
                  selectedPath={selectedPath}
                />
              )}
            </div>
          </main>
          <Footer />
        </motion.div>
      </AnimatePresence>
    </TooltipProvider>
  );
};

export default NestedBlogs;
