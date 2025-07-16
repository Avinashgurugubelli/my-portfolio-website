
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
        console.log("Processing relative path with ../");
        
        // Remove the ../ prefix and get the remaining path
        const relativePath = href.replace(/^\.\.\//, '');
        console.log("Relative path after removing ../:", relativePath);
        
        // Split the path to get folder and filename
        const pathParts = relativePath.split('/');
        const filename = pathParts[pathParts.length - 1]; // Get the last part (filename)
        const folderParts = pathParts.slice(0, -1); // Get all parts except filename
        
        console.log("Path analysis:", { pathParts, filename, folderParts });
        
        // Convert folder parts to URL format (remove numbering prefixes)
        const urlFolderParts = folderParts.map(folder => {
          const cleanFolder = folder.replace(/^\d+[-.]/, ''); // Remove numbering like "01-" or "01."
          return BlogService.generateUrlSlug(cleanFolder);
        });
        
        // Convert filename to URL format
        const fileSlug = BlogService.generateFileSlug(filename);
        
        // Construct the full URL path
        let fullUrlPath = fileSlug;
        if (urlFolderParts.length > 0) {
          fullUrlPath = [...urlFolderParts, fileSlug].join('/');
        }
        
        const newUrl = `/blogs/${categoryId}/${fullUrlPath}`;
        console.log("Navigating to relative path:", newUrl);
        navigate(newUrl);
        return false;
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
        console.log("Current item path parts:", pathParts);
        
        // Find where the category starts in the path
        const categoryIndex = pathParts.findIndex(part => part === categoryId);
        console.log("Category index:", categoryIndex);
        
        if (categoryIndex !== -1 && categoryIndex + 1 < pathParts.length - 1) {
          // Take everything after the category but before the filename
          const directoryParts = pathParts.slice(categoryIndex + 1, -1);
          console.log("Directory parts:", directoryParts);
          
          if (directoryParts.length > 0) {
            // Convert directory names to URL format (remove numbering prefixes)
            const urlDirectoryParts = directoryParts.map(part => {
              const cleanPart = part.replace(/^\d+[-.]/, '');
              return BlogService.generateUrlSlug(cleanPart);
            });
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
