import { createContext } from 'react'

export interface GalleryProps {
  images: string[];
  alt: string;
  rotate?: boolean;
}

export interface GalleryContextType {
  currentImage: number;
  setCurrentImage: (index: number) => void;
  images: string[];
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  nextImage: () => void;
  prevImage: () => void;
  hasMultipleImages: boolean;
  alt: string;
  rotate?: boolean;
}

export const GalleryContext = createContext<GalleryContextType | undefined>(undefined)