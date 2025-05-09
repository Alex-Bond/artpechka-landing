import { useContext } from 'react'
import { GalleryContext } from './types'

export const useGalleryContext = () => {
  const context = useContext(GalleryContext)
  if (!context) {
    throw new Error('useGalleryContext must be used within a GalleryProvider')
  }
  return context
}