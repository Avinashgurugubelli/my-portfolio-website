
import { BlogItem } from "@/models/blog";
import { BlogSidebar } from "./BlogSidebar";
import { BlogArticle } from "./BlogArticle";
import { EmptyBlogState } from "./EmptyBlogState";

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
    <div className="flex">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block w-80 border-r border-border">
        <BlogSidebar 
          blogItems={blogItems}
          onItemClick={onItemClick}
          selectedPath={selectedPath}
        />
      </div>
      
      <div className="flex-1 min-h-[calc(100vh-200px)]">
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
  );
};
