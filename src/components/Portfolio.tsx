import React, { useState } from 'react';
import { PortfolioItemType } from '@/types';
import PortfolioItem from './PortfolioItem';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { portfolioData } from '@/data/portfolioData';

const Portfolio = () => {
  const categories = ['All', ...new Set(portfolioData.map(item => item.category))];
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [wasShowAllClickedInAll, setWasShowAllClickedInAll] = useState(false);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (!wasShowAllClickedInAll) {
      setShowAll(false);
    }
  };

  const handleViewAll = () => {
    setShowAll(true);
    if (activeCategory === 'All') {
      setWasShowAllClickedInAll(true);
    }
  };

  const filteredItems = activeCategory === 'All'
    ? portfolioData
    : portfolioData.filter(item => item.category === activeCategory);

  const displayedItems = showAll ? filteredItems : filteredItems.slice(0, 6);
  const hasMoreItems = filteredItems.length > 6;

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

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayedItems.map(item => (
            <PortfolioItem key={item.id} item={item} />
          ))}
        </div>

        {hasMoreItems && !showAll && (
          <div className="text-center mt-8">
            <Button
              onClick={handleViewAll}
              className="bg-cinema-accent hover:bg-cinema-accent hover:bg-[#c0303e] hover:text-white"
            >
              View All
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
