
import { FolderIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BlogTree } from "./BlogTree";
import { BlogItem } from "@/models/blog";

interface BlogSidebarProps {
  blogItems: BlogItem[];
  onItemClick: (item: BlogItem) => void;
  selectedPath: string;
}

export const BlogSidebar = ({ blogItems, onItemClick, selectedPath }: BlogSidebarProps) => {
  return (
    <div className="flex flex-col h-full bg-card/50">
      <div className="p-4 border-b border-border flex-shrink-0">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FolderIcon className="h-5 w-5 text-blue-500" />
          Blog Structure
        </h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          <BlogTree 
            items={blogItems}
            onItemClick={onItemClick}
            selectedPath={selectedPath}
          />
        </div>
      </ScrollArea>
    </div>
  );
};
