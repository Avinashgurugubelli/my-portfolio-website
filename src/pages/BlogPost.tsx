
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlogsData, BlogCategory, BlogPost } from "@/models/blog";
import blogsJson from "@/config/blogs.json";
import ReactMarkdown from "react-markdown";
import { loadMarkdownContent } from "@/utils/markdownLoader";
import { useQuery } from "@tanstack/react-query";
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

// Separate component to handle markdown content loading
const BlogContent = ({ post }: { post: BlogPost }) => {
  const { data: content, isLoading, error } = useQuery({
    queryKey: ['blogContent', post.id],
    queryFn: () => loadMarkdownContent(post),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-4/6" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/6" />
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive">Error loading content: {(error as Error).message}</div>;
  }

  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >{(content || '')}</ReactMarkdown>
    </div>
  );
};

const BlogPostPage = () => {
  const { categoryId, postId } = useParams<{ categoryId: string; postId: string }>();
  const [blogsData, setBlogsData] = useState<BlogsData | null>(null);
  const [category, setCategory] = useState<BlogCategory | null>(null);
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setBlogsData(blogsJson as BlogsData);
  }, []);

  useEffect(() => {
    if (blogsData && categoryId) {
      const foundCategory = blogsData.categories.find(cat => cat.id === categoryId);
      setCategory(foundCategory || null);

      if (foundCategory && postId && foundCategory.children) {
        const foundPost = foundCategory.children.find(p => p.id === postId);
        setPost(foundPost || null);
      }
    }
  }, [blogsData, categoryId, postId]);

  if (!category || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading blog post...</p>
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
        <main className="pt-[120px]">
          <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
            {/* Sidebar with article index */}
            <aside className="w-full lg:w-64 p-6 lg:min-h-screen border-r">
              <div className="mb-6">
                <Link to={`/blogs/${categoryId}`}>
                  <Button variant="ghost" className="gap-2 mb-4">
                    <ArrowLeftIcon className="h-4 w-4" /> Back to {category.title}
                  </Button>
                </Link>
                <h3 className="text-lg font-semibold mb-2">Articles in {category.title}</h3>
                <Separator className="mb-4" />
              </div>
              <nav className="space-y-2">
                {category.children.map(p => (
                  <Link
                    key={p.id}
                    to={`/blogs/${categoryId}/${p.id}`}
                    className={`block p-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${p.id === postId ? 'bg-accent/50 font-medium' : ''
                      }`}
                  >
                    {p.title}
                  </Link>
                ))}
              </nav>
            </aside>

            {/* Main content area */}
            <article className="flex-1 p-6 lg:p-10 max-w-4xl">
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
                <div className="flex items-center text-muted-foreground mb-6">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <time>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                <p className="text-xl text-muted-foreground">{post.description}</p>
                <Separator className="my-6" />
              </header>

              {/* Blog content */}
              <BlogContent post={post} />
            </article>
          </div>
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default BlogPostPage;
