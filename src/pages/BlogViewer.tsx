import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BlogCategory, NestedBlogIndex, BlogItem } from "@/models/blog";
import { BlogService } from "@/services/blogService";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { EmptyBlogState } from "@/components/blog/EmptyBlogState";
import blogsJson from "@/config/blogs.json";
import { MobileBlogMenu } from "@/components/blog/MobileBlogMenu";

const BlogViewer = () => {
  const { categoryId, "*": wildcardPath } = useParams();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<BlogItem | null>(null);
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [blogItems, setBlogItems] = useState<BlogItem[]>([]);

  // Get category info
  const category = blogsJson.categories.find(cat => cat.id === categoryId) as BlogCategory;

  // Fetch nested blog index if available
  const { data: nestedIndex, isLoading: isLoadingIndex } = useQuery({
    queryKey: ['blogIndex', category?.indexUrl],
    queryFn: () => BlogService.fetchNestedBlogIndex(category!.indexUrl!),
    enabled: !!(category?.indexUrl),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

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

  // Set up blog items based on structure type
  useEffect(() => {
    console.log("Setting up blog items. NestedIndex:", nestedIndex, "Category:", category);
    if (nestedIndex) {
      // Nested structure
      setBlogItems(nestedIndex.children || []);
    } else if (category?.children) {
      // Simple articles - convert to BlogItem format
      const convertedItems: BlogItem[] = category.children.map(post => ({
        id: post.id,
        type: "file" as const,
        path: post.path || post.contentPath || '',
        title: post.title,
        description: post.description,
        date: post.date,
      }));
      setBlogItems(convertedItems);
    }
  }, [nestedIndex, category]);

  // Auto-select first article when blog items are loaded and no URL path
  useEffect(() => {
    console.log("Auto-selecting first article. BlogItems length:", blogItems.length, "WildcardPath:", wildcardPath);
    if (blogItems.length > 0 && !wildcardPath) {
      const firstFile = findFirstFile(blogItems);
      console.log("First file found:", firstFile);
      if (firstFile) {
        setSelectedItem(firstFile);
        setSelectedPath(firstFile.type === "file" ? firstFile.path : firstFile.id);
      }
    }
  }, [blogItems, wildcardPath]);

  // Handle direct URL access with improved logging
  useEffect(() => {
    console.log("Handling direct URL access. WildcardPath:", wildcardPath, "BlogItems length:", blogItems.length);
    if (wildcardPath && blogItems.length > 0) {
      const pathSegments = wildcardPath.split('/').filter(Boolean);
      console.log("Path segments for direct access:", pathSegments);
      
      const foundItem = BlogService.findBlogItemByPath(blogItems, pathSegments);
      console.log("Found item for direct URL:", foundItem);
      
      if (foundItem) {
        setSelectedItem(foundItem);
        setSelectedPath(foundItem.type === "file" ? foundItem.path : foundItem.id);
      } else {
        console.log("Item not found, falling back to first file");
        const firstFile = findFirstFile(blogItems);
        if (firstFile) {
          setSelectedItem(firstFile);
          setSelectedPath(firstFile.type === "file" ? firstFile.path : firstFile.id);
        }
      }
    }
  }, [wildcardPath, blogItems]);

  const handleItemClick = (item: BlogItem) => {
    console.log("Item clicked:", item);
    // Only update content, don't navigate
    setSelectedItem(item);
    setSelectedPath(item.type === "file" ? item.path : item.id);
    
    // Update URL without navigation for deep linking support
    const fullPath = BlogService.findItemPath(blogItems, item);
    console.log("Generated full path for item:", fullPath);
    
    if (fullPath) {
      const urlPath = fullPath.join('/');
      console.log("Updating URL to:", `/blogs/${categoryId}/${urlPath}`);
      window.history.replaceState(null, '', `/blogs/${categoryId}/${urlPath}`);
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Category not found</p>
      </div>
    );
  }

  if (isLoadingIndex) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading blog structure...</p>
      </div>
    );
  }

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
                  {/* Header row with back button and mobile menu */}
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
                    {blogItems.length > 0 && (
                      <MobileBlogMenu 
                        blogItems={blogItems}
                        onItemClick={handleItemClick}
                        selectedPath={selectedPath}
                      />
                    )}
                  </div>
                  
                  {/* Title and description */}
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2">{category.title}</h1>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-muted-foreground line-clamp-3 cursor-help">
                          {category.description}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-md">
                        <p>{category.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {blogItems.length > 0 ? (
                <div className="flex">
                  {/* Desktop Sidebar - Hidden on mobile */}
                  <div className="hidden lg:block w-80 border-r border-border">
                    <BlogSidebar 
                      blogItems={blogItems}
                      onItemClick={handleItemClick}
                      selectedPath={selectedPath}
                    />
                  </div>
                  
                  {/* Content Area - Full width on mobile, remaining space on desktop */}
                  <div className="flex-1 min-h-[calc(100vh-200px)]">
                    {selectedItem ? (
                      <BlogArticle selectedItem={selectedItem} />
                    ) : (
                      <EmptyBlogState />
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[400px]">
                  <p className="text-muted-foreground">No content available</p>
                </div>
              )}
            </div>
          </main>
          <Footer />
        </motion.div>
      </AnimatePresence>
    </TooltipProvider>
  );
};

export default BlogViewer;
