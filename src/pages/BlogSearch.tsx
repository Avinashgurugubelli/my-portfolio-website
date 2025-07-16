
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchHeader from "@/components/search/SearchHeader";
import SearchResults from "@/components/search/SearchResults";
import { useWebWorkerSearch } from "@/hooks/useWebWorkerSearch";
import { BlogService } from "@/services/blogService";

const BlogSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const { searchResults, isLoading } = useWebWorkerSearch();

  // Update URL when search changes
  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    } else {
      setSearchParams({});
    }
  }, [searchQuery, setSearchParams]);

  const handleResultClick = (result: any) => {
    const categoryItems = result.allItems?.filter((r: any) => r.categoryId === result.categoryId) || [];
    const fullPath = BlogService.findItemPath(categoryItems.map((r: any) => r.item), result.item);
    
    if (fullPath && fullPath.length > 0) {
      const urlPath = fullPath.join('/');
      const url = `/blogs/${result.categoryId}/${urlPath}`;
      console.log('Opening URL:', url);
      navigate(url);
    } else {
      // Fallback: navigate to category
      navigate(`/blogs/${result.categoryId}`);
    }
  };

  const results = searchResults(searchQuery);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background text-foreground no-x-overflow"
      >
        <Navbar />
        <main className="pt-[120px] pb-20">
          <div className="max-w-4xl mx-auto px-4">
            <SearchHeader 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            
            <SearchResults
              searchQuery={searchQuery}
              results={results}
              onResultClick={handleResultClick}
              isLoading={isLoading}
            />
          </div>
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default BlogSearch;
