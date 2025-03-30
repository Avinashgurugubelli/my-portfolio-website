import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import BlogsSection from "@/components/BlogsSection";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Certifications />
          <Projects />
          <BlogsSection />
          <Contact />
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;