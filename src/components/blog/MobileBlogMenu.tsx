
import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BlogTree } from "./BlogTree";
import { BlogItem } from "@/models/blog";

interface MobileBlogMenuProps {
  blogItems: BlogItem[];
  onItemClick: (item: BlogItem) => void;
  selectedPath: string;
}

export const MobileBlogMenu = ({ blogItems, onItemClick, selectedPath }: MobileBlogMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (item: BlogItem) => {
    onItemClick(item);
    setIsOpen(false); // Close the menu after selection
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="lg:hidden flex items-center gap-2"
        >
          <MenuIcon className="h-4 w-4" />
          Browse Articles
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Browse Articles</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold">Articles</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <BlogTree 
              items={blogItems}
              onItemClick={handleItemClick}
              selectedPath={selectedPath}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
