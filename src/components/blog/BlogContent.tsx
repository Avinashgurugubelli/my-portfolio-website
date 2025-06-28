
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
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

  // Handle hash navigation after content loads
  useEffect(() => {
    if (content && window.location.hash) {
      const hash = window.location.hash.slice(1);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Small delay to ensure content is rendered
    }
  }, [content]);

  // Listen for hash changes in the URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
        components={{
          // Custom heading renderer to ensure proper IDs for hash navigation
          h1: ({ children, ...props }) => {
            const id = typeof children === 'string' 
              ? children.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
              : undefined;
            return <h1 id={id} {...props}>{children}</h1>;
          },
          h2: ({ children, ...props }) => {
            const id = typeof children === 'string' 
              ? children.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
              : undefined;
            return <h2 id={id} {...props}>{children}</h2>;
          },
          h3: ({ children, ...props }) => {
            const id = typeof children === 'string' 
              ? children.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
              : undefined;
            return <h3 id={id} {...props}>{children}</h3>;
          },
          h4: ({ children, ...props }) => {
            const id = typeof children === 'string' 
              ? children.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
              : undefined;
            return <h4 id={id} {...props}>{children}</h4>;
          },
          h5: ({ children, ...props }) => {
            const id = typeof children === 'string' 
              ? children.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
              : undefined;
            return <h5 id={id} {...props}>{children}</h5>;
          },
          h6: ({ children, ...props }) => {
            const id = typeof children === 'string' 
              ? children.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
              : undefined;
            return <h6 id={id} {...props}>{children}</h6>;
          },
        }}
      >
        {content || '# Content not found\n\nThe requested content could not be loaded.'}
      </ReactMarkdown>
    </div>
  );
};
