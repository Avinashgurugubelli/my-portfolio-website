
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TagsDisplayProps {
  tags: string[];
  maxTags?: number;
  className?: string;
}

export const TagsDisplay = ({ tags, maxTags = 6, className = "" }: TagsDisplayProps) => {
  const [showAll, setShowAll] = useState(false);
  
  if (!tags || tags.length === 0) return null;
  
  const displayTags = showAll ? tags : tags.slice(0, maxTags);
  const hasMore = tags.length > maxTags;
  
  return (
    <div className={`flex flex-wrap items-center gap-1 ${className}`}>
      {displayTags.map((tag, index) => (
        <Badge key={index} variant="secondary" className="text-xs">
          {tag}
        </Badge>
      ))}
      {hasMore && !showAll && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(true)}
          className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          +{tags.length - maxTags} more
        </Button>
      )}
      {showAll && hasMore && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(false)}
          className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          Show less
        </Button>
      )}
    </div>
  );
};
