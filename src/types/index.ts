export interface PortfolioItemType {
  id: string;
  title: string;
  description: string;
  services: string[];
  category: string;
  thumbnail: string;
  workType: string;
  images?: string[];
  trailerUrl?: string;
  trailerLabel?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: React.ElementType;
}

export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
  recaptchaToken?: string;
}
