
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ContactForm from "./ContactForm";
import { PersonalInfo, SocialData, SocialLinkData } from "@/models/blog";
import personalJson from "@/config/personal.json";
import socialJson from "@/config/social.json";
import { GithubIcon, LinkedinIcon, TwitterIcon, MailIcon } from 'lucide-react';

const Contact = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLinkData[]>([]);

  useEffect(() => {
    setPersonalInfo(personalJson as PersonalInfo);
    setSocialLinks((socialJson as SocialData).socialLinks);
  }, []);

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
    <section id="contact" className="py-24 px-6 md:px-10 bg-gradient-to-b from-background to-background/95">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h4 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-2">Contact</h4>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Get In Touch</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or want to discuss potential opportunities? Feel free to reach out!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <Card className="glass-card border-none h-full overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <a href={`mailto:${personalInfo.email}`} className="font-medium hover:text-primary transition-colors">
                      {personalInfo.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <p className="font-medium">{personalInfo?.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <p className="font-medium">{personalInfo.location}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">Social Media</p>
                    <div className="flex flex-wrap gap-3">
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
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
