
import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { BlogTree } from "./BlogTree";
import { BlogItem } from "@/models/blog";

interface BottomMobileBlogMenuProps {
  blogItems: BlogItem[];
  onItemClick: (item: BlogItem) => void;
  selectedPath: string;
}

export const BottomMobileBlogMenu = ({ blogItems, onItemClick, selectedPath }: BottomMobileBlogMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (item: BlogItem) => {
    onItemClick(item);
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden fixed bottom-6 right-6 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
          >
            <MenuIcon className="h-5 w-5" />
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
    </div>
  );
};
