import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BlogCategory, BlogItem } from "@/models/blog";
import { MobileBlogMenu } from "./MobileBlogMenu";

interface BlogHeaderProps {
  category: BlogCategory;
  blogItems: BlogItem[];
  onItemClick: (item: BlogItem) => void;
  selectedPath: string;
}

export const BlogHeader = ({ category, blogItems, onItemClick, selectedPath }: BlogHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 border-b border-border">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/blogs')}
            className="gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Articles
          </Button>
          {/* Keep top mobile menu for initial access */}
          {blogItems.length > 0 && (
            <MobileBlogMenu 
              blogItems={blogItems}
              onItemClick={onItemClick}
              selectedPath={selectedPath}
            />
          )}
        </div>
        
        {/* Title and description */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{category.title}</h1>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-muted-foreground line-clamp-3 cursor-help">
                {category.description}
              </p>
            </TooltipTrigger>
            <TooltipContent className="max-w-md">
              <p>{category.description}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
