
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { PersonalInfo } from "@/models/blog";
import personalJson from "@/config/personal.json";

const About = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);

  useEffect(() => {
    setPersonalInfo(personalJson as PersonalInfo);
  }, []);

  if (!personalInfo) return null;

  return (
    <section id="about" className="py-24 px-6 md:px-10 bg-gradient-to-b from-background to-background/95">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start gap-12">
          <div className="w-full md:w-2/5 lg:sticky lg:top-24">
            <div className="glass-card overflow-hidden h-full">
              <div className="aspect-square overflow-hidden">
                <div className="w-full h-full bg-[url('../images/profilePic.jpg')] bg-cover bg-center transform transition-transform duration-700 hover:scale-105"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium">{personalInfo.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{personalInfo.title}</p>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium">{personalInfo.location}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium truncate">{personalInfo?.phoneNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium truncate" title={personalInfo.email}>{personalInfo.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-3/5">
            <div className="mb-8">
              <h4 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-2">About Me</h4>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">A passionate developer creating intuitive digital solutions</h2>
              
              <div className="prose prose-invert max-w-none text-muted-foreground">
                {personalInfo.about.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
            
            <Separator className="my-10" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: "System Architecture", value: "Designing scalable distributed systems and microservices" },
                { label: "Full-Stack Development", value: "Building end-to-end applications with modern technologies" },
                { label: "Database Design", value: "Optimizing data models and query performance" },
                { label: "DevOps & Cloud", value: "Implementing CI/CD pipelines and cloud infrastructure" }
              ].map((item, index) => (
                <div key={index} className="glass p-6 hover-lift">
                  <h3 className="text-lg font-medium mb-2">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
