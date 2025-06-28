
import { motion } from "framer-motion";
import { TagIcon, CalendarIcon, UserIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const highlightText = (text: string | undefined, searchQuery: string): React.ReactNode => {
    if (!text || !searchQuery.trim()) return text || '';
    
    const terms = searchQuery.toLowerCase().split(/\s+/).filter(term => term.length > 0);
    let highlightedText = text;
    
    terms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '|||HIGHLIGHT_START|||$1|||HIGHLIGHT_END|||');
    });
    
    const parts = highlightedText.split(/\|\|\|HIGHLIGHT_START\|\|\||HIGHLIGHT_END\|\|\|/);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">{part}</mark>;
      }
      return part;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onClick(result)}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">
                {highlightText(result.item.title, searchQuery)}
              </CardTitle>
              <CardDescription className="text-base mb-3">
                {result.item.description && highlightText(result.item.description, searchQuery)}
              </CardDescription>
            </div>
            <Badge variant="secondary">{result.categoryTitle}</Badge>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {result.item.author && (
              <div className="flex items-center gap-1">
                <UserIcon className="h-3 w-3" />
                <span>{result.item.author}</span>
              </div>
            )}
            
            {(result.item.date || (result.item.type === "file" && result.item.createdOn)) && (
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                <span>{result.item.date || (result.item.type === "file" ? result.item.createdOn : '')}</span>
              </div>
            )}
          </div>
        </CardHeader>
        
        {result.item.type === "file" && result.item.tags && result.item.tags.length > 0 && (
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 flex-wrap">
              <TagIcon className="h-3 w-3 text-muted-foreground" />
              {result.item.tags.map((tag, tagIndex) => (
                <Badge key={tagIndex} variant="outline" className="text-xs">
                  {highlightText(tag, searchQuery)}
                </Badge>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
};

export default SearchResultCard;
