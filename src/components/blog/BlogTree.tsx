
import { useState } from "react";
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

  const toggleDirectory = (label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(openDirectories);
    if (newSet.has(label)) {
      newSet.delete(label);
    } else {
      newSet.add(label);
    }
    setOpenDirectories(newSet);
  };

  const handleItemClick = (item: BlogItem, e: React.MouseEvent) => {
    e.preventDefault();
    onItemClick(item);
  };

  return (
    <TooltipProvider>
      <div className={`space-y-1 ${level > 0 ? 'ml-4 border-l border-border pl-2' : ''}`}>
        {items.map((item) => (
          <div key={item.label}>
            {item.type === "directory" ? (
              <Collapsible 
                open={openDirectories.has(item.label)}
                onOpenChange={(open) => {
                  const newSet = new Set(openDirectories);
                  if (open) {
                    newSet.add(item.label);
                  } else {
                    newSet.delete(item.label);
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
                        onClick={(e) => toggleDirectory(item.label, e)}
                      >
                        {openDirectories.has(item.label) ? (
                          <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`flex-1 justify-start text-left h-auto p-2 hover:bg-accent/50 ${
                            selectedPath === item.label ? 'bg-accent' : ''
                          }`}
                          onClick={(e) => handleItemClick(item, e)}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
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
                        </Button>
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
        ))}
      </div>
    </TooltipProvider>
  );
};
