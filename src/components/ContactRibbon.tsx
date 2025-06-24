
import { Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";
import personalJson from "@/config/personal.json";
import socialJson from "@/config/social.json";

const ContactRibbon = () => {
  return (
    <div className="bg-secondary text-secondary-foreground py-2.5 px-4 text-sm hidden md:block relative">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5" />
          <span>{personalJson.location}</span>
        </div>
        <div className="flex items-center space-x-6">
          {socialJson.socialLinks.map((link) => (
            link.name === "LinkedIn" && (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors flex items-center gap-2"
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </a>
            )
          ))}
          {socialJson.socialLinks.map((link) => (
            link.name === "GitHub" && (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            )
          ))}
          <a href={`tel:${personalJson.phoneNumber}`} className="flex items-center gap-2 hover:text-primary transition-colors">
            <Phone className="h-3.5 w-3.5" />
            <span>{personalJson.phoneNumber}</span>
          </a>
          <a href={`mailto:${personalJson.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
            <Mail className="h-3.5 w-3.5" />
            <span>{personalJson.email}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactRibbon;
