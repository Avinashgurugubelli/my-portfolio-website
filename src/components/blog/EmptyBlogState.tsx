
export const EmptyBlogState = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome to My Blog</h2>
        <p className="text-muted-foreground mb-6">
          Select a topic from the sidebar to start reading
        </p>
        <div className="text-sm text-muted-foreground">
          Browse through nested categories and articles using the tree structure on the left.
        </div>
      </div>
    </div>
  );
};
