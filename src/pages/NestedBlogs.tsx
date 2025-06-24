
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { NestedBlogsData, BlogDirectory, BlogFile, BlogItem } from "@/models/blog";
import nestedBlogsJson from "@/config/nested-blogs.json";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { EmptyBlogState } from "@/components/blog/EmptyBlogState";

const NestedBlogs = () => {
  const { "*": wildcardPath } = useParams();
  const navigate = useNavigate();
  const [blogsData, setBlogsData] = useState<NestedBlogsData | null>(null);
  const [selectedItem, setSelectedItem] = useState<BlogDirectory | BlogFile | null>(null);
  const [selectedPath, setSelectedPath] = useState<string>("");

  // Load nested blogs data
  useEffect(() => {
    setBlogsData(nestedBlogsJson as NestedBlogsData);
  }, []);

  // Helper function to find item by path with better matching
  const findItemByPath = (items: BlogItem[], pathSegments: string[]): BlogDirectory | BlogFile | null => {
    if (pathSegments.length === 0) return null;
    
    console.log("Finding item for segments:", pathSegments);
    const currentSegment = decodeURIComponent(pathSegments[0]);
    console.log("Looking for segment:", currentSegment);
    
    const item = items.find(item => {
      const matches = [
        item.label === currentSegment,
        item.title === currentSegment,
        item.title.toLowerCase() === currentSegment.toLowerCase(),
        item.title.replace(/\s+/g, ' ').trim() === currentSegment.replace(/\s+/g, ' ').trim(),
        item.title.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim().toLowerCase() === 
          currentSegment.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim().toLowerCase()
      ];
      
      if (item.type === "file") {
        matches.push(
          item.path.includes(currentSegment),
          item.path.split('/').pop()?.replace('.md', '') === currentSegment
        );
      }
      
      return matches.some(Boolean);
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
        setSelectedPath(foundItem.type === "file" ? foundItem.path : foundItem.label);
      } else {
        console.log("Item not found for path:", pathSegments);
        // Try alternative approach - find by title matching
        const findByTitle = (items: BlogItem[], title: string): BlogItem | null => {
          for (const item of items) {
            if (item.title.toLowerCase().replace(/\s+/g, '').includes(title.toLowerCase().replace(/\s+/g, ''))) {
              return item;
            }
            if (item.type === "directory" && item.children) {
              const found = findByTitle(item.children, title);
              if (found) return found;
            }
          }
          return null;
        };
        
        const lastSegment = pathSegments[pathSegments.length - 1];
        const alternativeItem = findByTitle(blogsData.blogs as BlogItem[], lastSegment);
        if (alternativeItem) {
          setSelectedItem(alternativeItem);
          setSelectedPath(alternativeItem.type === "file" ? alternativeItem.path : alternativeItem.label);
        }
      }
    }
  }, [wildcardPath, blogsData]);

  const handleItemClick = (item: BlogDirectory | BlogFile) => {
    setSelectedItem(item);
    const newPath = item.type === "file" ? item.path : item.label;
    setSelectedPath(newPath);
    
    // Create URL path for navigation
    const urlPath = encodeURIComponent(item.title);
    const parentPath = findParentPath(blogsData?.blogs as BlogItem[] || [], item);
    const fullPath = parentPath ? `${parentPath}/${urlPath}` : urlPath;
    
    navigate(`/nested-blogs/${fullPath}`, { replace: true });
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
            <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-120px)]">
              <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                <BlogSidebar 
                  blogItems={blogsData.blogs as BlogItem[]}
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
          </div>
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default NestedBlogs;
