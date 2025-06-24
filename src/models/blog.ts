export type PersonalInfo = {
    name: string;
    title: string;
    email: string;
    location: string;
    bio: string;
    about: string;
    resumeUrl: string;
    phoneNumber?: string;
  };
  
  export type SkillCategory = {
    category: string;
    skills: string[];
  };
  
  export type SkillsData = {
    skills: SkillCategory[];
  };
  
  export type SocialLinkData = {
    name: string;
    url: string;
    icon: string;
  };
  
  export type SocialData = {
    socialLinks: SocialLinkData[];
  };
  
  export type Experience = {
    title: string;
    company: string;
    location: string;
    date: string;
    description: string[];
  };
  
  export type ExperienceData = {
    experiences: Experience[];
  };
  
  export type Project = {
    title: string;
    description: string;
    tags: string[];
    imageUrl: string;
    demoUrl?: string;
    githubUrl?: string;
  };
  
  export type ProjectsData = {
    projects: Project[];
  };
  
  export type Certification = {
    title: string;
    issuer: string;
    date: string;
    credentialId?: string;
    credentialUrl?: string;
    description?: string;
    imageUrl?: string;
  };
  
  export type CertificationsData = {
    certifications: Certification[];
  };
  
  export type BlogReference = {
    title: string;
    author: string;
    link: string;
  };
  
  export type BlogFile = {
    label: string;
    type: "file";
    path: string;
    title: string;
    description?: string;
    date?: string;
  };
  
  export type BlogDirectory = {
    label: string;
    type: "directory";
    title: string;
    description?: string;
    author?: string;
    indexUrl?: string;
    references?: BlogReference[];
    children?: (BlogFile | BlogDirectory)[];
  };
  
  export type BlogItem = BlogFile | BlogDirectory;
  
  export type NestedBlogsData = {
    blogs: BlogDirectory[];
  };
  
  // Legacy types for backward compatibility
  export type BlogPost = {
    id: string;
    title: string;
    description: string;
    date: string;
    contentPath?: string;
    contentUrl?: string;
    content?: string;
    
  };
  
  export type BlogCategory = {
    id: string;
    title: string;
    description: string;
    image: string;
    children: BlogPost[];
    indexUrl?: string;
  };
  
  export type BlogsData = {
    categories: BlogCategory[];
  };
