
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
  
  // New enhanced blog structure with consistent camelCase
  export type BlogReference = {
    title: string;
    author?: string;
    authors?: string[];
    publisher?: string;
    year?: number;
    url?: string;
    link?: string;
  };
  
  export type BlogFile = {
    id: string;
    type: "file";
    path: string;
    title: string;
    description?: string;
    date?: string;
    createdOn?: string;
    author?: string;
    tags?: string[];
    references?: BlogReference[];
  };
  
  export type BlogDirectory = {
    id: string;
    type: "directory";
    title: string;
    description?: string;
    author?: string;
    date?: string;
    createdOn?: string;
    references?: BlogReference[];
    children?: (BlogFile | BlogDirectory)[];
  };
  
  export type BlogItem = BlogFile | BlogDirectory;
  
  // Main blog category for the listing page
  export type BlogCategory = {
    id: string;
    title: string;
    description?: string;
    image?: string;
    indexUrl?: string; // For nested structure
    children?: BlogPost[]; // For simple articles
  };
  
  // Simple blog post for backward compatibility
  export type BlogPost = {
    id: string;
    title: string;
    description?: string;
    date: string;
    path?: string;
    contentPath?: string;
    contentUrl?: string;
    content?: string;
  };
  
  export type BlogsData = {
    categories: BlogCategory[];
  };
  
  // For nested blog index files
  export type NestedBlogIndex = BlogDirectory;

  // Add NestedBlogsData type for compatibility
  export type NestedBlogsData = {
    blogs: BlogDirectory[];
  };
