
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogDirectory, BlogFile } from "@/models/blog";
import { BlogService } from "@/services/blogService";
import { useHashNavigation } from "@/hooks/useHashNavigation";
import { useMarkdownLinks } from "@/hooks/useMarkdownLinks";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface BlogContentProps {
  item: BlogDirectory | BlogFile;
}

export const BlogContent = ({ item }: BlogContentProps) => {
  const { data: content, isLoading, error } = useQuery({
    queryKey: ['blogContent', item.type === "file" ? item.path : item.id],
    queryFn: async () => {
      if (item.type === "file" && item.path) {
        return BlogService.fetchBlogContent(item.path);
      }
      return '# Welcome\n\nSelect a file from the sidebar to view its content.';
    },
    enabled: true,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  // Use custom hooks for hash navigation and markdown links
  useHashNavigation(content);
  const { handleMarkdownLinkClick } = useMarkdownLinks(item);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive">
        Error loading content: {(error as Error).message}
      </div>
    );
  }

  return (
    <MarkdownRenderer 
      content={content || '# Content not found\n\nThe requested content could not be loaded.'} 
      onLinkClick={handleMarkdownLinkClick}
    />
  );
};
