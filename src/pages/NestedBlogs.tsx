
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon, CalendarIcon, UserIcon, BookOpenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { NestedBlogsData, BlogDirectory, BlogFile, BlogItem } from "@/models/blog";
import ReactMarkdown from "react-markdown";
import { useQuery } from "@tanstack/react-query";
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';

// Blog tree component for sidebar
const BlogTree = ({ 
  items, 
  onItemClick, 
  selectedPath, 
  level = 0 
}: { 
  items: BlogItem[]; 
  onItemClick: (item: BlogItem) => void;
  selectedPath: string;
  level?: number;
}) => {
  const [openDirectories, setOpenDirectories] = useState<Set<string>>(new Set());

  const toggleDirectory = (label: string) => {
    const newSet = new Set(openDirectories);
    if (newSet.has(label)) {
      newSet.delete(label);
    } else {
      newSet.add(label);
    }
    setOpenDirectories(newSet);
  };

  return (
    <div className={`space-y-1 ${level > 0 ? 'ml-4 border-l border-border pl-2' : ''}`}>
      {items.map((item) => (
        <div key={item.label}>
          {item.type === "directory" ? (
            <Collapsible 
              open={openDirectories.has(item.label)}
              onOpenChange={() => toggleDirectory(item.label)}
            >
              <div className="space-y-1">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left h-auto p-2 ${
                      selectedPath === item.label ? 'bg-accent' : ''
                    }`}
                    onClick={() => onItemClick(item)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{item.title}</div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground truncate mt-1">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {item.children && (
                    <BlogTree 
                      items={item.children} 
                      onItemClick={onItemClick}
                      selectedPath={selectedPath}
                      level={level + 1}
                    />
                  )}
                </CollapsibleContent>
              </div>
            </Collapsible>
          ) : (
            <Button
              variant="ghost"
              className={`w-full justify-start text-left h-auto p-2 ${
                selectedPath === item.path ? 'bg-accent' : ''
              }`}
              onClick={() => onItemClick(item)}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{item.title}</div>
              </div>
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

// Content loader component
const BlogContent = ({ item, path }: { item: BlogDirectory | BlogFile; path?: string }) => {
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
        remarkPlugins={[remarkGfm, remarkSlug]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content || '# Content not found\n\nThe requested content could not be loaded.'}
      </ReactMarkdown>
    </div>
  );
};

const NestedBlogs = () => {
  const { "*": wildcardPath } = useParams();
  const navigate = useNavigate();
  const [blogsData, setBlogsData] = useState<NestedBlogsData | null>(null);
  const [selectedItem, setSelectedItem] = useState<BlogDirectory | BlogFile | null>(null);
  const [selectedPath, setSelectedPath] = useState<string>("");

  // Load nested blogs data
  useEffect(() => {
    // For now, we'll use the existing blogs.json and transform it
    // In the future, you can replace this with your nested structure
    import("@/config/blogs.json").then((data) => {
      // Transform existing data to nested structure for demo
      const transformedData: NestedBlogsData = {
        blogs: data.categories.map(category => ({
          label: category.id,
          type: "directory" as const,
          title: category.title,
          description: category.description,
          author: "Avinash Gurugubelli",
          children: category.posts.map(post => ({
            label: post.id,
            type: "file" as const,
            path: post.contentPath || `/blogs/${category.id}/${post.id}.md`,
            title: post.title,
            description: post.description,
          }))
        }))
      };
      setBlogsData(transformedData);
    });
  }, []);

  // Handle direct URL access
  useEffect(() => {
    console.log("Wildcard path:", wildcardPath);
    if (wildcardPath && blogsData) {
      // Parse the path and find the corresponding item
      const pathSegments = wildcardPath.split('/').filter(Boolean);
      console.log("Path segments:", pathSegments);
      
      // Find the item based on the path
      let currentItems = blogsData.blogs;
      let foundItem: BlogDirectory | BlogFile | null = null;
      
      for (const segment of pathSegments) {
        const item = currentItems.find(item => item.label === segment);
        if (item) {
          foundItem = item;
          if (item.type === "directory" && item.children) {
            currentItems = item.children;
          }
        } else {
          break;
        }
      }
      
      if (foundItem) {
        setSelectedItem(foundItem);
        setSelectedPath(foundItem.type === "file" ? foundItem.path : foundItem.label);
      }
    }
  }, [wildcardPath, blogsData]);

  const handleItemClick = (item: BlogDirectory | BlogFile) => {
    setSelectedItem(item);
    const newPath = item.type === "file" ? item.path : item.label;
    setSelectedPath(newPath);
    
    // Update URL without page reload
    const urlPath = item.type === "file" ? 
      item.path.replace(/^\/blogs\//, '').replace(/\.md$/, '') : 
      item.label;
    navigate(`/nested-blogs/${urlPath}`, { replace: true });
  };

  if (!blogsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading blogs...</p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background text-foreground relative"
      >
        <Navbar />
        <main className="pt-[120px]">
          <div className="flex max-w-7xl mx-auto min-h-[calc(100vh-120px)]">
            {/* Sidebar */}
            <aside className="w-80 border-r border-border bg-card/50">
              <div className="p-4 border-b border-border">
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
                <h2 className="text-lg font-semibold">Blog Structure</h2>
              </div>
              
              <ScrollArea className="h-[calc(100vh-220px)]">
                <div className="p-4">
                  <BlogTree 
                    items={blogsData.blogs}
                    onItemClick={handleItemClick}
                    selectedPath={selectedPath}
                  />
                </div>
              </ScrollArea>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
              {selectedItem ? (
                <ScrollArea className="flex-1">
                  <article className="p-6 lg:p-10 max-w-4xl mx-auto">
                    <header className="mb-8">
                      <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        {selectedItem.title}
                      </h1>
                      
                      {selectedItem.type === "directory" && selectedItem.author && (
                        <div className="flex items-center text-muted-foreground mb-4">
                          <UserIcon className="h-4 w-4 mr-2" />
                          <span>{selectedItem.author}</span>
                        </div>
                      )}
                      
                      {selectedItem.description && (
                        <p className="text-xl text-muted-foreground mb-6">
                          {selectedItem.description}
                        </p>
                      )}
                      
                      {selectedItem.type === "directory" && selectedItem.references && (
                        <div className="mb-6">
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <BookOpenIcon className="h-4 w-4" />
                            References
                          </h3>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {selectedItem.references.map((ref, index) => (
                              <li key={index}>
                                <strong>{ref.title}</strong> by {ref.author}
                                {ref.link && (
                                  <a 
                                    href={ref.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="ml-2 text-primary hover:underline"
                                  >
                                    [Link]
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <Separator className="my-6" />
                    </header>

                    <BlogContent item={selectedItem} />
                  </article>
                </ScrollArea>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Welcome to My Blog</h2>
                    <p className="text-muted-foreground mb-6">
                      Select a topic from the sidebar to start reading
                    </p>
                    <div className="text-sm text-muted-foreground">
                      Browse through nested categories and articles using the tree structure on the left.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default NestedBlogs;
