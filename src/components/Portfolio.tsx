import React, { useState } from 'react';
import { PortfolioItemType } from '@/types';
import PortfolioItem from './PortfolioItem';
import { cn } from '@/lib/utils';

// Sample portfolio data
const portfolioData: PortfolioItemType[] = [
  {
    id: '1',
    title: 'Urban Landscapes',
    description: 'A documentary showcasing urban architecture and city life across different metropolises.',
    services: ['Cinematography', 'Editing', 'Color Grading'],
    category: 'Documentary',
    videoType: 'Documentary',
    thumbnail: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
    trailerImages: [
      'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'
    ],
    trailerUrl: 'https://vimeo.com/83350916'
  },
  {
    id: '2',
    title: 'Neon Dreams',
    description: 'A visually striking music video featuring neon aesthetics and dynamic editing.',
    services: ['Direction', 'Editing', 'Visual Effects'],
    category: 'Music Video',
    videoType: 'Music Video',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
  },
  {
    id: '3',
    title: 'Product Launch: TechX',
    description: 'A commercial spot for a tech product launch with clean, minimal aesthetics.',
    services: ['Editing', 'Motion Graphics', 'Sound Design'],
    category: 'Commercial',
    videoType: 'Commercial',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    trailerImages: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      'https://images.unsplash.com/photo-1605810230434-7631ac76ec81'
    ]
  },
  {
    id: '4',
    title: 'Mountain Expedition',
    description: 'An adventure documentary following climbers attempting to summit a challenging peak.',
    services: ['Cinematography', 'Editing', 'Color Grading'],
    category: 'Documentary',
    videoType: 'Documentary',
    thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    trailerImages: [
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085'
    ]
  },
  {
    id: '5',
    title: 'Ethereal Sounds',
    description: 'An atmospheric music video with dreamy visuals and experimental editing techniques.',
    services: ['Direction', 'Editing', 'Visual Effects'],
    category: 'Music Video',
    videoType: 'Music Video',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    trailerImages: [
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
    ]
  },
  {
    id: '6',
    title: 'Luxury Brand Campaign',
    description: 'A high-end commercial for a luxury fashion brand with sophisticated visuals.',
    services: ['Editing', 'Color Grading', 'Post-Production'],
    category: 'Commercial',
    videoType: 'Commercial',
    thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    trailerImages: [
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085'
    ]
  }
];

const Portfolio = () => {
  const categories = ['All', ...new Set(portfolioData.map(item => item.category))];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = activeCategory === 'All' 
    ? portfolioData 
    : portfolioData.filter(item => item.category === activeCategory);

  return (
    <section id="portfolio" className="section-padding bg-cinema-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-sm font-medium text-cinema-accent mb-2">MY WORK</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-6">Featured Projects</h3>
          <p className="text-cinema-text/70 max-w-2xl mx-auto">
            Browse through my collection of work across various genres and styles, showcasing my versatility and expertise in video editing and cinematography.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm transition-colors",
                activeCategory === category
                  ? "bg-cinema-accent text-white"
                  : "bg-cinema-muted text-cinema-text/70 hover:bg-cinema-muted/70"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="portfolio-grid">
          {filteredItems.map(item => (
            <PortfolioItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
