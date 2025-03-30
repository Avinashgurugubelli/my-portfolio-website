
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogsData, BlogCategory } from "@/config/types";
import blogsJson from "@/config/blogs.json";

const BlogsSection = () => {
  const [blogsData, setBlogsData] = useState<BlogsData | null>(null);

  useEffect(() => {
    setBlogsData(blogsJson as BlogsData);
  }, []);

  if (!blogsData) return null;

  return (
    <section id="blogs" className="py-20 px-4 bg-slate-50 dark:bg-slate-900/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Blog</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore my blog where I share insights about technology, coding practices, and industry trends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogsData.categories.slice(0, 3).map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-2">
                    {category.posts.slice(0, 2).map((post) => (
                      <div key={post.id} className="border-b pb-2 last:border-0">
                        <h4 className="font-medium">{post.title}</h4>
                        <p className="text-sm text-muted-foreground">{post.description}</p>
                      </div>
                    ))}
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
