
import { BlogCategory, BlogsData, NestedBlogIndex, BlogItem } from "@/models/blog";

// read json from /config/blogs.json
import blobData  from './../config/blogs.json';

/**
 * Service for handling blog data operations
 */
export class BlogService {
  /**
   * Fetch the main blogs configuration
   */
  static async fetchBlogsData(): Promise<BlogsData> {
    return Promise.resolve(blobData as BlogsData);
  }

  /**
   * Fetch nested blog index data
   */
  static async fetchNestedBlogIndex(indexUrl: string): Promise<NestedBlogIndex> {
    const response = await fetch(indexUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch blog index: ${indexUrl}`);
    }
    return response.json();
  }

  /**
   * Fetch blog content from a file path
   */
  static async fetchBlogContent(path: string): Promise<string> {
    const response = await fetch(path.startsWith('/') ? path : `/${path}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch blog content: ${path}`);
    }
    return response.text();
  }

  /**
   * Find a blog item by path in nested structure with improved matching
   */
  static findBlogItemByPath(items: BlogItem[], pathSegments: string[]): BlogItem | null {
    if (pathSegments.length === 0) return null;
    
    console.log("Finding item by path segments:", pathSegments);
    const currentSegment = decodeURIComponent(pathSegments[0]);
    console.log("Current segment:", currentSegment);
    
    const item = items.find(item => {
      // Multiple matching strategies
      const idMatch = item.id === currentSegment;
      const titleMatch = item.title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-') === currentSegment.toLowerCase();
      const directTitleMatch = item.title.toLowerCase() === currentSegment.toLowerCase();
      
      // For files, also check filename-based matching
      if (item.type === "file") {
        const pathMatch = item.path.toLowerCase().includes(currentSegment.toLowerCase());
        const filenameMatch = item.path.split('/').pop()?.replace('.md', '').toLowerCase() === currentSegment.toLowerCase();
        console.log(`File ${item.id}: idMatch=${idMatch}, titleMatch=${titleMatch}, pathMatch=${pathMatch}, filenameMatch=${filenameMatch}`);
        return idMatch || titleMatch || directTitleMatch || pathMatch || filenameMatch;
      }
      
      console.log(`Directory ${item.id}: idMatch=${idMatch}, titleMatch=${titleMatch}, directTitleMatch=${directTitleMatch}`);
      return idMatch || titleMatch || directTitleMatch;
    });
    
    console.log("Found item:", item);
    
    if (!item) {
      console.log("Item not found, available items:", items.map(i => ({ id: i.id, title: i.title, type: i.type })));
      return null;
    }
    
    if (pathSegments.length === 1) {
      return item;
    }
    
    if (item.type === "directory" && item.children) {
      return this.findBlogItemByPath(item.children, pathSegments.slice(1));
    }
    
    return null;
  }

  /**
   * Generate URL path for blog item
   */
  static generateBlogPath(item: BlogItem): string {
    return item.title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
  }

  /**
   * Find the full path hierarchy for a blog item
   */
  static findItemPath(items: BlogItem[], targetItem: BlogItem, currentPath: string[] = []): string[] | null {
    for (const item of items) {
      if (item.id === targetItem.id) {
        return [...currentPath, this.generateBlogPath(item)];
      }
      
      if (item.type === "directory" && item.children) {
        const result = this.findItemPath(item.children, targetItem, [...currentPath, this.generateBlogPath(item)]);
        if (result) return result;
      }
    }
    return null;
  }
}
