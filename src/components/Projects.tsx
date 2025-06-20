
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GithubIcon, ExternalLinkIcon } from "lucide-react";
import { Project, ProjectsData } from "@/models/blog";
import projectsJson from "@/config/projects.json";

const Projects = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects((projectsJson as ProjectsData).projects);
  }, []);

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-24 px-6 md:px-10 bg-gradient-to-b from-background/95 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h4 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-2">Projects</h4>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">My Recent Work</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore some of my recent projects, showcasing my skills and expertise in building modern web applications.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Card className="glass-card border-none h-full overflow-hidden hover-lift">
                <div className="relative aspect-video overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
                    style={{
                      backgroundImage: `url(${project.imageUrl})`,
                      transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)'
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
                  
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-background/80 backdrop-blur-sm text-primary/80 text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6">{project.description}</p>
                  
                  <div className="flex items-center gap-4">
                    {project.demoUrl && (
                      <Button variant="secondary" size="sm" className="gap-2" asChild>
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLinkIcon className="h-4 w-4" />
                          <span>Live Demo</span>
                        </a>
                      </Button>
                    )}
                    
                    {project.githubUrl && (
                      <Button variant="outline" size="sm" className="gap-2" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <GithubIcon className="h-4 w-4" />
                          <span>Code</span>
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
