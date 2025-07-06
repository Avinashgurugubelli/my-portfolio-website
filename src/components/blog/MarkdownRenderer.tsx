
import ReactMarkdown from "react-markdown";
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  onLinkClick: (href: string) => boolean;
}

export const MarkdownRenderer = ({ content, onLinkClick }: MarkdownRendererProps) => {
  return (
    <div className="prose dark:prose-invert max-w-none overflow-hidden">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom heading renderer to ensure proper IDs for hash navigation
          h1: ({ children, ...props }) => {
            const id = typeof children === 'string' 
              ? children.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
              : undefined;
            return <h1 id={id} {...props} className="scroll-mt-36 break-words">{children}</h1>;
          },
          h2: ({ children, ...props }) => {
            const id = typeof children === 'string' 
              ? children.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
              : undefined;
            return <h2 id={id} {...props} className="scroll-mt-36 break-words">{children}</h2>;
          },
          h3: ({ children, ...props }) => {
            const id = typeof children === 'string' 
              ? children.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
              : undefined;
            return <h3 id={id} {...props} className="scroll-mt-36 break-words">{children}</h3>;
          },
          h4: ({ children, ...props }) => {
            const id = typeof children === 'string' 
              ? children.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
              : undefined;
            return <h4 id={id} {...props} className="scroll-mt-36 break-words">{children}</h4>;
          },
          h5: ({ children, ...props }) => {
            const id = typeof children === 'string' 
              ? children.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
              : undefined;
            return <h5 id={id} {...props} className="scroll-mt-36 break-words">{children}</h5>;
          },
          h6: ({ children, ...props }) => {
            const id = typeof children === 'string' 
              ? children.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
              : undefined;
            return <h6 id={id} {...props} className="scroll-mt-36 break-words">{children}</h6>;
          },
          // Custom paragraph renderer for better mobile wrapping
          p: ({ children, ...props }) => {
            return <p {...props} className="break-words overflow-wrap-anywhere">{children}</p>;
          },
          // Custom code block renderer for mobile compatibility
          pre: ({ children, ...props }) => {
            return (
              <pre 
                {...props} 
                className="overflow-x-auto max-w-full whitespace-pre-wrap break-words bg-muted/30 p-4 rounded-lg text-sm"
              >
                {children}
              </pre>
            );
          },
          // Custom table renderer for mobile scrolling
          table: ({ children, ...props }) => {
            return (
              <div className="overflow-x-auto max-w-full">
                <table {...props} className="min-w-full">
                  {children}
                </table>
              </div>
            );
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
                    onLinkClick(href);
                  }}
                  className="text-primary hover:underline cursor-pointer break-words"
                >
                  {children}
                </a>
              );
            }
            return <a href={href} {...props} className="break-words">{children}</a>;
          },
        }}
      >
        {content || '# Content not found\n\nThe requested content could not be loaded.'}
      </ReactMarkdown>
    </div>
  );
};
