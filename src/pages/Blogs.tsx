
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightIcon, TreePineIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlogsData } from "@/models/blog";
import blogsJson from "@/config/blogs.json";

const Blogs = () => {
  const [blogsData, setBlogsData] = useState<BlogsData | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // if the blog data has indexUrl, we can use it to fetch the content
    setBlogsData(blogsJson as BlogsData);
  }, []);

  if (!blogsData) return null;

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
                  Explore articles on various topics. Stay tuned for more content!
                </p>
                
                {/* New Nested Blog Structure Link */}
                {/* <div className="mb-12">
                  <Link to="/nested-blogs">
                    <Button size="lg" className="gap-2">
                      <TreePineIcon className="h-5 w-5" />
                      Explore Nested Blog Structure
                      <ArrowRightIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-2">
                    Browse blogs in a hierarchical tree structure with improved navigation
                  </p>
                </div> */}


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
                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-2xl">{category.title}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="space-y-4">
                          {category?.children?.slice(0, 3).map((post) => (
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
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link to={`/blogs/${category.id}`} className="w-full">
                          <Button variant="outline" className="gap-2 w-full">
                            View All {category.title} Articles <ArrowRightIcon className="h-4 w-4" />
                          </Button>
                        </Link>
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
