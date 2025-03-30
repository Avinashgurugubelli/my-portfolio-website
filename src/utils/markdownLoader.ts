/**
 * Utility for loading markdown content dynamically
 */

/**
 * Loads markdown content from a file path or URL
 * @param post The blog post object containing contentPath, contentUrl, or content
 * @returns A Promise that resolves to the markdown content
 */
export const loadMarkdownContent = async (
    post: { contentPath?: string; contentUrl?: string; content?: string }
  ): Promise<string> => {
    try {
      // If contentPath is provided, load from public directory
      if (post.contentPath) {
        const response = await fetch(post.contentPath);
        if (!response.ok) {
          throw new Error(`Failed to load markdown from path: ${post.contentPath}`);
        }
        return response.text();
      }
      
      // If contentUrl is provided, load from external URL
      if (post.contentUrl) {
        const response = await fetch(post.contentUrl);
        if (!response.ok) {
          throw new Error(`Failed to load markdown from URL: ${post.contentUrl}`);
        }
        return response.text();
      }
      
      // Fall back to inline content
      if (post.content) {
        return post.content;
      }
      
      throw new Error("No content source provided");
    } catch (error) {
      console.error("Error loading markdown content:", error);
      return "# Error Loading Content\n\nSorry, we couldn't load the content for this article.";
    }
  };