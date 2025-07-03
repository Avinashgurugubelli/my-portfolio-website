
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightIcon, FolderIcon, FileTextIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlogsData, BlogCategory } from "@/models/blog";
import { BlogService } from "@/services/blogService";
import { useLazyBlogs } from "@/hooks/useLazyBlogs";

const Blogs = () => {
  const [blogsData, setBlogsData] = useState<BlogsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    loadBlogsData();
  }, []);

  const loadBlogsData = async () => {
    try {
      const data = await BlogService.fetchBlogsData();
      setBlogsData(data);
    } catch (error) {
      console.error('Failed to load blogs data:', error);
    } finally {
      setLoading(false);
    }
  };

  const { visibleItems, isLoading, hasMore, loadingRef } = useLazyBlogs({
    categories: blogsData?.categories || [],
    itemsPerPage: 6
  });

  const handleCategoryClick = (category: BlogCategory) => {
    if (category.indexUrl) {
      navigate(`/blogs/${category.id}`);
    } else if (category.children && category.children.length > 0) {
      navigate(`/blogs/${category.id}`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blogs/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading blogs...</p>
      </div>
    );
  }

  if (!blogsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Failed to load blogs</p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background text-foreground relative"
      >
        <Navbar />
        <main>
          <section className="py-20 px-4 mt-30">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 mt-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Bits of Code, Bytes of Thought (Tech Blogs)</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                    I write about the things I build and learn — from tech experiments and programming tips to system design and clean coding practices. Dive into articles exploring modern technologies and real-world software engineering insights.
                </p>
                
                <div className="flex justify-center">
                  <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button type="submit" size="sm">
                      Search
                    </Button>
                  </form>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleItems.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * (index % 3) }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => handleCategoryClick(category)}>
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          {category.indexUrl ? (
                            // <FolderIcon className="h-5 w-5 text-blue-500" />
                            <FileTextIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <FileTextIcon className="h-5 w-5 text-green-500" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {category.indexUrl ? category.title : category.title}
                          </span>
                        </div>
                        <CardTitle className="text-2xl">{category.title}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="space-y-4">
                          {category.children && category.children.slice(0, 3).map((post) => (
                            <div key={post.id} className="border-b pb-3 last:border-0">
                              <h4 className="font-medium text-lg">{post.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{post.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(post.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          ))}
                          {!category.children && category.indexUrl && (
                            <div className="text-sm text-muted-foreground">
                              {/* Click to explore nested structure... */}
                            </div>
                          )}
                          {!category.children && !category.indexUrl && (
                            <div className="text-sm text-muted-foreground">
                              More articles coming soon...
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="gap-2 w-full">
                          {category.indexUrl ? 'View Articles' : 'View Articles'} 
                          <ArrowRightIcon className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {hasMore && (
                <div ref={loadingRef} className="flex justify-center mt-12">
                  {isLoading && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span>Loading more categories...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default Blogs;
