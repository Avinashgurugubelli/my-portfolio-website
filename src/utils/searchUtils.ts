
interface SearchResult {
  item: {
    id: string;
    type: string;
    title?: string;
    description?: string;
    author?: string;
    date?: string;
    createdOn?: string;
    tags?: string[];
    references?: Array<{
      title?: string;
      author?: string;
      authors?: string[];
      publisher?: string;
    }>;
  };
  categoryId: string;
  categoryTitle: string;
  path: string[];
  relevanceScore: number;
}

export const searchBlogItems = (allBlogItems: SearchResult[], searchQuery: string): SearchResult[] => {
  const query = searchQuery.toLowerCase();
  const searchTerms = query.split(/\s+/).filter(term => term.length > 0);
  
  const scoredResults = allBlogItems.map(result => {
    let score = 0;
    const item = result.item;
    
    // Title matching (highest weight)
    const title = item?.title || '';
    if (title.toLowerCase().includes(query)) {
      score += 15;
    }
    searchTerms.forEach(term => {
      if (title.toLowerCase().includes(term)) {
        score += 8;
      }
    });
    
    // Description matching
    const description = item?.description || '';
    if (description.toLowerCase().includes(query)) {
      score += 12;
    }
    searchTerms.forEach(term => {
      if (description.toLowerCase().includes(term)) {
        score += 6;
      }
    });
    
    // Tags matching (highest priority for exact matches)
    if (item.type === "file" && item.tags && Array.isArray(item.tags)) {
      item.tags.forEach(tag => {
        const tagStr = (tag || '').toLowerCase();
        if (tagStr === query) {
          score += 20;
        } else if (tagStr.includes(query)) {
          score += 10;
        }
        searchTerms.forEach(term => {
          if (tagStr === term) {
            score += 15;
          } else if (tagStr.includes(term)) {
            score += 5;
          }
        });
      });
    }
    
    // Author matching
    const author = item?.author || '';
    if (author.toLowerCase().includes(query)) {
      score += 8;
    }
    searchTerms.forEach(term => {
      if (author.toLowerCase().includes(term)) {
        score += 4;
      }
    });
    
    // References matching
    if (item.type === "file" && item.references && Array.isArray(item.references)) {
      item.references.forEach(ref => {
        // Reference title
        const refTitle = (ref.title || '').toLowerCase();
        if (refTitle.includes(query)) {
          score += 6;
        }
        searchTerms.forEach(term => {
          if (refTitle.includes(term)) {
            score += 3;
          }
        });
        
        // Reference authors
        const authors = ref.authors || (ref.author ? [ref.author] : []);
        authors.forEach(author => {
          const authorStr = (author || '').toLowerCase();
          if (authorStr.includes(query)) {
            score += 5;
          }
          searchTerms.forEach(term => {
            if (authorStr.includes(term)) {
              score += 2;
            }
          });
        });
        
        // Reference publisher
        const publisher = (ref.publisher || '').toLowerCase();
        if (publisher.includes(query)) {
          score += 4;
        }
        searchTerms.forEach(term => {
          if (publisher.includes(term)) {
            score += 2;
          }
        });
      });
    }
    
    // Category matching
    const categoryTitle = result.categoryTitle || '';
    if (categoryTitle.toLowerCase().includes(query)) {
      score += 5;
    }
    searchTerms.forEach(term => {
      if (categoryTitle.toLowerCase().includes(term)) {
        score += 2;
      }
    });
    
    return { ...result, relevanceScore: score };
  });
  
  return scoredResults
    .filter(result => result.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
};
