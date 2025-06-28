
import { ArrowLeftIcon, SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const SearchHeader = ({ searchQuery, onSearchChange }: SearchHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/blogs')}
          className="gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Blogs
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Search Blogs</h1>
          <p className="text-muted-foreground">Find articles by title, content, tags, or author</p>
        </div>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 text-lg"
          autoFocus
        />
      </div>
    </div>
  );
};

export default SearchHeader;
