
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl: string;
}

const TrailerModal = ({ isOpen, onClose, title, videoUrl }: TrailerModalProps) => {
  if (!videoUrl) return null;

  // Extract video ID from Vimeo URL
  const videoId = videoUrl.split('/').pop();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[98vw] w-full h-[98vh] p-0 overflow-hidden bg-cinema-background/95">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="flex flex-col h-full">
          <div className="absolute top-2 right-2 z-10">
            <DialogClose className="text-white/60 hover:text-white transition-colors bg-cinema-background/50 hover:bg-cinema-muted p-1.5 rounded-full">
              <X size={18} />
            </DialogClose>
          </div>
          
          <div className="relative w-full h-[95vh]">
            <iframe
              src={`https://player.vimeo.com/video/${videoId}?h=00000000&autoplay=0&title=0&byline=0&portrait=0`}
              allow="autoplay; fullscreen; picture-in-picture"
              className="absolute top-0 left-0 w-full h-full"
              title={title}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrailerModal;
