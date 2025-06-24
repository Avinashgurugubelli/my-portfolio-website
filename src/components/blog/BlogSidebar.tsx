
import { ArrowLeftIcon, FolderIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BlogTree } from "./BlogTree";
import { BlogItem } from "@/models/blog";

interface BlogSidebarProps {
  blogItems: BlogItem[];
  onItemClick: (item: BlogItem) => void;
  selectedPath: string;
}

export const BlogSidebar = ({ blogItems, onItemClick, selectedPath }: BlogSidebarProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-card/50">
      <div className="p-4 border-b border-border flex-shrink-0">
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
