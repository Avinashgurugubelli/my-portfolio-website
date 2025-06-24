import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlogsData, BlogCategory } from "@/models/blog";
import blogsJson from "@/config/blogs.json";

const BlogCategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [blogsData, setBlogsData] = useState<BlogsData | null>(null);
  const [category, setCategory] = useState<BlogCategory | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setBlogsData(blogsJson as BlogsData);
  }, []);

  useEffect(() => {
    if (blogsData && categoryId) {
      let foundCategory = blogsData.categories.find(cat => cat.id === categoryId);
      if (foundCategory) {
        const indexUrl = foundCategory.indexUrl;
        // If the category has an indexUrl, we can fetch the content
        if (indexUrl) {
          fetch(indexUrl)
            .then(response => response.text())
            .then(content => {
              // Assuming the content is in a format that can be parsed
              // You might want to parse it or handle it as needed
              try {
                foundCategory.children = JSON.parse(content).children || [];
              } catch (error) {
                foundCategory.children = [];
              }
              setCategory(foundCategory || null);
            })
            .catch(error => console.error("Error fetching category content:", error));
        }
      }
      else {
        setCategory(foundCategory || null);
      }


    }
  }, [blogsData, categoryId]);

  if (!category) return null;

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
          <section className="py-20 px-4 mt-16">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <Link to="/blogs">
                  <Button variant="ghost" className="gap-2">
                    <ArrowLeftIcon className="h-4 w-4" /> Back to All Categories
                  </Button>
                </Link>
              </div>
              <div className="mb-12">
                <h1 className="text-4xl font-bold mb-4">{category.title}</h1>
                <p className="text-xl text-muted-foreground">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.children.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle>{post.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2">
                          <CalendarIcon className="h-4 w-4" />
                          {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-muted-foreground">{post.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Link to={`/blogs/${category.id}/${post.id}`} className="w-full">
                          <Button variant="outline" className="w-full">
                            Read Article
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

export default BlogCategoryPage;