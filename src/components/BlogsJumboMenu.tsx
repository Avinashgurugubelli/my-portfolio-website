
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FolderIcon, FileTextIcon } from "lucide-react";
import { BlogsData, BlogCategory } from "@/models/blog";
import blogsJson from "@/config/blogs.json";

interface BlogsJumboMenuProps {
  isVisible: boolean;
}

const BlogsJumboMenu = ({ isVisible }: BlogsJumboMenuProps) => {
  const [blogsData, setBlogsData] = useState<BlogsData | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    setBlogsData(blogsJson as BlogsData);
  }, []);

  if (!isEnabled || !blogsData || !isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 mt-2 w-96 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-4 z-50"
          onMouseEnter={(e) => e.stopPropagation()}
          onMouseLeave={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-1 gap-2">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Blog Categories</h3>
            {blogsData.categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                to={`/blogs/${category.id}`}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors"
              >
                {category.indexUrl ? (
                  <FolderIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                ) : (
                  <FileTextIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{category.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{category.description}</p>
                </div>
              </Link>
            ))}
            <Link
              to="/blogs"
              className="text-sm text-primary hover:text-primary/80 mt-2 text-center"
            >
              View All Categories →
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlogsJumboMenu;
