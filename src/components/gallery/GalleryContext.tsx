import { useState, useRef, useEffect, ReactNode } from 'react'
import { GalleryContext, GalleryContextType, GalleryProps } from './types'

interface GalleryProviderProps extends GalleryProps {
  children: ReactNode
}

export const GalleryProvider = ({ 
  images, 
  alt, 
  rotate = false, 
  children 
}: GalleryProviderProps) => {
  const [currentImage, setCurrentImage] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const hasMultipleImages = images.length > 1

  const clearRotationInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    if (hasMultipleImages && !isFullscreen && rotate) {
      intervalRef.current = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length)
      }, 2000)
    } else {
      clearRotationInterval()
    }

    return clearRotationInterval
  }, [rotate, hasMultipleImages, images.length, isFullscreen])

  const nextImage = () => {
    clearRotationInterval()
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    clearRotationInterval()
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const value = {
    currentImage,
    setCurrentImage,
    images,
    isFullscreen,
    toggleFullscreen,
    nextImage,
    prevImage,
    hasMultipleImages,
    alt,
    rotate
  }

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  )
}