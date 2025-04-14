
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx'

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
      <DialogContent className="max-w-[98vw] w-full h-[98vh] p-0 overflow-hidden bg-transparent border-0">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="flex flex-col h-full">
          <div className="w-full h-[95vh] flex flex-col">
            <iframe
              src={`https://player.vimeo.com/video/${videoId}?h=00000000&autoplay=0&title=0&byline=0&portrait=0`}
              allow="autoplay; fullscreen; picture-in-picture"
              className="w-full h-full"
              title={title}
            />

            <div className='mt-10 w-full text-center'>
              <Button variant='default' onClick={()=> onClose()}>Close Video</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrailerModal;
