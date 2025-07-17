
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchHeader from "@/components/search/SearchHeader";
import SearchResults from "@/components/search/SearchResults";
import { useSimpleSearch } from "@/hooks/useSimpleSearch";
import { BlogService } from "@/services/blogService";

const BlogSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryFromUrl = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(queryFromUrl);
  const { searchResults, isLoading } = useSimpleSearch();

  // Sync searchQuery with URL parameters when URL changes
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    if (urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
    }
  }, [searchParams]);

  // Update URL only when user types in the search box (not when syncing from URL)
  const handleSearchChange = (newQuery: string) => {
    setSearchQuery(newQuery);
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery });
    } else {
      setSearchParams({});
    }
  };

  const handleResultClick = (result: any) => {
    console.log('Search result clicked:', result);
    
    // For nested blog items, we need to construct the proper URL path
    if (result.item && result.item.path) {
      const itemPath = result.item.path;
      console.log('Item path:', itemPath);
      
      // Extract the path after the category to build the URL
      // Example: "/blogs/system-design/01-general/predicate-and-index-range-locks.md"
      // Should become: "general-system-design-principles/predicate-and-index-range-locks"
      
      const pathParts = itemPath.split('/').filter(Boolean);
      console.log('Path parts:', pathParts);
      
      // Find the category index (e.g., "system-design")
      const categoryIndex = pathParts.findIndex(part => part === result.categoryId);
      
      if (categoryIndex !== -1 && categoryIndex < pathParts.length - 1) {
        // Get the parts after the category
        const urlParts = pathParts.slice(categoryIndex + 1);
        console.log('URL parts:', urlParts);
        
        // Convert each part to URL-friendly format
        const convertedParts = urlParts.map(part => {
          // Remove file extension and convert to slug
          const cleanPart = part.replace(/\.(md|txt)$/i, '');
          return BlogService.generateUrlSlug(cleanPart);
        });
        
        const fullUrlPath = convertedParts.join('/');
        const finalUrl = `/blogs/${result.categoryId}/${fullUrlPath}`;
        
        console.log('Navigating to:', finalUrl);
        navigate(finalUrl);
      } else {
        // Fallback: navigate to category
        console.log('Fallback to category:', result.categoryId);
        navigate(`/blogs/${result.categoryId}`);
      }
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
              onSearchChange={handleSearchChange}
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
