
import { BlogItem } from "@/models/blog";
import { BlogSidebar } from "./BlogSidebar";
import { BlogArticle } from "./BlogArticle";
import { EmptyBlogState } from "./EmptyBlogState";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

interface BlogLayoutProps {
  blogItems: BlogItem[];
  selectedItem: BlogItem | null;
  selectedPath: string;
  onItemClick: (item: BlogItem) => void;
}

export const BlogLayout = ({ blogItems, selectedItem, selectedPath, onItemClick }: BlogLayoutProps) => {
  if (blogItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">No content available</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-200px)]">
      {/* Mobile View - No resizable panels */}
      <div className="lg:hidden flex w-full">
        <div className="flex-1 min-h-full">
          {selectedItem ? (
            <BlogArticle 
              selectedItem={selectedItem} 
              blogItems={blogItems}
              onItemClick={onItemClick}
            />
          ) : (
            <EmptyBlogState />
          )}
        </div>
      </div>

      {/* Desktop View - Resizable panels */}
      <div className="hidden lg:flex w-full">
        <ResizablePanelGroup direction="horizontal" className="w-full">
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            <BlogSidebar 
              blogItems={blogItems}
              onItemClick={onItemClick}
              selectedPath={selectedPath}
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={75} minSize={60}>
            {selectedItem ? (
              <BlogArticle 
                selectedItem={selectedItem} 
                blogItems={blogItems}
                onItemClick={onItemClick}
              />
            ) : (
              <EmptyBlogState />
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
