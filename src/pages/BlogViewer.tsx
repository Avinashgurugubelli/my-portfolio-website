
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { BlogCategory, NestedBlogIndex, BlogItem } from "@/models/blog";
import { BlogService } from "@/services/blogService";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { EmptyBlogState } from "@/components/blog/EmptyBlogState";
import blogsJson from "@/config/blogs.json";

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

  // Set up blog items based on structure type
  useEffect(() => {
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

  // Handle direct URL access
  useEffect(() => {
    if (wildcardPath && blogItems.length > 0) {
      const pathSegments = wildcardPath.split('/').filter(Boolean);
      const foundItem = BlogService.findBlogItemByPath(blogItems, pathSegments);
      
      if (foundItem) {
        setSelectedItem(foundItem);
        setSelectedPath(foundItem.type === "file" ? foundItem.path : foundItem.id);
      }
    }
  }, [wildcardPath, blogItems]);

  const handleItemClick = (item: BlogItem) => {
    setSelectedItem(item);
    setSelectedPath(item.type === "file" ? item.path : item.id);
    
    // Update URL
    const itemPath = BlogService.generateBlogPath(item);
    navigate(`/blogs/${categoryId}/${itemPath}`, { replace: true });
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
              <div className="flex items-center gap-4 mb-4">
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
                  <h1 className="text-2xl font-bold">{category.title}</h1>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
              </div>
            </div>

            {blogItems.length > 0 ? (
              <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-200px)]">
                <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                  <BlogSidebar 
                    blogItems={blogItems}
                    onItemClick={handleItemClick}
                    selectedPath={selectedPath}
                  />
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={75}>
                  <div className="flex flex-col h-full">
                    {selectedItem ? (
                      <BlogArticle selectedItem={selectedItem} />
                    ) : (
                      <EmptyBlogState />
                    )}
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
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
  );
};

export default BlogViewer;
