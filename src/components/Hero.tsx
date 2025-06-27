
import { useEffect, useRef, useState } from "react";
import { ArrowDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonalInfo } from "@/models/blog";
import { useTypewriter } from "@/hooks/useTypewriter";
import personalJson from "@/config/personal.json";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [showTypewriter, setShowTypewriter] = useState(false);

  const { displayText } = useTypewriter({
    text: personalInfo?.bio || "",
    speed: 30,
    delay: 1000
  });

  useEffect(() => {
    setPersonalInfo(personalJson as PersonalInfo);
    
    // Start typewriter effect after name animation
    const timer = setTimeout(() => {
      setShowTypewriter(true);
    }, 1500);

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
      clearTimeout(timer);
    };
  }, []);

  if (!personalInfo) return null;

  const handleContactClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"
    >
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="mb-6 inline-block">
          <div className="relative px-6 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-primary/90 animate-fade-in backdrop-blur-sm">
            <span className="relative z-10">Full Stack Developer & Software Engineer</span>
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 animate-shimmer" style={{ backgroundSize: '200% 100%', backgroundPosition: '0 0' }}></span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight animate-slide-up">
          <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">Hi, I'm </span>
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">{personalInfo.name}</span>
        </h1>
        
        <div className="min-h-[6rem] flex items-center justify-center mb-10">
          <div className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {showTypewriter ? (
              <div className="space-y-2">
                <p className="leading-relaxed">
                  {displayText}
                  <span className="animate-pulse">|</span>
                </p>
                <p className="text-lg text-purple-300/80 font-medium">
                  Building scalable applications from database to deployment
                </p>
              </div>
            ) : (
              <span className="opacity-0">Loading...</span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Button 
            size="lg" 
            className="rounded-full px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={handleContactClick}
          >
            Contact Me
          </Button>
          <a href={personalInfo.resumeUrl} download>
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full px-8 border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10 transition-all duration-300 transform hover:scale-105"
            >
              View Resume
            </Button>
          </a>
        </div>
      </div>
      
      <a
        href="#about"
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-primary/60 hover:text-primary transition-colors group"
      >
        <span className="text-sm font-medium mb-2 group-hover:text-purple-400 transition-colors">Scroll Down</span>
        <ArrowDownIcon className="h-5 w-5 animate-bounce group-hover:text-purple-400 transition-colors" />
      </a>
    </section>
  );
};

export default Hero;
