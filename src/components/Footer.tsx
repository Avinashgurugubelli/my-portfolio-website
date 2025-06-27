
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { PersonalInfo, SocialData, SocialLinkData } from "@/models/blog";
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
  
  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case 'LinkedinIcon': return LinkedinIcon;
      case 'GithubIcon': return GithubIcon;
      case 'TwitterIcon': return TwitterIcon;
      case 'MailIcon': return MailIcon;
      default: return GithubIcon;
    }
  };

  const navigationLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'About', href: '/#about' },
    { name: 'Experience', href: '/#experience' },
    { name: 'Projects', href: '/#projects' },
  ];

  const resourceLinks = [
    { name: 'Skills', href: '/#skills' },
    { name: 'Certifications', href: '/#certifications' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Contact', href: '/#contact' },
  ];
  
  if (!personalInfo) return null;
  
  return (
    <footer className="py-16 px-6 md:px-10 bg-gradient-to-b from-background/95 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-2">{personalInfo.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{personalInfo.title}</p>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              Full-stack developer passionate about creating efficient, scalable solutions 
              and sharing knowledge through technical articles and open-source contributions.
            </p>
            <div className="flex items-center gap-3">
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
          
          {/* Navigation Column */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources Column */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <Separator className="mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {personalInfo.name}. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with React, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
