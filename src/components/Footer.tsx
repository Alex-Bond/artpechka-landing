
import React from 'react';
import { ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-cinema-background border-t border-cinema-muted/30 py-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <div className="text-xl font-heading font-bold text-gradient mb-2">
              ARTY PICHAK
            </div>
            <p className="text-cinema-text/60 text-sm">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center space-x-6">
              <a
                href="#home"
                onClick={(e) => handleNavClick(e, '#home')}
                className="text-cinema-text/60 hover:text-cinema-accent text-sm transition-colors"
              >
                Home
              </a>
              <a
                href="#about"
                onClick={(e) => handleNavClick(e, '#about')}
                className="text-cinema-text/60 hover:text-cinema-accent text-sm transition-colors"
              >
                About
              </a>
              <a
                href="#portfolio"
                onClick={(e) => handleNavClick(e, '#portfolio')}
                className="text-cinema-text/60 hover:text-cinema-accent text-sm transition-colors"
              >
                Portfolio
              </a>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className="text-cinema-text/60 hover:text-cinema-accent text-sm transition-colors"
              >
                Contact
              </a>
            </nav>

            <button
              onClick={scrollToTop}
              className="bg-cinema-muted p-3 rounded-full text-cinema-text/60 hover:text-cinema-accent transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
