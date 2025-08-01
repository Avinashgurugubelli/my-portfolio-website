
import { BlogCategory, BlogsData, NestedBlogIndex, BlogItem } from "@/models/blog";

// read json from /config/blogs.json
import blobData from './../config/blogs.json';

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
   * Convert title to dash-separated URL format, removing number prefixes
   */
  static generateUrlSlug(title: string): string {
    if (!title) return '';
    return title
      .toLowerCase()
      .replace(/^\d+[-.]/, '') // Remove number prefixes like "07-" or "01."
      .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and dashes
      .replace(/\s+/g, '-')     // Replace spaces with dashes
      .replace(/-+/g, '-')      // Replace multiple dashes with single dash
      .replace(/^-|-$/g, '')    // Remove leading/trailing dashes
      .trim();
  }

  /**
   * Convert filename to dash-separated format, removing number prefixes
   */
  static generateFileSlug(filename: string): string {
    if (!filename) return '';

    // Remove file extension and convert to slug
    const nameWithoutExt = filename.replace(/\.(md|txt)$/i, '');
    return this.generateUrlSlug(nameWithoutExt);
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
      const urlSlugMatch = this.generateUrlSlug(item.title) === currentSegment.toLowerCase();
      const titleMatch = item.title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-') === currentSegment.toLowerCase();
      const directTitleMatch = item.title.toLowerCase() === currentSegment.toLowerCase();

      // For files, also check filename-based matching
      if (item.type === "file") {
        const filename = item.path.split('/').pop() || '';
        const fileSlugMatch = this.generateFileSlug(filename) === currentSegment.toLowerCase();
        const pathMatch = item.path.toLowerCase().includes(currentSegment.toLowerCase());

        console.log(`File ${item.id}: idMatch=${idMatch}, urlSlugMatch=${urlSlugMatch}, titleMatch=${titleMatch}, fileSlugMatch=${fileSlugMatch}, pathMatch=${pathMatch}`);
        return idMatch || urlSlugMatch || titleMatch || directTitleMatch || fileSlugMatch || pathMatch;
      }

      console.log(`Directory ${item.id}: idMatch=${idMatch}, urlSlugMatch=${urlSlugMatch}, titleMatch=${titleMatch}, directTitleMatch=${directTitleMatch}`);
      return idMatch || urlSlugMatch || titleMatch || directTitleMatch;
    });

    console.log("Found item:", item);

    if (!item) {
      console.log("Item not found, available items:", items.map(i => ({ id: i.id, title: i.title, type: i.type, path: i.type === 'file' ? i.path : 'N/A' })));
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
   * Generate URL path for blog item using dash-separated format, removing number prefixes
   */
  static generateBlogPath(item: BlogItem): string {
    if (item.type === "file" && item.path) {
      const filename = item.path.split('/').pop() || '';
      return this.generateFileSlug(filename);
    }
    return this.generateUrlSlug(item.title);
  }

  /**
   * Find the full path hierarchy for a blog item with correct parent traversal
   */
  static findItemPath(items: BlogItem[], targetItem: BlogItem, currentPath: string[] = []): string[] | null {
    for (const item of items) {
      if (item.id === targetItem.id) {
        // Found the target item, return the path including this item
        return [...currentPath, this.generateBlogPath(item)];
      }

      if (item.type === "directory" && item.children) {
        // Add current directory to path and search children
        const childPath = [...currentPath, this.generateBlogPath(item)];
        const result = this.findItemPath(item.children, targetItem, childPath);
        if (result) return result;
      }
    }
    return null;
  }

  /**
   * Find parent directory path for constructing correct URLs
   */
  static findParentPath(items: BlogItem[], targetItem: BlogItem, parentPath: string[] = []): string[] | null {
    for (const item of items) {
      if (item.type === "directory" && item.children) {
        // Check if target is a direct child
        const directChild = item.children.find(child => child.id === targetItem.id);
        if (directChild) {
          return [...parentPath, this.generateBlogPath(item)];
        }

        // Recursively search in subdirectories
        const currentDirPath = [...parentPath, this.generateBlogPath(item)];
        const result = this.findParentPath(item.children, targetItem, currentDirPath);
        if (result) return result;
      }
    }
    return null;
  }

  /**
   * Find blog item by actual file path from index.json
   */
  static findBlogItemByFilePath(items: BlogItem[], targetPath: string): BlogItem | null {
    // Normalize both paths by removing leading slashes
    const normalizedTarget = targetPath.replace(/^\/+/, '');
    for (const item of items) {
      if (
        item.type === "file" &&
        item.path.replace(/^\/+/, '') === normalizedTarget
      ) {
        return item;
      }
      if (item.type === "directory" && item.children) {
        const found = this.findBlogItemByFilePath(item.children, targetPath);
        if (found) return found;
      }
    }
    return null;
  }
}
