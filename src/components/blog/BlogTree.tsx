
import { useState, useEffect } from "react";
import { ChevronRightIcon, ChevronDownIcon, FolderIcon, FileTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BlogItem, BlogDirectory, BlogFile } from "@/models/blog";

interface BlogTreeProps {
  items: BlogItem[];
  onItemClick: (item: BlogItem) => void;
  selectedPath: string;
  level?: number;
}

export const BlogTree = ({ 
  items, 
  onItemClick, 
  selectedPath, 
  level = 0 
}: BlogTreeProps) => {
  const [openDirectories, setOpenDirectories] = useState<Set<string>>(new Set());

  // Auto-expand directories that contain the selected file
  useEffect(() => {
    if (selectedPath) {
      const expandPath = (items: BlogItem[], currentPath: string[] = []): void => {
        items.forEach(item => {
          if (item.type === "directory" && item.children) {
            const hasSelectedChild = findSelectedChild(item.children, selectedPath);
            if (hasSelectedChild) {
              setOpenDirectories(prev => new Set(prev).add(item.id));
              expandPath(item.children, [...currentPath, item.id]);
            }
          }
        });
      };
      expandPath(items);
    }
  }, [selectedPath, items]);

  const findSelectedChild = (items: BlogItem[], targetPath: string): boolean => {
    return items.some(item => {
      if (item.type === "file" && item.path === targetPath) {
        return true;
      }
      if (item.type === "directory" && item.children) {
        return findSelectedChild(item.children, targetPath);
      }
      return false;
    });
  };

  const toggleDirectory = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(openDirectories);
    if (newSet.has(itemId)) {
      newSet.delete(itemId);
    } else {
      newSet.add(itemId);
    }
    setOpenDirectories(newSet);
  };

  const handleItemClick = (item: BlogItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only call onItemClick for files, not directories
    if (item.type === "file") {
      onItemClick(item);
    }
  };

  return (
    <TooltipProvider>
      <div className={`space-y-1 ${level > 0 ? 'ml-4 border-l border-border pl-2' : ''}`}>
        {items.map((item, index) => {
          // Create unique key using item id, type, and index to prevent duplicates
          const uniqueKey = `${item.type}-${item.id}-${index}-${level}`;
          
          return (
            <div key={uniqueKey}>
              {item.type === "directory" ? (
                <Collapsible 
                  open={openDirectories.has(item.id)}
                  onOpenChange={(open) => {
                    const newSet = new Set(openDirectories);
                    if (open) {
                      newSet.add(item.id);
                    } else {
                      newSet.delete(item.id);
                    }
                    setOpenDirectories(newSet);
                  }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1 hover:bg-accent/50"
                          onClick={(e) => toggleDirectory(item.id, e)}
                        >
                          {openDirectories.has(item.id) ? (
                            <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 flex-1 min-w-0 p-2">
                            <FolderIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{item.title}</div>
                              {item.description && (
                                <div className="text-xs text-muted-foreground truncate mt-1">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <div className="font-medium">{item.title}</div>
                          {item.description && (
                            <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <CollapsibleContent>
                      {item.children && (
                        <BlogTree 
                          items={item.children} 
                          onItemClick={onItemClick}
                          selectedPath={selectedPath}
                          level={level + 1}
                        />
                      )}
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-left h-auto p-2 hover:bg-accent/50 ${
                        selectedPath === item.path ? 'bg-accent' : ''
                      }`}
                      onClick={(e) => handleItemClick(item, e)}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-4 flex-shrink-0" />
                        <FileTextIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{item.title}</div>
                        </div>
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <div className="font-medium">{item.title}</div>
                    {item.description && (
                      <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                    )}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
};
