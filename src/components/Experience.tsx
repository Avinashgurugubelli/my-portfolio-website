
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Experience, ExperienceData } from "@/models/blog";
import experienceJson from "@/config/experience.json";

const ExperienceSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    setExperiences((experienceJson as ExperienceData).experiences);
  }, []);

  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="py-24 px-6 md:px-10 bg-gradient-to-b from-background/95 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h4 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-2">Experience</h4>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">My Professional Journey</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Timeline Tabs */}
          <div className="md:col-span-4 flex md:flex-col overflow-x-auto md:overflow-x-visible py-2 md:py-0 gap-4 md:gap-2 no-scrollbar mb-6 md:mb-0">
            {experiences.map((experience, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "group flex-none md:flex items-start text-left px-4 py-3 rounded-lg transition-all relative hover:bg-muted/40",
                  activeIndex === index ? "bg-muted" : "bg-transparent"
                )}
              >
                <div className="w-full">
                  <h3 className="font-medium truncate">{experience.company}</h3>
                  <p className="text-sm text-muted-foreground truncate">{experience.date}</p>
                </div>
                
                {activeIndex === index && (
                  <div className="absolute left-0 top-1/2 w-1 h-8 bg-primary rounded-r-full transform -translate-y-1/2" />
                )}
              </button>
            ))}
          </div>
          
          {/* Timeline Content */}
          <div className="md:col-span-8">
            <Card className="glass-card overflow-hidden border-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold">{experiences[activeIndex].title}</h3>
                      <div className="flex flex-wrap items-center text-sm text-muted-foreground mt-1 gap-3">
                        <span>{experiences[activeIndex].company}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/60"></span>
                        <span>{experiences[activeIndex].location}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/60"></span>
                        <span>{experiences[activeIndex].date}</span>
                      </div>
                    </div>
                    
                    <Separator className="mb-6" />
                    
                    <ul className="space-y-4">
                      {experiences[activeIndex].description.map((desc, idx) => (
                        <li key={idx} className="relative pl-6 before:absolute before:left-0 before:top-3 before:h-1 before:w-1 before:rounded-full before:bg-primary">
                          {desc}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </motion.div>
              </AnimatePresence>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
