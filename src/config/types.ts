
// Type definitions for our JSON data

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
