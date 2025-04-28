
import React from 'react';
import { Camera, Film, Video, Award, Users, Monitor } from 'lucide-react';

const About = () => {
  const skills = [
    { icon: Film, title: 'Video Editing', description: 'Professional editing with Premiere Pro and Final Cut Pro' },
    { icon: Camera, title: 'Cinematography', description: 'Expert camera work and lighting techniques' },
    { icon: Video, title: 'Color Grading', description: 'Advanced color correction and grading in DaVinci Resolve' },
    { icon: Award, title: 'Motion Graphics', description: 'Creative animations and effects with After Effects' },
    { icon: Users, title: 'Directing', description: 'Guiding actors and crew to achieve the perfect shot' },
    { icon: Monitor, title: 'Post-Production', description: 'Comprehensive post-production workflow management' },
  ];

  return (
    <section id="about" className="section-padding bg-cinema-muted">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          {/* Left Column - Image */}
          <div className="md:w-2/5">
            <div className="relative">
              <div className="aspect-[3/4] bg-gradient-to-br from-cinema-accent/20 to-cinema-highlight/20 rounded-md overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81" 
                  alt="Video Editor at Work" 
                  className="w-full h-full object-cover mix-blend-overlay opacity-90"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-cinema-background p-4 rounded-md shadow-lg">
                <div className="text-5xl font-bold text-cinema-accent">8+</div>
                <div className="text-sm text-cinema-text/70">YEARS OF<br />EXPERIENCE</div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="md:w-3/5">
            <h2 className="text-sm font-medium text-cinema-accent mb-2">ABOUT ME</h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Video Editor & Passionate Filmmaker
            </h3>
            <p className="text-cinema-text/80 mb-6">
              With a keen eye for detail and a passion for storytelling, I've spent the last years perfecting the art of video editing and cinematography. My approach combines technical expertise with creative vision to deliver content that not only meets but exceeds client expectations.
            </p>
            <p className="text-cinema-text/80 mb-8">
            Over the past 13 years, I have worked on music videos for Ukrainian bands, commercials, documentary films for Ukrainian television and YouTube, short films, automotive-themed videos, gadget reviews, and wedding projects. My portfolio includes projects in various formats, such as clips, media promos, corporate videos, and YouTube content. As an editor, colorist, and video assistant, I have collaborated with major brands including Panasonic, Tefal, Xiaomi, Sennheiser, Sony, Samsung, Renault, Microsoft/Mojang, Hotline.ua, KLO, ICTV, keddr, WAW, Chemonics International, MFA Ukraine, and others. Since 2017, I have also been teaching video editing to adults and teenagers at the ProCut school.

            </p>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-cinema-background p-3 rounded-md text-cinema-accent">
                    <skill.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-1">{skill.title}</h4>
                    <p className="text-cinema-text/70 text-sm">{skill.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
