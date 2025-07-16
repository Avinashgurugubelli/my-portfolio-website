import { useQuery } from "@tanstack/react-query";
import { BlogItem } from "@/models/blog";
import { BlogService } from "@/services/blogService";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { useMarkdownLinks } from "@/hooks/useMarkdownLinks";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface BlogArticleProps {
  selectedItem: BlogItem;
  blogItems: BlogItem[];
  onItemClick: (item: BlogItem) => void;
}

export const BlogArticle = ({ selectedItem, blogItems, onItemClick }: BlogArticleProps) => {
  const { handleMarkdownLinkClick } = useMarkdownLinks(selectedItem, blogItems);

  const { data: content, isLoading, error } = useQuery({
    queryKey: ['blogContent', selectedItem.type === "file" ? selectedItem.path : selectedItem.id],
    queryFn: async () => {
      if (selectedItem.type === "file") {
        if (selectedItem.path) {
          return BlogService.fetchBlogContent(selectedItem.path);
        }
        throw new Error('No path available for file');
      } else {
        // For directories, show description or a default message
        return selectedItem.description || `# ${selectedItem.title}\n\nThis is a directory containing multiple articles.`;
      }
    },
    enabled: !!selectedItem,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load content: {error instanceof Error ? error.message : 'Unknown error'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-none">
      <MarkdownRenderer 
        content={content || ''} 
        onLinkClick={handleMarkdownLinkClick}
      />
    </div>
  );
};
