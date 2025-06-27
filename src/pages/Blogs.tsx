
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightIcon, FolderIcon, FileTextIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlogsData, BlogCategory } from "@/models/blog";
import { BlogService } from "@/services/blogService";

const Blogs = () => {
  const [blogsData, setBlogsData] = useState<BlogsData | null>(null);
  const [loading, setLoading] = useState(true);
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

  const handleCategoryClick = (category: BlogCategory) => {
    if (category.indexUrl) {
      // Navigate to nested blog structure
      navigate(`/blogs/${category.id}`);
    } else if (category.children && category.children.length > 0) {
      // Navigate to simple article listing
      navigate(`/blogs/${category.id}`);
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
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Blogs</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                  Explore articles on various topics. Dive deep into comprehensive guides and tutorials.
                </p>
                
                <Button
                  onClick={() => navigate('/blogs/search')}
                  className="gap-2"
                  size="lg"
                >
                  <SearchIcon className="h-4 w-4" />
                  Search Articles
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogsData.categories.map((category) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * blogsData.categories.indexOf(category) }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => handleCategoryClick(category)}>
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          {category.indexUrl ? (
                            <FolderIcon className="h-5 w-5 text-blue-500" />
                          ) : (
                            <FileTextIcon className="h-5 w-5 text-green-500" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {category.indexUrl ? 'Nested Structure' : 'Articles'}
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
                              Click to explore nested structure...
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
                          {category.indexUrl ? 'Explore Structure' : 'View Articles'} 
                          <ArrowRightIcon className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default Blogs;
