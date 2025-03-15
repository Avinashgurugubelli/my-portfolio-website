
import { useEffect, useRef, useState } from "react";
import { ArrowDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonalInfo } from "@/config/types";
import personalJson from "@/config/personal.json";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);

  useEffect(() => {
    setPersonalInfo(personalJson as PersonalInfo);

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const { clientX, clientY } = e;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      const moveX = (x - 0.5) * 20;
      const moveY = (y - 0.5) * 20;
      
      containerRef.current.style.backgroundPosition = `${50 + moveX * 0.5}% ${50 + moveY * 0.5}%`;
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (!personalInfo) return null;

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0)_0%,rgba(15,23,42,0.5)_100%)]"
    >
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-10"></div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="mb-6 inline-block">
          <div className="relative px-4 py-1.5 text-xs font-medium rounded-full bg-primary/10 border border-primary/20 text-primary/80 animate-fade-in">
            <span className="relative z-10">{personalInfo.title}</span>
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 animate-shimmer" style={{ backgroundSize: '200% 100%', backgroundPosition: '0 0' }}></span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-slide-up">
          <span>Hi, I'm </span>
          <span className="text-gradient">{personalInfo.name}</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {personalInfo.bio}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Button size="lg" className="rounded-full px-8">
            Contact Me
          </Button>
          <Button variant="outline" size="lg" className="rounded-full px-8">
            View Resume
          </Button>
        </div>
      </div>
      
      <a
        href="#about"
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-primary/60 hover:text-primary transition-colors"
      >
        <span className="text-sm font-medium mb-2">Scroll Down</span>
        <ArrowDownIcon className="h-5 w-5 animate-bounce" />
      </a>
    </section>
  );
};

export default Hero;
