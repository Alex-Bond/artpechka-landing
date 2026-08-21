/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

interface ImportMetaEnv {
  /** GA4 measurement ID. Analytics is simply off when this is absent. */
  readonly PUBLIC_GOOGLE_ANALYTICS_4?: string
  /** reCAPTCHA v2 invisible site key. Without it the form degrades to a mailto. */
  readonly PUBLIC_RECAPTCHA_SITE_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
