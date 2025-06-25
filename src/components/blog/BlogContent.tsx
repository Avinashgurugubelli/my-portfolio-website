
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogDirectory, BlogFile } from "@/models/blog";
import { BlogService } from "@/services/blogService";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

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
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content || '# Content not found\n\nThe requested content could not be loaded.'}
      </ReactMarkdown>
    </div>
  );
};
