
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { PersonalInfo, SocialData, SocialLinkData } from "@/config/types";
import personalJson from "@/config/personal.json";
import socialJson from "@/config/social.json";
import { GithubIcon, LinkedinIcon, TwitterIcon, MailIcon } from 'lucide-react';

const Footer = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLinkData[]>([]);
  
  useEffect(() => {
    setPersonalInfo(personalJson as PersonalInfo);
    setSocialLinks((socialJson as SocialData).socialLinks);
  }, []);

  const currentYear = new Date().getFullYear();
  
  // Function to get the correct icon component
  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case 'LinkedinIcon': return LinkedinIcon;
      case 'GithubIcon': return GithubIcon;
      case 'TwitterIcon': return TwitterIcon;
      case 'MailIcon': return MailIcon;
      default: return GithubIcon;
    }
  };
  
  if (!personalInfo) return null;
  
  return (
    <footer className="py-12 px-6 md:px-10 bg-gradient-to-b from-background/95 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-1">{personalInfo.name}</h3>
            <p className="text-sm text-muted-foreground">{personalInfo.title}</p>
          </div>
          
          <div className="flex items-center gap-4">
            {socialLinks.map((link, index) => {
              const Icon = getIconComponent(link.icon);
              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors"
                  aria-label={link.name}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>
        
        <Separator className="mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground order-2 md:order-1">
            © {currentYear} {personalInfo.name}. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6 order-1 md:order-2">
            <a href="#home" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#experience" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Experience
            </a>
            <a href="#skills" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Skills
            </a>
            <a href="#certifications" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Certifications
            </a>
            <a href="#projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Projects
            </a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
