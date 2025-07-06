
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BlogCategory } from "@/models/blog";
import { BlogService } from "@/services/blogService";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { BlogLayout } from "@/components/blog/BlogLayout";
import { BottomMobileBlogMenu } from "@/components/blog/BottomMobileBlogMenu";
import { useBlogItems } from "@/hooks/useBlogItems";
import { useBlogNavigation } from "@/hooks/useBlogNavigation";
import blogsJson from "@/config/blogs.json";

const BlogViewer = () => {
  const { categoryId, "*": wildcardPath } = useParams();

  // Get category info
  const category = blogsJson.categories.find(cat => cat.id === categoryId) as BlogCategory;

  // Fetch nested blog index if available
  const { data: nestedIndex, isLoading: isLoadingIndex } = useQuery({
    queryKey: ['blogIndex', category?.indexUrl],
    queryFn: () => BlogService.fetchNestedBlogIndex(category!.indexUrl!),
    enabled: !!(category?.indexUrl),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  // Custom hooks for managing blog items and navigation
  const blogItems = useBlogItems(nestedIndex, category);
  const { selectedItem, selectedPath, handleItemClick } = useBlogNavigation(
    blogItems, 
    wildcardPath, 
    categoryId
  );

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
              <BlogHeader
                category={category}
                blogItems={blogItems}
                onItemClick={handleItemClick}
                selectedPath={selectedPath}
              />

              <BlogLayout
                blogItems={blogItems}
                selectedItem={selectedItem}
                selectedPath={selectedPath}
                onItemClick={handleItemClick}
              />

              {/* Bottom Mobile Menu */}
              {blogItems.length > 0 && (
                <BottomMobileBlogMenu 
                  blogItems={blogItems}
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

export default BlogViewer;
