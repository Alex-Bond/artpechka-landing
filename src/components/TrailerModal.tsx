
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
      <DialogContent className="sm:max-w-3xl max-h-[90vh] p-0 overflow-hidden bg-red-600 border-red-700">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-red-700">
            <DialogTitle className="text-lg font-medium text-white">{title}</DialogTitle>
            <DialogClose asChild>
              <button className="text-white/60 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </DialogClose>
          </div>
          
          {/* Video Content */}
          <div className="relative w-full aspect-video">
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
