
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  images: string[];
}

const TrailerModal = ({ isOpen, onClose, title, images }: TrailerModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (images.length === 0) return null;

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] p-0 overflow-hidden bg-cinema-background border-cinema-muted">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-cinema-muted">
            <DialogTitle className="text-lg font-medium">{title}</DialogTitle>
            <DialogClose asChild>
              <button className="text-cinema-text/60 hover:text-cinema-accent transition-colors">
                <X size={20} />
              </button>
            </DialogClose>
          </div>
          
          {/* Content */}
          <div className="relative flex-grow">
            <div className="relative w-full h-full">
              <img 
                src={images[currentImageIndex]} 
                alt={`${title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-cinema-background/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
            
            {/* Navigation Arrows - Only show if there are multiple images */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-cinema-background/50 hover:bg-cinema-muted transition-colors p-2 rounded-full text-cinema-text"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-cinema-background/50 hover:bg-cinema-muted transition-colors p-2 rounded-full text-cinema-text"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
          
          {/* Thumbnails for quick navigation */}
          {images.length > 1 && (
            <div className="flex overflow-x-auto p-3 bg-cinema-muted">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className="flex-shrink-0 mr-2 w-16 h-12 overflow-hidden rounded"
                >
                  <div 
                    className={cn(
                      "w-full h-full transition-all duration-200",
                      currentImageIndex === index 
                        ? "border-2 border-cinema-accent opacity-100" 
                        : "border border-cinema-muted opacity-60 hover:opacity-100"
                    )}
                  >
                    <img 
                      src={image} 
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrailerModal;
