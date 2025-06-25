
import { BlogCategory, BlogsData, NestedBlogIndex, BlogItem } from "@/models/blog";

/**
 * Service for handling blog data operations
 */
export class BlogService {
  /**
   * Fetch the main blogs configuration
   */
  static async fetchBlogsData(): Promise<BlogsData> {
    const response = await fetch('/config/blogs.json');
    if (!response.ok) {
      throw new Error('Failed to fetch blogs data');
    }
    return response.json();
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
   * Find a blog item by path in nested structure
   */
  static findBlogItemByPath(items: BlogItem[], pathSegments: string[]): BlogItem | null {
    if (pathSegments.length === 0) return null;
    
    const currentSegment = decodeURIComponent(pathSegments[0]);
    
    const item = items.find(item => {
      const idMatch = item.id === currentSegment;
      const titleMatch = item.title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-') === currentSegment.toLowerCase();
      return idMatch || titleMatch;
    });
    
    if (!item) return null;
    
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
}
