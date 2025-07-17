import ReactMarkdown from "react-markdown";
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  onLinkClick: (href: string) => boolean;
}

export const MarkdownRenderer = ({ content, onLinkClick }: MarkdownRendererProps) => {
  // Helper function to generate proper IDs from heading text
  const generateId = (children: any): string => {
    let text = '';
    if (typeof children === 'string') {
      text = children;
    } else if (Array.isArray(children)) {
      text = children.map(child => 
        typeof child === 'string' ? child : child?.props?.children || ''
      ).join('');
    } else if (children?.props?.children) {
      text = children.props.children;
    }
    
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  return (
    <div className="prose dark:prose-invert max-w-none overflow-hidden">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom heading renderer to ensure proper IDs for hash navigation
          h1: ({ children, ...props }) => {
            const id = generateId(children);
            return <h1 id={id} {...props} className="scroll-mt-36 break-words">{children}</h1>;
          },
          h2: ({ children, ...props }) => {
            const id = generateId(children);
            return <h2 id={id} {...props} className="scroll-mt-36 break-words">{children}</h2>;
          },
          h3: ({ children, ...props }) => {
            const id = generateId(children);
            return <h3 id={id} {...props} className="scroll-mt-36 break-words">{children}</h3>;
          },
          h4: ({ children, ...props }) => {
            const id = generateId(children);
            return <h4 id={id} {...props} className="scroll-mt-36 break-words">{children}</h4>;
          },
          h5: ({ children, ...props }) => {
            const id = generateId(children);
            return <h5 id={id} {...props} className="scroll-mt-36 break-words">{children}</h5>;
          },
          h6: ({ children, ...props }) => {
            const id = generateId(children);
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
          // Custom link handler for internal markdown links and hash navigation
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
            // Handle hash links within the same page
            if (href && href.startsWith('#')) {
              return (
                <a
                  {...props}
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    const elementId = href.slice(1);
                    const element = document.getElementById(elementId);
                    if (element) {
                      const offset = 140;
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - offset;
                      
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                      
                      // Update URL hash
                      window.history.pushState(null, '', href);
                    }
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