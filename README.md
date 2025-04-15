# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/9c409ca3-218f-44d1-93a4-33939dac818d

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/9c409ca3-218f-44d1-93a4-33939dac818d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/9c409ca3-218f-44d1-93a4-33939dac818d) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Setting up Contact Form Email Functionality

The contact form uses Resend for email delivery through Vercel Edge Functions and includes Google reCAPTCHA protection. To set this up:

1. Create a [Resend account](https://resend.com/) and obtain an API key
2. Create a [Google reCAPTCHA](https://www.google.com/recaptcha/admin) invisible key pair (v2 Invisible)
3. Add the following environment variables to your Vercel project:
   - `RESEND_API_KEY`: Your Resend API key
   - `CONTACT_NOTIFICATION_EMAIL_FROM`: The email address to send from (must be verified in Resend)
   - `CONTACT_NOTIFICATION_EMAIL_TO`: The email address where you want to receive contact form submissions
   - `RECAPTCHA_SECRET_KEY`: Your reCAPTCHA secret key
   - `VITE_RECAPTCHA_SITE_KEY`: Your reCAPTCHA site key (will be exposed to the browser)

After adding these environment variables, your contact form will be fully functional with spam protection.
