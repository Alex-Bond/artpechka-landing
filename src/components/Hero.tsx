
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center bg-cinema-background pt-20">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cinema-accent/10 to-cinema-highlight/10 opacity-40"></div>

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      ></div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl">
          <h2 className="text-cinema-accent font-medium mb-4 animate-fade-in">VIDEO EDITOR & FILMMAKER</h2>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
            Bringing <span className="text-gradient">Stories</span> to Life Through Cinematic Excellence
          </h1>
          <p className="text-lg md:text-xl text-cinema-text/80 mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
            With over 8 years of experience in visual storytelling, I blend technical precision with creative vision to craft compelling narratives that captivate audiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <Button className="bg-cinema-accent hover:bg-cinema-accent/90 text-white px-6 py-6">
              View My Work
            </Button>
            <Button variant="secondary" className="border-cinema-accent/50 px-6 py-6">
              <Play size={16} className="mr-2" />
              Showreel
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-cinema-text/30 flex justify-center">
          <div className="w-1 h-3 bg-cinema-text/30 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
