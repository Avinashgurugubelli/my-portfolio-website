
import { useState, useEffect, useCallback } from "react";
import { BlogItem } from "@/models/blog";
import { BlogService } from "@/services/blogService";

export const useBlogNavigation = (
  blogItems: BlogItem[], 
  wildcardPath: string | undefined, 
  categoryId: string | undefined
) => {
  const [selectedItem, setSelectedItem] = useState<BlogItem | null>(null);
  const [selectedPath, setSelectedPath] = useState<string>("");

  // Helper function to find first file in the tree
  const findFirstFile = useCallback((items: BlogItem[]): BlogItem | null => {
    for (const item of items) {
      if (item.type === "file") {
        return item;
      }
      if (item.type === "directory" && item.children) {
        const found = findFirstFile(item.children);
        if (found) return found;
      }
    }
    return null;
  }, []);

  // Auto-select first article when blog items are loaded and no URL path
  useEffect(() => {
    console.log("Auto-selecting first article. BlogItems length:", blogItems.length, "WildcardPath:", wildcardPath);
    if (blogItems.length > 0 && !wildcardPath) {
      const firstFile = findFirstFile(blogItems);
      console.log("First file found:", firstFile);
      if (firstFile) {
        setSelectedItem(firstFile);
        setSelectedPath(firstFile.type === "file" ? firstFile.path : firstFile.id);
      }
    }
  }, [blogItems, wildcardPath, findFirstFile]);

  // Handle direct URL access with improved logging
  useEffect(() => {
    console.log("Handling direct URL access. WildcardPath:", wildcardPath, "BlogItems length:", blogItems.length);
    if (wildcardPath && blogItems.length > 0) {
      const pathSegments = wildcardPath.split('/').filter(Boolean);
      console.log("Path segments for direct access:", pathSegments);
      
      const foundItem = BlogService.findBlogItemByPath(blogItems, pathSegments);
      console.log("Found item for direct URL:", foundItem);
      
      if (foundItem) {
        setSelectedItem(foundItem);
        setSelectedPath(foundItem.type === "file" ? foundItem.path : foundItem.id);
      } else {
        console.log("Item not found, falling back to first file");
        const firstFile = findFirstFile(blogItems);
        if (firstFile) {
          setSelectedItem(firstFile);
          setSelectedPath(firstFile.type === "file" ? firstFile.path : firstFile.id);
        }
      }
    }
  }, [wildcardPath, blogItems, findFirstFile]);

  const handleItemClick = useCallback((item: BlogItem) => {
    console.log("Item clicked:", item);
    setSelectedItem(item);
    setSelectedPath(item.type === "file" ? item.path : item.id);
    
    // Generate correct URL path with parent directories
    const parentPath = BlogService.findParentPath(blogItems, item);
    const itemPath = BlogService.generateBlogPath(item);
    
    let fullUrlPath = itemPath;
    if (parentPath && parentPath.length > 0) {
      fullUrlPath = [...parentPath, itemPath].join('/');
    }
    
    console.log("Generated full URL path:", fullUrlPath);
    console.log("Parent path:", parentPath, "Item path:", itemPath);
    
    const newUrl = `/blogs/${categoryId}/${fullUrlPath}`;
    console.log("Updating URL to:", newUrl);
    window.history.replaceState(null, '', newUrl);
  }, [blogItems, categoryId]);

  return {
    selectedItem,
    selectedPath,
    handleItemClick
  };
};
