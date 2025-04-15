import React, { useState } from 'react'
import { PortfolioItemType } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'
import Gallery from './gallery'
import TrailerModal from './TrailerModal'

interface PortfolioItemProps {
  item: PortfolioItemType;
}

const PortfolioItem = ({ item }: PortfolioItemProps) => {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const images = item.images || [item.thumbnail]
  const [isHover, setHover] = useState(false)

  return (
    <div className='group relative bg-cinema-muted rounded-lg overflow-hidden flex flex-col h-full hover-scale'
         onMouseEnter={() => setHover(true)}
         onMouseLeave={() => setHover(false)}
    >
      {/* Video Type Badge - White background with black text */}
      <Badge
        variant='outline'
        className="absolute top-3 left-3 z-10 bg-white/80 text-black"
      >
        {item.workType}
      </Badge>

      {/* Gallery */}
      <Gallery images={images} alt={item.title} rotate={isHover} />

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

        {/* Trailer Button */}
        {item.trailerUrl && (
          <Button
            variant="default"
            className="w-full mt-4 bg-[#ea384c] hover:bg-[#c0303e]"
            onClick={() => setIsTrailerOpen(true)}
          >
            <Play className="w-4 h-4" /> View Trailer
          </Button>
        )}
      </div>

      {/* Trailer Modal */}
      {item.trailerUrl && (
        <TrailerModal
          isOpen={isTrailerOpen}
          onClose={() => setIsTrailerOpen(false)}
          title={item.title}
          videoUrl={item.trailerUrl}
        />
      )}
    </div>
  );
};

export default PortfolioItem;
