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
  videos?: [PortfolioVideoItem] | [PortfolioVideoItem, PortfolioVideoItem] | [PortfolioVideoItem, PortfolioVideoItem, PortfolioVideoItem]
}

export interface PortfolioVideoItem {
  url: string,
  label?: string
}

export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
  recaptchaToken?: string;
}
