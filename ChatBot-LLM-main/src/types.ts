export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  sources?: string[];
}

export interface SanaullahProfile {
  name: string;
  role: string;
  tagline: string;
  email: string;
  education: {
    institution: string;
    degree: string;
    period: string;
    cgpa: string;
  };
  skills: {
    librariesAndFrameworks: string[];
    languages: string[];
    tools: string[];
  };
  emergingTechnologies: string[];
  internship: {
    role: string;
    company: string;
    period: string;
    description: string;
  };
  certifications: {
    title: string;
    issuer: string;
  }[];
  links: {
    github: string;
    linkedin: string;
    portfolio: string;
    huggingface: string;
    kaggle: string;
    email: string;
  };
}
