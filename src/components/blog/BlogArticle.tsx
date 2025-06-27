
import { UserIcon, BookOpenIcon, CalendarIcon, ExternalLinkIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { BlogDirectory, BlogFile } from "@/models/blog";
import { BlogContent } from "./BlogContent";

interface BlogArticleProps {
  selectedItem: BlogDirectory | BlogFile;
}

export const BlogArticle = ({ selectedItem }: BlogArticleProps) => {
  const getGitHubUrl = () => {
    if (selectedItem.type === "file" && selectedItem.path) {
      // Convert the path to GitHub URL
      const githubBaseUrl = "https://github.com/avinashgurugubelli/avinashgurugubelli.github.io/blob/main/public/";
      return `${githubBaseUrl}${selectedItem.path}`;
    }
    return null;
  };

  const githubUrl = getGitHubUrl();

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
            
            {githubUrl && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-8"
              >
                <a 
                  href={githubUrl} 
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
  );
};
