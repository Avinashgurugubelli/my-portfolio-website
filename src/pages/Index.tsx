
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
import WaveSeparator from "@/components/WaveSeparator";
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
        className="min-h-screen bg-background text-foreground relative no-x-overflow"
      >
        <Navbar />
        <main className="pt-[120px]">
          <div className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
            <Hero />
          </div>
          
          <WaveSeparator variant="primary" />
          
          <div className="bg-gradient-to-br from-background to-slate-800/20">
            <About />
          </div>
          
          <WaveSeparator variant="secondary" flip />
          
          <div className="bg-gradient-to-br from-purple-900/10 via-background to-blue-900/10">
            <Experience />
          </div>
          
          <WaveSeparator variant="accent" />
          
          <div className="bg-gradient-to-br from-background to-emerald-900/10">
            <Skills />
          </div>
          
          <WaveSeparator variant="muted" flip />
          
          <div className="bg-gradient-to-br from-slate-800/10 via-background to-slate-700/10">
            <Certifications />
          </div>
          
          <WaveSeparator variant="primary" />
          
          <div className="bg-gradient-to-br from-background to-purple-900/10">
            <Projects />
          </div>
          
          <WaveSeparator variant="secondary" flip />
          
          <div className="bg-gradient-to-br from-blue-900/10 via-background to-purple-900/10">
            <BlogsSection />
          </div>
          
          <WaveSeparator variant="accent" />
          
          <div className="bg-gradient-to-br from-background to-slate-800/20">
            <Contact />
          </div>
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;
