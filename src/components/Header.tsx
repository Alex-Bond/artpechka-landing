
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Contact', href: '#contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-cinema-background/90 backdrop-blur-md py-3 shadow-md' 
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <a href="#home" className="text-2xl font-heading font-bold text-gradient">
          CINEMATIC
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map(item => (
            <a 
              key={item.label}
              href={item.href}
              className="text-cinema-text/80 hover:text-cinema-accent transition-colors font-medium"
            >
              {item.label}
            </a>
          ))}
          <Button className="bg-cinema-accent hover:bg-cinema-accent/90 text-white">
            Get in Touch
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-cinema-text"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-cinema-muted py-4 animate-fade-in">
          <nav className="container mx-auto flex flex-col space-y-4">
            {navItems.map(item => (
              <a 
                key={item.label}
                href={item.href}
                className="text-cinema-text/80 hover:text-cinema-accent transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Button 
              className="bg-cinema-accent hover:bg-cinema-accent/90 text-white mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get in Touch
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
