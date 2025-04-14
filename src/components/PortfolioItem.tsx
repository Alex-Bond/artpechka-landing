
import React, { useState } from 'react';
import { PortfolioItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import TrailerModal from './TrailerModal';
import { cn } from '@/lib/utils';

interface PortfolioItemProps {
  item: PortfolioItemType;
}

const PortfolioItem = ({ item }: PortfolioItemProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div 
        className="group relative bg-cinema-muted rounded-lg overflow-hidden flex flex-col h-full hover-scale"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={item.thumbnail} 
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
          
          {/* View Trailer Button */}
          <Button 
            className="w-full bg-cinema-accent hover:bg-cinema-accent/90 gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Play size={16} />
            View Trailer
          </Button>
        </div>
      </div>
      
      {/* Trailer Modal */}
      <TrailerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={item.title}
        images={item.trailerImages}
      />
    </>
  );
};

export default PortfolioItem;
