
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PersonalInfo, SocialData, SocialLinkData } from "@/config/types";
import personalJson from "@/config/personal.json";
import socialJson from "@/config/social.json";
import { GithubIcon, LinkedinIcon, TwitterIcon, MailIcon } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLinkData[]>([]);

  useEffect(() => {
    setPersonalInfo(personalJson as PersonalInfo);
    setSocialLinks((socialJson as SocialData).socialLinks);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
      setLoading(false);
    }, 1500);
  };

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
            <Card className="glass-card border-none h-full overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-6">Send Message</h3>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Your Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-secondary/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Your Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-secondary/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Your Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Hello! I'm interested in working with you..."
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="resize-none bg-secondary/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
