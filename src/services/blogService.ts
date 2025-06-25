
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
    // const response = await fetch('/config/blogs.json');
    // console.log('Fetching blogs data from:', response.url);
    // console.log('Response status:', response.status);
    // console.log('Response headers:', response.headers);
    // console.log('Response type:', response.headers.get('content-type'));
    // console.log('Response blob data:', blobData.categories);
    // console.log('Response:', await response.json());
    // if (!response.ok) {
    //   throw new Error('Failed to fetch blogs data');
    // }
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
