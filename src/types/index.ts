export interface PortfolioItemType {
  id: string;
  title: string;
  description: string;
  services: string[];
  category: string;
  thumbnail: string;
  videoType: string;
  trailerImages?: string[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: React.ElementType;
}
