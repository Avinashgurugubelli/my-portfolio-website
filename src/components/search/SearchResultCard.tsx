
import { CalendarIcon, UserIcon, FolderIcon, FileTextIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TagsDisplay } from "@/components/ui/TagsDisplay";

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

interface SearchResultCardProps {
  result: SearchResult;
  searchQuery: string;
  index: number;
  onClick: (result: SearchResult) => void;
}

const SearchResultCard = ({ result, searchQuery, index, onClick }: SearchResultCardProps) => {
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? 
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">{part}</mark> : 
        part
    );
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={() => onClick(result)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 mb-2">
            {result.item.type === "directory" ? (
              <FolderIcon className="h-4 w-4 text-blue-500" />
            ) : (
              <FileTextIcon className="h-4 w-4 text-green-500" />
            )}
            <Badge variant="outline" className="text-xs">
              {result.categoryTitle}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Score: {result.relevanceScore}
            </span>
          </div>
        </div>
        
        <CardTitle className="text-xl mb-2">
          {result.item.title ? highlightText(result.item.title, searchQuery) : 'Untitled'}
        </CardTitle>
        
        <CardDescription>
          {result.item.description && highlightText(result.item.description, searchQuery)}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
          {result.item.author && (
            <div className="flex items-center gap-1">
              <UserIcon className="h-3 w-3" />
              <span>{highlightText(result.item.author, searchQuery)}</span>
            </div>
          )}
          
          {(result.item.date || result.item.createdOn) && (
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              <span>{result.item.date || result.item.createdOn}</span>
            </div>
          )}
        </div>
        
        {result.item.tags && result.item.tags.length > 0 && (
          <TagsDisplay tags={result.item.tags} maxTags={4} />
        )}
        
        {result.path.length > 1 && (
          <div className="mt-3 text-xs text-muted-foreground">
            Path: {result.path.join(' > ')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchResultCard;
