
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogDirectory, BlogFile } from "@/models/blog";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

interface BlogContentProps {
  item: BlogDirectory | BlogFile;
  path?: string;
}

export const BlogContent = ({ item, path }: BlogContentProps) => {
  const contentUrl = item.type === "directory" ? item.indexUrl : (item as BlogFile).path;
  
  const { data: content, isLoading, error } = useQuery({
    queryKey: ['nestedBlogContent', contentUrl || path],
    queryFn: async () => {
      if (!contentUrl && !path) return '';
      const url = contentUrl || path;
      const response = await fetch(url.startsWith('/') ? url : `/${url}`);
      if (!response.ok) {
        throw new Error(`Failed to load content: ${response.statusText}`);
      }
      return response.text();
    },
    enabled: !!(contentUrl || path),
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
