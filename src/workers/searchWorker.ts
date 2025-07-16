
interface SearchResult {
  item: any;
  categoryId: string;
  categoryTitle: string;
  path: string[];
  relevanceScore: number;
  allItems?: any[];
}

let searchIndex: SearchResult[] = [];
let isInitialized = false;

const initializeIndex = async () => {
  try {
    console.log('Initializing search worker...');
    
    // Fetch the blogs data
    const response = await fetch('/config/blogs.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch blogs data: ${response.status}`);
    }
    
    const blogsData = await response.json();
    console.log('Blogs data fetched:', blogsData);
    
    if (!blogsData.categories || !Array.isArray(blogsData.categories)) {
      throw new Error('Invalid blogs data structure - categories not found or not an array');
    }

    const allItems: SearchResult[] = [];
    
    for (const category of blogsData.categories) {
      if (category.indexUrl) {
        // Fetch nested structure
        try {
          const nestedResponse = await fetch(category.indexUrl);
          if (nestedResponse.ok) {
            const nestedIndex = await nestedResponse.json();
            
            const flattenItems = (items: any[], path: string[] = []): void => {
              if (!Array.isArray(items)) return;
              
              items.forEach(item => {
                const currentPath = [...path, item.title || ''];
                allItems.push({
                  item,
                  categoryId: category.id,
                  categoryTitle: category.title,
                  path: currentPath,
                  relevanceScore: 0
                });
                
                if (item.type === "directory" && item.children) {
                  flattenItems(item.children, currentPath);
                }
              });
            };
            
            if (nestedIndex.children) {
              flattenItems(nestedIndex.children);
            }
          }
        } catch (error) {
          console.error(`Failed to load nested index for ${category.id}:`, error);
        }
      } else if (category.children && Array.isArray(category.children)) {
        // Simple articles
        category.children.forEach((post: any) => {
          const blogItem = {
            id: post.id,
            type: "file",
            path: post.path || post.contentPath || '',
            title: post.title || '',
            description: post.description,
            date: post.date,
          };
          
          allItems.push({
            item: blogItem,
            categoryId: category.id,
            categoryTitle: category.title,
            path: [post.title || ''],
            relevanceScore: 0
          });
        });
      }
    }
    
    searchIndex = allItems;
    isInitialized = true;
    console.log(`Search index initialized with ${allItems.length} items`);
    
    // Send back all items for caching
    self.postMessage({ 
      type: 'INIT_COMPLETE', 
      data: allItems 
    });
    
  } catch (error) {
    console.error('Failed to initialize search index:', error);
    self.postMessage({ 
      type: 'INIT_ERROR', 
      error: error.message 
    });
  }
};

const searchItems = (query: string): SearchResult[] => {
  if (!isInitialized || !query.trim()) {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  for (const item of searchIndex) {
    let score = 0;
    const searchableText = [
      item.item.title || '',
      item.item.description || '',
      item.item.author || '',
      item.categoryTitle,
      ...(item.item.tags || [])
    ].join(' ').toLowerCase();

    // Exact title match
    if (item.item.title && item.item.title.toLowerCase().includes(searchTerm)) {
      score += 10;
    }

    // Description match
    if (item.item.description && item.item.description.toLowerCase().includes(searchTerm)) {
      score += 5;
    }

    // Category match
    if (item.categoryTitle.toLowerCase().includes(searchTerm)) {
      score += 3;
    }

    // Tags match
    if (item.item.tags && item.item.tags.some((tag: string) => 
      tag.toLowerCase().includes(searchTerm))) {
      score += 4;
    }

    // General text match
    if (searchableText.includes(searchTerm)) {
      score += 1;
    }

    if (score > 0) {
      results.push({
        ...item,
        relevanceScore: score,
        allItems: searchIndex
      });
    }
  }

  // Sort by relevance score (descending)
  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
};

self.onmessage = async (event) => {
  const { type, query } = event.data;

  switch (type) {
    case 'INIT':
      await initializeIndex();
      break;
    
    case 'SEARCH':
      if (!isInitialized) {
        console.warn('Search attempted before initialization');
        self.postMessage({ 
          type: 'SEARCH_RESULTS', 
          data: [], 
          query 
        });
        return;
      }
      
      const results = searchItems(query);
      self.postMessage({ 
        type: 'SEARCH_RESULTS', 
        data: results, 
        query 
      });
      break;
    
    default:
      console.warn('Unknown message type:', type);
  }
};
