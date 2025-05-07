import React, { useRef, useState } from 'react';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ContactFormValues } from '@/types';
import ReCAPTCHA from 'react-google-recaptcha';
import { LiaTelegram } from 'react-icons/lia';

// Define validation schema
const ContactSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Name is too short').max(50, 'Name is too long').required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  subject: Yup.string().min(2, 'Subject is too short').max(100, 'Subject is too long').required('Subject is required'),
  message: Yup.string().min(10, 'Message is too short').required('Message is required'),
});

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (values: ContactFormValues, { resetForm }: FormikHelpers<ContactFormValues>) => {
    setIsSubmitting(true);
    try {
      // Execute reCAPTCHA
      const token = await recaptchaRef.current?.executeAsync();
      const formData = {
        ...values,
        recaptchaToken: token,
      };

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Thank you!',
          description: 'Your message has been sent successfully. I will contact you shortly.',
        });
        resetForm();
        recaptchaRef.current?.reset();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id='contact' className='section-padding bg-cinema-muted'>
      <div className='container mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Contact Info */}
          <div>
            <h2 className='text-sm font-medium text-cinema-accent mb-2'>GET IN TOUCH</h2>
            <h3 className='text-3xl md:text-4xl font-bold mb-6'>Let's Work Together</h3>
            <p className='text-cinema-text/70 mb-8'>
              Whether you have a project in mind or just want to say hello, I'd love to hear from you. Fill out the form
              or use my contact details below to get in touch.
            </p>

            {/* Contact Details */}
            <div className='space-y-6 mb-8'>
              <div className='flex items-start gap-4'>
                <div className='bg-cinema-background p-3 rounded-md text-cinema-accent'>
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className='font-medium mb-1'>Email</h4>
                  <a
                    href='mailto:hi@artpechka.com?subject=Inquiry%20from%20the%20website&body=Hi%20Arty!%0A%0AI%20have%20a%20project%20for%20you%20-%20'
                    className='text-cinema-text/70 hover:text-cinema-accent transition-colors'
                  >
                    hi@artpechka.com
                  </a>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='bg-cinema-background p-3 rounded-md text-cinema-accent'>
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className='font-medium mb-1'>Phone · WhatsApp</h4>
                  <a
                    href='tel:+380931422390'
                    className='text-cinema-text/70 hover:text-cinema-accent transition-colors'
                  >
                    +380 (93) 142-2390
                  </a>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='bg-cinema-background p-3 rounded-md text-cinema-accent'>
                  <LiaTelegram size={24} />
                </div>
                <div>
                  <h4 className='font-medium mb-1'>Telegram</h4>
                  <a
                    href='https://t.me/artpechka'
                    className='text-cinema-text/70 hover:text-cinema-accent transition-colors'
                  >
                    @artpechka
                  </a>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='bg-cinema-background p-3 rounded-md text-cinema-accent'>
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className='font-medium mb-1'>Location</h4>
                  <p className='text-cinema-text/70'>Kyiv, Ukraine</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className='bg-cinema-background p-6 sm:p-8 rounded-lg'>
            <h3 className='text-xl font-bold mb-6'>Send Me a Message</h3>
            <Formik
              initialValues={{
                name: '',
                email: '',
                subject: '',
                message: '',
              }}
              validationSchema={ContactSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className='space-y-6'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <label htmlFor='name' className='text-sm font-medium'>
                        Name
                      </label>
                      <Field
                        as={Input}
                        id='name'
                        name='name'
                        placeholder='Your Name'
                        className={`bg-cinema-muted border-cinema-muted focus:border-cinema-accent ${
                          errors.name && touched.name ? 'border-red-500' : ''
                        }`}
                      />
                      <ErrorMessage name='name' component='div' className='text-red-500 text-xs mt-1' />
                    </div>
                    <div className='space-y-2'>
                      <label htmlFor='email' className='text-sm font-medium'>
                        Email
                      </label>
                      <Field
                        as={Input}
                        id='email'
                        name='email'
                        type='email'
                        placeholder='Your Email'
                        className={`bg-cinema-muted border-cinema-muted focus:border-cinema-accent ${
                          errors.email && touched.email ? 'border-red-500' : ''
                        }`}
                      />
                      <ErrorMessage name='email' component='div' className='text-red-500 text-xs mt-1' />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <label htmlFor='subject' className='text-sm font-medium'>
                      Subject
                    </label>
                    <Field
                      as={Input}
                      id='subject'
                      name='subject'
                      placeholder='Subject'
                      className={`bg-cinema-muted border-cinema-muted focus:border-cinema-accent ${
                        errors.subject && touched.subject ? 'border-red-500' : ''
                      }`}
                    />
                    <ErrorMessage name='subject' component='div' className='text-red-500 text-xs mt-1' />
                  </div>

                  <div className='space-y-2'>
                    <label htmlFor='message' className='text-sm font-medium'>
                      Message
                    </label>
                    <Field
                      as={Textarea}
                      id='message'
                      name='message'
                      placeholder='Your Message'
                      rows={5}
                      className={`bg-cinema-muted border-cinema-muted focus:border-cinema-accent ${
                        errors.message && touched.message ? 'border-red-500' : ''
                      }`}
                    />
                    <ErrorMessage name='message' component='div' className='text-red-500 text-xs mt-1' />
                  </div>

                  <div className='hidden'>
                    <ReCAPTCHA ref={recaptchaRef} size='invisible' sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} />
                  </div>

                  <Button
                    type='submit'
                    className='w-full bg-cinema-accent hover:bg-cinema-accent/90'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
