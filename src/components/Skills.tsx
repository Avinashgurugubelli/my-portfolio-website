
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SkillsData } from "@/models/blog";
import skillsJson from "@/config/skills.json";

const Skills = () => {
  const [skills, setSkills] = useState<SkillsData["skills"]>([]);

  useEffect(() => {
    setSkills(skillsJson.skills);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="skills" className="py-24 px-6 md:px-10 bg-gradient-to-b from-background to-background/95">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h4 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-2">Skills</h4>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">My Technical Expertise</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((category, index) => (
            <Card key={index} className="glass-card border-none hover-lift overflow-hidden group">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-6 group-hover:text-gradient transition-all duration-500">
                  {category.category}
                </h3>
                
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                  variants={container}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {category.skills.map((skill, idx) => (
                    <motion.div key={idx} variants={item}>
                      <div className={cn(
                        "px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center bg-secondary/50 hover:bg-secondary transition-colors"
                      )}>
                        {skill}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
