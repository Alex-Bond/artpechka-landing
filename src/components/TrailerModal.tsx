import React from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button.tsx'
import ReactPlayer from 'react-player'

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl: string;
}

const TrailerModal = ({ isOpen, onClose, title, videoUrl }: TrailerModalProps) => {
  if (!videoUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[98vw] w-full h-[98vh] p-0 overflow-hidden bg-transparent border-0">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="flex flex-col h-full">
          <div className="w-full h-[95vh] flex flex-col">
            <ReactPlayer controls playing url={videoUrl} width='100%' height='100%' />

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
