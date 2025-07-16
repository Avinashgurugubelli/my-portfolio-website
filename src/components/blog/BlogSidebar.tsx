
import { BlogTree } from "./BlogTree";
import { BlogItem } from "@/models/blog";

interface BlogSidebarProps {
  blogItems: BlogItem[];
  onItemClick: (item: BlogItem) => void;
  selectedPath: string;
}

export const BlogSidebar = ({ blogItems, onItemClick, selectedPath }: BlogSidebarProps) => {
  return (
    <BlogTree 
      items={blogItems}
      onItemClick={onItemClick}
      selectedPath={selectedPath}
    />
  );
};
