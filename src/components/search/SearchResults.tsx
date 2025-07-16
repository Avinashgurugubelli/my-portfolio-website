
import SearchResultCard from "./SearchResultCard";
import { SearchPagination } from "./SearchPagination";
import { SearchLoadingSkeleton } from "./SearchLoadingSkeleton";
import { useState } from "react";

interface SearchResult {
  item: any;
  categoryId: string;
  categoryTitle: string;
  path: string[];
  relevanceScore: number;
}

interface SearchResultsProps {
  searchQuery: string;
  results: SearchResult[];
  onResultClick: (result: SearchResult) => void;
  isLoading?: boolean;
}

export default function SearchResults({ 
  searchQuery, 
  results, 
  onResultClick,
  isLoading = false 
}: SearchResultsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Calculate pagination
  const totalItems = results.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = results.slice(startIndex, endIndex);

  // Reset to page 1 when search query changes
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  if (isLoading) {
    return <SearchLoadingSkeleton />;
  }

  if (!searchQuery.trim()) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Enter a search term to find articles across all blog categories.
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No articles found for "{searchQuery}". Try different keywords or check the spelling.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Found {totalItems} result{totalItems !== 1 ? 's' : ''} for "{searchQuery}"
        </p>
      </div>

      <div className="space-y-4">
        {currentResults.map((result, index) => (
          <SearchResultCard
            key={`${result.categoryId}-${result.item.id}-${index}`}
            result={result}
            searchQuery={searchQuery}
            onClick={() => onResultClick(result)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <SearchPagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newItemsPerPage) => {
            setItemsPerPage(newItemsPerPage);
            setCurrentPage(1);
          }}
        />
      )}
    </div>
  );
}
