
import { useNavigate, useParams } from "react-router-dom";
import { BlogDirectory, BlogFile, BlogItem } from "@/models/blog";
import { BlogService } from "@/services/blogService";

export const useMarkdownLinks = (item: BlogDirectory | BlogFile, blogItems: BlogItem[]) => {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const handleMarkdownLinkClick = (href: string) => {
    console.log("Handling markdown link click:", href);
    
    // Handle internal markdown links (relative paths ending with .md)
    if (href.endsWith('.md') && !href.startsWith('http')) {
      console.log("Processing relative markdown link:", href);
      
      let targetPath = '';
      
      // Handle relative paths with ../
      if (href.startsWith('../')) {
        console.log("Processing relative path with ../");
        
        if (item.type === "file" && item.path) {
          // Get the current file's directory
          const currentDirParts = item.path.split('/').slice(0, -1); // Remove filename
          console.log("Current directory parts:", currentDirParts);
          
          // Process the relative path
          const relativeParts = href.split('/');
          let resultPath = [...currentDirParts];
          
          for (const part of relativeParts) {
            if (part === '..') {
              resultPath.pop(); // Go up one directory
            } else if (part && part !== '.') {
              resultPath.push(part);
            }
          }
          
          targetPath = '/' + resultPath.join('/');
          console.log("Constructed target path:", targetPath);
        }
      } else {
        // Handle same-directory relative paths
        if (item.type === "file" && item.path) {
          const currentDir = item.path.split('/').slice(0, -1).join('/');
          targetPath = `${currentDir}/${href.replace('./', '')}`;
          if (!targetPath.startsWith('/')) {
            targetPath = '/' + targetPath;
          }
          console.log("Same directory target path:", targetPath);
        }
      }
      
      // Find the blog item using the actual file path
      const foundItem = BlogService.findBlogItemByFilePath(blogItems, targetPath);
      console.log("Found blog item by path:", foundItem);
      
      if (foundItem) {
        // Generate the correct URL path using parent hierarchy
        const parentPath = BlogService.findParentPath(blogItems, foundItem);
        const itemPath = BlogService.generateBlogPath(foundItem);
        
        let fullUrlPath = itemPath;
        if (parentPath && parentPath.length > 0) {
          fullUrlPath = [...parentPath, itemPath].join('/');
        }
        
        const newUrl = `/blogs/${categoryId}/${fullUrlPath}`;
        console.log("Navigating to:", newUrl);
        navigate(newUrl);
        return false;
      } else {
        console.log("Blog item not found for path:", targetPath);
        // Fallback: try to extract filename and search by that
        const filename = href.split('/').pop()?.replace('.md', '') || '';
        const fileSlug = BlogService.generateFileSlug(filename + '.md');
        const fallbackUrl = `/blogs/${categoryId}/${fileSlug}`;
        console.log("Fallback navigation to:", fallbackUrl);
        navigate(fallbackUrl);
        return false;
      }
    }
    return true;
  };

  return { handleMarkdownLinkClick };
};
