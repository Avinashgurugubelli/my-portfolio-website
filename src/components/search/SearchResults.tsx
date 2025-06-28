
import SearchResultCard from "./SearchResultCard";

interface SearchResult {
  item: {
    id: string;
    type: string;
    title?: string;
    description?: string;
    author?: string;
    date?: string;
    createdOn?: string;
    tags?: string[];
  };
  categoryId: string;
  categoryTitle: string;
  path: string[];
  relevanceScore: number;
}

interface SearchResultsProps {
  searchQuery: string;
  results: SearchResult[];
  onResultClick: (result: SearchResult) => void;
}

const SearchResults = ({ searchQuery, results, onResultClick }: SearchResultsProps) => {
  return (
    <div className="space-y-6">
      {searchQuery.trim() && (
        <div className="text-sm text-muted-foreground">
          {results.length} result{results.length !== 1 ? 's' : ''} for "{searchQuery}"
        </div>
      )}
      
      {results.map((result, index) => (
        <SearchResultCard
          key={`${result.categoryId}-${result.item.id}`}
          result={result}
          searchQuery={searchQuery}
          index={index}
          onClick={onResultClick}
        />
      ))}
      
      {searchQuery.trim() && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No articles found for "{searchQuery}"</p>
          <p className="text-muted-foreground text-sm mt-2">Try different keywords or browse categories</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
