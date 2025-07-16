
import { useNavigate, useParams } from "react-router-dom";
import { BlogDirectory, BlogFile } from "@/models/blog";
import { BlogService } from "@/services/blogService";

export const useMarkdownLinks = (item: BlogDirectory | BlogFile) => {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const handleMarkdownLinkClick = (href: string) => {
    console.log("Handling markdown link click:", href);
    
    // Handle internal markdown links (relative paths ending with .md)
    if (href.endsWith('.md') && !href.startsWith('http')) {
      console.log("Processing relative markdown link:", href);
      
      // Handle relative paths with ../
      if (href.startsWith('../')) {
        // Extract the folder and filename from the relative path
        const pathParts = href.split('/');
        const filename = pathParts[pathParts.length - 1]; // Get the last part (filename)
        const folderPath = pathParts.slice(1, -1); // Get middle parts (folder structure), excluding '../' and filename
        
        console.log("Relative path parts:", { pathParts, filename, folderPath });
        
        if (folderPath.length > 0) {
          // For paths like ../transactions/01-introduction.md
          const targetFolder = BlogService.generateUrlSlug(folderPath[0]); // Convert folder name to URL format
          const fileSlug = BlogService.generateFileSlug(filename);
          
          // Navigate to the target folder with the file
          const newUrl = `/blogs/${categoryId}/${targetFolder}/${fileSlug}`;
          console.log("Navigating to relative path:", newUrl);
          navigate(newUrl);
          return false;
        } else {
          // For paths like ../filename.md (sibling directory)
          const fileSlug = BlogService.generateFileSlug(filename);
          const newUrl = `/blogs/${categoryId}/${fileSlug}`;
          console.log("Navigating to sibling file:", newUrl);
          navigate(newUrl);
          return false;
        }
      }
      
      // Handle same-directory relative paths (./filename.md or just filename.md)
      let filename = href.replace('./', '');
      console.log("Processing same-directory filename:", filename);
      
      // Generate the basic slug
      const fileSlug = BlogService.generateFileSlug(filename);
      console.log("Generated file slug:", fileSlug);
      
      // Build the full nested path based on the current item's path structure
      let fullPath = '';
      
      if (item.type === "file" && item.path) {
        // Get the directory structure from the current file's path
        const pathParts = item.path.split('/').filter(Boolean);
        // Find where the category starts in the path
        const categoryIndex = pathParts.findIndex(part => part === 'blogs');
        if (categoryIndex !== -1 && categoryIndex + 2 < pathParts.length) {
          // Take everything after 'blogs/category-name' but before the filename
          const directoryParts = pathParts.slice(categoryIndex + 2, -1);
          console.log("Directory parts:", directoryParts);
          
          if (directoryParts.length > 0) {
            // Convert directory names to URL format
            const urlDirectoryParts = directoryParts.map(part => 
              BlogService.generateUrlSlug(part.replace(/^\d+[-.]/, ''))
            );
            fullPath = `${urlDirectoryParts.join('/')}/${fileSlug}`;
          } else {
            fullPath = fileSlug;
          }
        } else {
          fullPath = fileSlug;
        }
      } else {
        fullPath = fileSlug;
      }
      
      const newUrl = `/blogs/${categoryId}/${fullPath}`;
      console.log("Navigating to same-directory:", newUrl);
      
      navigate(newUrl);
      return false;
    }
    return true;
  };

  return { handleMarkdownLinkClick };
};
