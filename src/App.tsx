
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load blog-related components
const Blogs = lazy(() => import("./pages/Blogs"));
const BlogViewer = lazy(() => import("./pages/BlogViewer"));
const BlogCategory = lazy(() => import("./pages/BlogCategory"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const NestedBlogs = lazy(() => import("./pages/NestedBlogs"));
const BlogSearch = lazy(() => import("./pages/BlogSearch"));

const App = () => {
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Main routes */}
            <Route path="/" element={<Index />} />
            
            {/* Blog routes */}
            <Route path="/blogs" element={
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading blogs...</div>}>
                <Blogs />
              </Suspense>
            } />
            
            <Route path="/blogs/search" element={
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading search...</div>}>
                <BlogSearch />
              </Suspense>
            } />
            
            {/* New unified blog viewer route */}
            <Route path="/blogs/:categoryId" element={
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading category...</div>}>
                <BlogViewer />
              </Suspense>
            } />
            
            <Route path="/blogs/:categoryId/*" element={
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading article...</div>}>
                <BlogViewer />
              </Suspense>
            } />
            
            {/* Nested blogs route */}
            <Route path="/nested-blogs" element={
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading nested blogs...</div>}>
                <NestedBlogs />
              </Suspense>
            } />
            
            <Route path="/nested-blogs/*" element={
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading nested blogs...</div>}>
                <NestedBlogs />
              </Suspense>
            } />
            
            {/* Catch-all route - MUST be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
