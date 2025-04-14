
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="section-padding bg-cinema-muted">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-sm font-medium text-cinema-accent mb-2">GET IN TOUCH</h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Let's Work Together</h3>
            <p className="text-cinema-text/70 mb-8">
              Whether you have a project in mind or just want to say hello, I'd love to hear from you. Fill out the form or use my contact details below to get in touch.
            </p>

            {/* Contact Details */}
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="bg-cinema-background p-3 rounded-md text-cinema-accent">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Email</h4>
                  <a href="mailto:contact@cinematiceditor.com" className="text-cinema-text/70 hover:text-cinema-accent transition-colors">
                    contact@cinematiceditor.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-cinema-background p-3 rounded-md text-cinema-accent">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Phone</h4>
                  <a href="tel:+12345678901" className="text-cinema-text/70 hover:text-cinema-accent transition-colors">
                    +1 (234) 567-8901
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-cinema-background p-3 rounded-md text-cinema-accent">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Location</h4>
                  <p className="text-cinema-text/70">
                    Los Angeles, California
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-medium mb-4">Follow Me</h4>
              <div className="flex gap-4">
                <a 
                  href="#" 
                  className="bg-cinema-background p-3 rounded-md text-cinema-text/70 hover:text-cinema-accent transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a 
                  href="#" 
                  className="bg-cinema-background p-3 rounded-md text-cinema-text/70 hover:text-cinema-accent transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href="#" 
                  className="bg-cinema-background p-3 rounded-md text-cinema-text/70 hover:text-cinema-accent transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube size={20} />
                </a>
                <a 
                  href="#" 
                  className="bg-cinema-background p-3 rounded-md text-cinema-text/70 hover:text-cinema-accent transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-cinema-background p-6 sm:p-8 rounded-lg">
            <h3 className="text-xl font-bold mb-6">Send Me a Message</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input 
                    id="name" 
                    placeholder="Your Name" 
                    className="bg-cinema-muted border-cinema-muted focus:border-cinema-accent"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Your Email" 
                    className="bg-cinema-muted border-cinema-muted focus:border-cinema-accent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input 
                  id="subject" 
                  placeholder="Subject" 
                  className="bg-cinema-muted border-cinema-muted focus:border-cinema-accent"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea 
                  id="message" 
                  placeholder="Your Message" 
                  rows={5}
                  className="bg-cinema-muted border-cinema-muted focus:border-cinema-accent"
                />
              </div>

              <Button className="w-full bg-cinema-accent hover:bg-cinema-accent/90">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
