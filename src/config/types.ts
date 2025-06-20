
// Personal Information Types
export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  about: string;
  location: string;
  email: string;
  phoneNumber: string;
  resumeUrl: string;
}

// Skills Types
export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface SkillsData {
  skills: SkillCategory[];
}

// Experience Types
export interface Experience {
  title: string;
  company: string;
  location: string;
  date: string;
  description: string[];
}

export interface ExperienceData {
  experiences: Experience[];
}

// Projects Types
export interface Project {
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
}

export interface ProjectsData {
  projects: Project[];
}

// Certifications Types
export interface Certification {
  title: string;
  issuer: string;
  date: string;
  description?: string;
  credentialUrl?: string;
}

export interface CertificationsData {
  certifications: Certification[];
}

// Social Links Types
export interface SocialLinkData {
  name: string;
  url: string;
  icon: string;
}

export interface SocialData {
  socialLinks: SocialLinkData[];
}
