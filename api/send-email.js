import { Resend } from 'resend';

export const config = {
  runtime: 'edge',
};

const errorResponse = (code, message, error)  => {
  if(error) console.error(message, error);
  return new Response(
    JSON.stringify({ error: message }),
    {
      status: code,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return errorResponse(405, 'Method not allowed')
  }

  try {
    const body = await req.json();
    const { name, email, subject, message, recaptchaToken } = body;

    if (!name || !email || !subject || !message) {
      return errorResponse(400, 'Missing required fields')
    }

    // Verify reCAPTCHA token if provided
    if (recaptchaToken) {
      const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;

      if (recaptchaSecretKey) {
        try {
          const recaptchaResponse = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaToken}`,
            { method: 'POST' }
          );

          const recaptchaData = await recaptchaResponse.json();

          if (!recaptchaData.success) {
            return errorResponse(400, 'reCAPTCHA verification failed')
          }
        } catch (recaptchaError) {
          return errorResponse(500, 'reCAPTCHA verification error', recaptchaError)
        }
      }
    } else {
      return errorResponse(400, 'reCAPTCHA token is required')
    }

    // Get Resend API key from environment variable
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return errorResponse(500, 'Server configuration error', 'RESEND_API_KEY is not set')
    }

    const resend = new Resend(apiKey);
    const fromEmail = process.env.CONTACT_NOTIFICATION_EMAIL_FROM || 'no-reply@resend.updg.net';
    const yourEmail = process.env.CONTACT_NOTIFICATION_EMAIL_TO || 'info@updg.net';

    // Send email with Resend
    const { data, error } = await resend.emails.send({
      from: `Contact Form <${fromEmail}>`,
      to: [yourEmail],
      subject: `Contact Form: ${subject}`,
      reply_to: email,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) {
      console.error('Resend API error:', error);
      throw new Error('Failed to send email via Resend API');
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully', id: data?.id }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return errorResponse(500, 'Failed to send email', error)
  }
}
