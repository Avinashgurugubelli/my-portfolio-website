
import { useState, useEffect } from "react";
import { BlogCategory, BlogItem } from "@/models/blog";

export const useBlogItems = (nestedIndex: any, category: BlogCategory | undefined) => {
  const [blogItems, setBlogItems] = useState<BlogItem[]>([]);

  useEffect(() => {
    console.log("Setting up blog items. NestedIndex:", nestedIndex, "Category:", category);
    if (nestedIndex) {
      // Nested structure
      setBlogItems(nestedIndex.children || []);
    } else if (category?.children) {
      // Simple articles - convert to BlogItem format
      const convertedItems: BlogItem[] = category.children.map(post => ({
        id: post.id,
        type: "file" as const,
        path: post.path || post.contentPath || '',
        title: post.title,
        description: post.description,
        date: post.date,
      }));
      setBlogItems(convertedItems);
    }
  }, [nestedIndex, category]);

  return blogItems;
};
