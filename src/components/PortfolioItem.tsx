
import React, { useState } from 'react';
import { PortfolioItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PortfolioItemProps {
  item: PortfolioItemType;
}

const PortfolioItem = ({ item }: PortfolioItemProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const hasGallery = item.trailerImages && item.trailerImages.length > 0;
  const currentImageUrl = hasGallery ? item.trailerImages[currentImage] : item.thumbnail;

  const nextImage = () => {
    if (!hasGallery) return;
    setCurrentImage((prev) => (prev + 1) % item.trailerImages!.length);
  };

  const prevImage = () => {
    if (!hasGallery) return;
    setCurrentImage((prev) => (prev === 0 ? item.trailerImages!.length - 1 : prev - 1));
  };

  return (
    <div 
      className="group relative bg-cinema-muted rounded-lg overflow-hidden flex flex-col h-full hover-scale"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Type Badge */}
      <Badge 
        variant="secondary" 
        className="absolute top-3 left-3 z-10 bg-cinema-background/80 backdrop-blur-sm"
      >
        {item.videoType}
      </Badge>

      {/* Thumbnail/Gallery */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={currentImageUrl} 
          alt={item.title} 
          className={cn(
            "w-full h-full object-cover transition-transform duration-700",
            isHovered ? "scale-110" : "scale-100"
          )}
        />
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-cinema-background/90 to-transparent opacity-80 transition-opacity duration-300",
          isHovered ? "opacity-90" : "opacity-70"
        )}></div>

        {/* Gallery Navigation */}
        {hasGallery && item.trailerImages!.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-cinema-background/50 hover:bg-cinema-muted p-1 rounded-full text-cinema-text opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-cinema-background/50 hover:bg-cinema-muted p-1 rounded-full text-cinema-text opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={20} />
            </button>
            
            {/* Image Counter */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-cinema-background/70 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              {currentImage + 1} / {item.trailerImages!.length}
            </div>
          </>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
        <p className="text-cinema-text/70 text-sm mb-4 flex-grow">{item.description}</p>
        
        {/* Services */}
        <div className="mb-4">
          <h4 className="text-xs uppercase text-cinema-text/50 mb-2">Services</h4>
          <div className="flex flex-wrap gap-2">
            {item.services.map((service, index) => (
              <span 
                key={index}
                className="text-xs bg-cinema-background px-2 py-1 rounded-full text-cinema-text/70"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioItem;
