
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
    <div className="flex min-h-[calc(100vh-200px)]">
      {/* Mobile View - No resizable panels */}
      <div className="lg:hidden flex w-full">
        <div className="flex-1">
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
            <div className="h-full bg-card/50">
              <div className="p-4 border-b border-border flex-shrink-0">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-blue-500">📁</span>
                  Blog Structure
                </h2>
              </div>
              
              <div className="overflow-y-auto h-[calc(100vh-300px)]">
                <div className="p-4">
                  <BlogSidebar 
                    blogItems={blogItems}
                    onItemClick={onItemClick}
                    selectedPath={selectedPath}
                  />
                </div>
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={75} minSize={60}>
            <div className="h-full">
              <div className="p-6">
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
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
