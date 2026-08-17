import { useRef, useState } from 'react'
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik'
import * as Yup from 'yup'
import ReCAPTCHA from 'react-google-recaptcha'
import { track } from '../../lib/analytics'

interface ContactFormValues {
  name: string
  email: string
  subject: string
  message: string
}

const ContactSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Name is too short').max(50, 'Name is too long').required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  subject: Yup.string().min(2, 'Subject is too short').max(100, 'Subject is too long').required('Subject is required'),
  message: Yup.string().min(10, 'Message is too short').required('Message is required'),
})

const INITIAL: ContactFormValues = { name: '', email: '', subject: '', message: '' }

const FIELD_CLASS =
  'w-full rounded-md border border-cinema-muted bg-cinema-muted px-3 py-2 text-sm text-cinema-text placeholder:text-cinema-text/40 focus:border-cinema-accent focus:outline-none focus:ring-1 focus:ring-cinema-accent'

/**
 * The site key is read here rather than at module scope so a missing key is a
 * degraded form, not a render-time throw. In the old build the same missing
 * variable took the entire page down to a blank screen.
 */
const SITE_KEY = import.meta.env.PUBLIC_RECAPTCHA_SITE_KEY as string | undefined

export default function ContactForm({ email }: { email: string }) {
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [status, setStatus] = useState<{ kind: 'ok' | 'error'; message: string } | null>(null)

  const handleSubmit = async (
    values: ContactFormValues,
    { resetForm, setSubmitting }: FormikHelpers<ContactFormValues>,
  ) => {
    setStatus(null)
    try {
      const token = await recaptchaRef.current?.executeAsync()
      if (!token) throw new Error('Could not verify you are human. Please try again.')

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, recaptchaToken: token }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to send message')
      }

      track('contact_form_submit')
      setStatus({
        kind: 'ok',
        message: 'Thank you! Your message has been sent — I will get back to you shortly.',
      })
      resetForm()
    } catch (error) {
      setStatus({
        kind: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to send message. Please try again.',
      })
    } finally {
      recaptchaRef.current?.reset()
      setSubmitting(false)
    }
  }

  if (!SITE_KEY) {
    return (
      <div className="rounded-lg bg-cinema-background p-6 sm:p-8">
        <h3 className="mb-4 text-xl font-bold">Send Me a Message</h3>
        <p className="text-cinema-text/70">
          The message form is unavailable right now. Email me directly at{' '}
          <a href={`mailto:${email}`} className="text-cinema-accent underline">
            {email}
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-cinema-background p-6 sm:p-8">
      <h3 className="mb-6 text-xl font-bold">Send Me a Message</h3>

      <Formik initialValues={INITIAL} validationSchema={ContactSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="space-y-6" noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Field id="name" name="name" placeholder="Your Name" className={FIELD_CLASS} />
                <ErrorMessage name="name" component="div" className="mt-1 text-xs text-red-400" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  className={FIELD_CLASS}
                />
                <ErrorMessage name="email" component="div" className="mt-1 text-xs text-red-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Field id="subject" name="subject" placeholder="Subject" className={FIELD_CLASS} />
              <ErrorMessage name="subject" component="div" className="mt-1 text-xs text-red-400" />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Field
                as="textarea"
                id="message"
                name="message"
                rows={5}
                placeholder="Your Message"
                className={FIELD_CLASS}
              />
              <ErrorMessage name="message" component="div" className="mt-1 text-xs text-red-400" />
            </div>

            <div className="hidden">
              <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={SITE_KEY} />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send Message'}
            </button>

            {status && (
              <p
                role="status"
                className={
                  'text-sm ' + (status.kind === 'ok' ? 'text-cinema-highlight' : 'text-red-400')
                }
              >
                {status.message}
              </p>
            )}
          </Form>
        )}
      </Formik>
    </div>
  )
}
