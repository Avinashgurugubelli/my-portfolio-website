import { useQuery } from "@tanstack/react-query";
import { BlogItem } from "@/models/blog";
import { BlogService } from "@/services/blogService";
import { NextArticleButton } from "./NextArticleButton";
import { useMarkdownLinks } from "@/hooks/useMarkdownLinks";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, BookOpenIcon, CalendarIcon, ExternalLinkIcon, UserIcon } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "@/components/ui/button";
import { TagsDisplay } from "../ui/TagsDisplay";
import { BlogContent } from "./BlogContent";
import { Separator } from "@radix-ui/react-separator";

interface BlogArticleProps {
  selectedItem: BlogItem;
  blogItems: BlogItem[];
  onItemClick: (item: BlogItem) => void;
}

export const BlogArticle = ({ selectedItem, blogItems, onItemClick }: BlogArticleProps) => {
  const { handleMarkdownLinkClick } = useMarkdownLinks(selectedItem, blogItems);

  const { data: content, isLoading, error } = useQuery({
    queryKey: ['blogContent', selectedItem.type === "file" ? selectedItem.path : selectedItem.id],
    queryFn: async () => {
      if (selectedItem.type === "file") {
        if (selectedItem.path) {
          return BlogService.fetchBlogContent(selectedItem.path);
        }
        throw new Error('No path available for file');
      } else {
        // For directories, show description or a default message
        return selectedItem.description || `# ${selectedItem.title}\n\nThis is a directory containing multiple articles.`;
      }
    },
    enabled: !!selectedItem,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load content: {error instanceof Error ? error.message : 'Unknown error'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <article className="p-6 lg:p-10 max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {selectedItem.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
            {selectedItem.author && (
              <div className="flex items-center">
                <UserIcon className="h-4 w-4 mr-2" />
                <span>{selectedItem.author}</span>
              </div>
            )}
            
            {(selectedItem.date || selectedItem.createdOn) && (
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>{selectedItem.date || selectedItem.createdOn}</span>
              </div>
            )}
            
            {selectedItem.sourcePath && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-8"
              >
                <a 
                  href={selectedItem.sourcePath} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLinkIcon className="h-3 w-3" />
                  View Source
                </a>
              </Button>
            )}
          </div>
          
          {selectedItem.description && (
            <p className="text-xl text-muted-foreground mb-6">
              {selectedItem.description}
            </p>
          )}

          {selectedItem.type === "file" && selectedItem.tags && (
            <div className="mb-6">
              <TagsDisplay tags={selectedItem.tags} maxTags={6} />
            </div>
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

        <BlogContent item={selectedItem} blogItems={blogItems} />

        {/* Next Article Button */}
        {blogItems && onItemClick && selectedItem.type === "file" && (
          <NextArticleButton
            blogItems={blogItems}
            currentItem={selectedItem}
            onItemClick={onItemClick}
          />
        )}
      </article>
    </ScrollArea>
  );
};
