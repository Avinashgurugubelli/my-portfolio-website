
interface BlogItem {
  id: string;
  type: string;
  title?: string;
  description?: string;
  author?: string;
  date?: string;
  tags?: string[];
  content?: string;
}

interface CategoryData {
  categoryId: string;
  categoryTitle: string;
  items: BlogItem[];
}

interface SearchResult {
  item: BlogItem;
  categoryId: string;
  categoryTitle: string;
  path: string[];
  relevanceScore: number;
  allItems?: any[];
}

let blogIndex: CategoryData[] = [];
let isInitialized = false;

// Initialize the search index
async function initializeIndex() {
  try {
    const response = await fetch('/blogs/info.json');
    const blogCategories = await response.json();
    
    for (const category of blogCategories) {
      try {
        const categoryResponse = await fetch(`/blogs/${category.id}/info.json`);
        const categoryInfo = await categoryResponse.json();
        
        const indexResponse = await fetch(`/blogs/${category.id}/index.json`);
        const items = await indexResponse.json();
        
        blogIndex.push({
          categoryId: category.id,
          categoryTitle: categoryInfo.title,
          items: items || []
        });
      } catch (error) {
        console.error(`Failed to load category ${category.id}:`, error);
      }
    }
    
    isInitialized = true;
    self.postMessage({ type: 'INIT_COMPLETE' });
  } catch (error) {
    console.error('Failed to initialize search index:', error);
    self.postMessage({ type: 'INIT_ERROR', error: error.message });
  }
}

// Search function
function searchItems(query: string): SearchResult[] {
  if (!isInitialized || !query.trim()) return [];
  
  const searchTerms = query.toLowerCase().split(/\s+/);
  const results: SearchResult[] = [];
  
  for (const category of blogIndex) {
    for (const item of category.items) {
      const relevanceScore = calculateRelevance(item, searchTerms);
      
      if (relevanceScore > 0) {
        results.push({
          item,
          categoryId: category.categoryId,
          categoryTitle: category.categoryTitle,
          path: [item.title || 'Untitled'],
          relevanceScore,
          allItems: category.items
        });
      }
    }
  }
  
  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

// Calculate relevance score
function calculateRelevance(item: BlogItem, searchTerms: string[]): number {
  let score = 0;
  const title = (item.title || '').toLowerCase();
  const description = (item.description || '').toLowerCase();
  const author = (item.author || '').toLowerCase();
  const tags = (item.tags || []).join(' ').toLowerCase();
  
  for (const term of searchTerms) {
    // Title matches get highest score
    if (title.includes(term)) score += 10;
    
    // Description matches
    if (description.includes(term)) score += 5;
    
    // Author matches
    if (author.includes(term)) score += 3;
    
    // Tag matches
    if (tags.includes(term)) score += 7;
  }
  
  return score;
}

// Handle messages from main thread
self.onmessage = async (event) => {
  const { type, query } = event.data;
  
  switch (type) {
    case 'INIT':
      await initializeIndex();
      break;
      
    case 'SEARCH':
      if (isInitialized) {
        const results = searchItems(query);
        self.postMessage({ 
          type: 'SEARCH_RESULTS', 
          data: results, 
          query 
        });
      }
      break;
  }
};
