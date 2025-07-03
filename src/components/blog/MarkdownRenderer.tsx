
import ReactMarkdown from "react-markdown";
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  onLinkClick: (href: string) => boolean;
}

export const MarkdownRenderer = ({ content, onLinkClick }: MarkdownRendererProps) => {
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
            return <h1 id={id} {...props} className="scroll-mt-36">{children}</h1>;
          },
          h2: ({ children, ...props }) => {
            const id = typeof children === 'string' 
              ? children.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
              : undefined;
            return <h2 id={id} {...props} className="scroll-mt-36">{children}</h2>;
          },
          h3: ({ children, ...props }) => {
            const id = typeof children === 'string' 
              ? children.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
              : undefined;
            return <h3 id={id} {...props} className="scroll-mt-36">{children}</h3>;
          },
          h4: ({ children, ...props }) => {
            const id = typeof children === 'string' 
              ? children.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
              : undefined;
            return <h4 id={id} {...props} className="scroll-mt-36">{children}</h4>;
          },
          h5: ({ children, ...props }) => {
            const id = typeof children === 'string' 
              ? children.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
              : undefined;
            return <h5 id={id} {...props} className="scroll-mt-36">{children}</h5>;
          },
          h6: ({ children, ...props }) => {
            const id = typeof children === 'string' 
              ? children.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
              : undefined;
            return <h6 id={id} {...props} className="scroll-mt-36">{children}</h6>;
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
