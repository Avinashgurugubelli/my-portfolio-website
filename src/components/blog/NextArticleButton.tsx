
import { ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogItem } from "@/models/blog";

interface NextArticleButtonProps {
  blogItems: BlogItem[];
  currentItem: BlogItem;
  onItemClick: (item: BlogItem) => void;
}

export const NextArticleButton = ({ blogItems, currentItem, onItemClick }: NextArticleButtonProps) => {
  // Find the next article in the flattened list
  const findNextArticle = (items: BlogItem[], current: BlogItem): BlogItem | null => {
    const flattenItems = (itemList: BlogItem[]): BlogItem[] => {
      const result: BlogItem[] = [];
      for (const item of itemList) {
        if (item.type === "file") {
          result.push(item);
        }
        if (item.type === "directory" && item.children) {
          result.push(...flattenItems(item.children));
        }
      }
      return result;
    };

    const flatItems = flattenItems(items);
    const currentIndex = flatItems.findIndex(item => 
      item.id === current.id || 
      (item.type === "file" && current.type === "file" && item.path === current.path)
    );
    
    if (currentIndex >= 0 && currentIndex < flatItems.length - 1) {
      return flatItems[currentIndex + 1];
    }
    
    return null;
  };

  const handleNextClick = (nextArticle: BlogItem) => {
    // Call the item click handler first
    onItemClick(nextArticle);
    
    // Scroll to top immediately after content change
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 50); // Reduced delay for faster response
  };

  const nextArticle = findNextArticle(blogItems, currentItem);

  if (!nextArticle) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <div className="flex justify-end">
        <Button
          onClick={() => handleNextClick(nextArticle)}
          className="gap-2 group"
          size="lg"
        >
          <span>Next: {nextArticle.title}</span>
          <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
};
