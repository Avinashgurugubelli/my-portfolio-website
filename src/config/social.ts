
import { LucideIcon } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon, MailIcon } from 'lucide-react';

export type SocialLink = {
  name: string;
  url: string;
  icon: LucideIcon;
};

export const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    url: "https://in.linkedin.com/in/avi-g03",
    icon: LinkedinIcon,
  },
  {
    name: "GitHub",
    url: "https://github.com/yourusername",
    icon: GithubIcon,
  },
  {
    name: "Twitter",
    url: "https://twitter.com/yourusername",
    icon: TwitterIcon,
  },
  {
    name: "Email",
    url: "mailto:goyal.avi2003@gmail.com",
    icon: MailIcon,
  },
];
