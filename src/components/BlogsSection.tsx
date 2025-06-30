
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogsData, BlogCategory } from "@/models/blog";
import { useLazyBlogs } from "@/hooks/useLazyBlogs";
import blogsJson from "@/config/blogs.json";

const BlogsSection = () => {
  const [blogsData, setBlogsData] = useState<BlogsData | null>(null);

  useEffect(() => {
    setBlogsData(blogsJson as BlogsData);
  }, []);

  const { visibleItems, isLoading, hasMore, loadingRef } = useLazyBlogs({
    categories: blogsData?.categories || [],
    itemsPerPage: 3
  });

  if (!blogsData) return null;

  return (
    <section id="blogs" className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Bits of Code, Bytes of Thought (Tech Blogs)</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I write about the things I build and learn — from tech experiments and programming tips to system design and clean coding practices. Dive into articles exploring modern technologies and real-world software engineering insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleItems.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index % 3) }}
              viewport={{ once: true }}
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">{category.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-2">
                    {category.children && category.children.slice(0, 2).map((post) => (
                      <div key={post.id} className="border-b border-border pb-2 last:border-0">
                        <h4 className="font-medium text-card-foreground">{post.title}</h4>
                        <p className="text-sm text-muted-foreground">{post.description}</p>
                      </div>
                    ))}
                    {!category.children && (
                      <div className="text-sm text-muted-foreground">
                        More articles coming soon...
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/blogs/${category.id}`}>
                    <Button variant="outline" className="gap-2 w-full">
                      View More <ArrowRightIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Loading indicator */}
        {hasMore && (
          <div ref={loadingRef} className="flex justify-center mt-8">
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span>Loading more blogs...</span>
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/blogs">
            <Button size="lg" className="gap-2">
              View All Blogs <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;
