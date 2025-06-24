
import { UserIcon, BookOpenIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BlogDirectory, BlogFile } from "@/models/blog";
import { BlogContent } from "./BlogContent";

interface BlogArticleProps {
  selectedItem: BlogDirectory | BlogFile;
}

export const BlogArticle = ({ selectedItem }: BlogArticleProps) => {
  return (
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
  );
};
