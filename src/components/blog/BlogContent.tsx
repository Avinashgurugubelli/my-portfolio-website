
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const navigate = useNavigate();
  const { categoryId } = useParams();

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
      }, 100);
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

  const handleMarkdownLinkClick = (href: string) => {
    console.log("Handling markdown link click:", href);
    
    // Handle internal markdown links (relative paths ending with .md)
    if (href.endsWith('.md') && !href.startsWith('http')) {
      console.log("Processing relative markdown link:", href);
      
      // Handle relative paths with ../
      if (href.startsWith('../')) {
        // Extract the folder and filename from the relative path
        // Example: ../oops/01-introduction.md -> folder: oops, filename: 01-introduction.md
        const pathParts = href.split('/');
        const filename = pathParts[pathParts.length - 1]; // Get the last part (filename)
        const folderPath = pathParts.slice(1, -1); // Get middle parts (folder structure), excluding '../' and filename
        
        console.log("Relative path parts:", { pathParts, filename, folderPath });
        
        if (folderPath.length > 0) {
          // For paths like ../oops/01-introduction.md
          const targetFolder = folderPath[0]; // First folder after ../
          const fileSlug = BlogService.generateFileSlug(filename);
          
          // Navigate to the target folder with the file
          const newUrl = `/blogs/${targetFolder}/${fileSlug}`;
          console.log("Navigating to relative path:", newUrl);
          navigate(newUrl);
          return false;
        } else {
          // For paths like ../filename.md (sibling directory)
          const fileSlug = BlogService.generateFileSlug(filename);
          const newUrl = `/blogs/${categoryId}/${fileSlug}`;
          console.log("Navigating to sibling file:", newUrl);
          navigate(newUrl);
          return false;
        }
      }
      
      // Handle same-directory relative paths (./filename.md or just filename.md)
      let filename = href.replace('./', '');
      console.log("Processing same-directory filename:", filename);
      
      // Generate the basic slug
      const fileSlug = BlogService.generateFileSlug(filename);
      console.log("Generated file slug:", fileSlug);
      
      // Build the full nested path based on the current item's path structure
      let fullPath = '';
      
      if (item.type === "file" && item.path) {
        // Get the directory structure from the current file's path
        const pathParts = item.path.split('/');
        // Remove the filename and the leading "/blogs" and category parts
        const categoryIndex = pathParts.findIndex(part => part === categoryId);
        if (categoryIndex !== -1) {
          // Take everything after the category but before the filename
          const directoryParts = pathParts.slice(categoryIndex + 1, -1);
          console.log("Directory parts:", directoryParts);
          
          if (directoryParts.length > 0) {
            // Convert directory names to URL format
            const urlDirectoryParts = directoryParts.map(part => 
              BlogService.generateUrlSlug(part.replace(/^\d+[-.]/, ''))
            );
            fullPath = `${urlDirectoryParts.join('/')}/${fileSlug}`;
          } else {
            fullPath = fileSlug;
          }
        } else {
          fullPath = fileSlug;
        }
      } else {
        fullPath = fileSlug;
      }
      
      const newUrl = `/blogs/${categoryId}/${fullPath}`;
      console.log("Navigating to same-directory:", newUrl);
      
      navigate(newUrl);
      return false;
    }
    return true;
  };

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
          // Custom link handler for internal markdown links
          a: ({ href, children, ...props }) => {
            if (href && href.endsWith('.md') && !href.startsWith('http')) {
              return (
                <a
                  {...props}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMarkdownLinkClick(href);
                  }}
                  className="text-primary hover:underline cursor-pointer"
                >
                  {children}
                </a>
              );
            }
            return <a href={href} {...props}>{children}</a>;
          },
        }}
      >
        {content || '# Content not found\n\nThe requested content could not be loaded.'}
      </ReactMarkdown>
    </div>
  );
};
