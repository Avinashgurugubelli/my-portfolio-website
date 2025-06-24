
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
</lovwrite>

<lov-write file_path="src/components/blog/BlogSidebar.tsx">
import { ArrowLeftIcon, FolderIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BlogTree } from "./BlogTree";
import { BlogItem } from "@/models/blog";

interface BlogSidebarProps {
  blogItems: BlogItem[];
  onItemClick: (item: BlogItem) => void;
  selectedPath: string;
}

export const BlogSidebar = ({ blogItems, onItemClick, selectedPath }: BlogSidebarProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-card/50">
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/blogs')}
            className="gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Blogs
          </Button>
        </div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FolderIcon className="h-5 w-5 text-blue-500" />
          Blog Structure
        </h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          <BlogTree 
            items={blogItems}
            onItemClick={onItemClick}
            selectedPath={selectedPath}
          />
        </div>
      </ScrollArea>
    </div>
  );
};
