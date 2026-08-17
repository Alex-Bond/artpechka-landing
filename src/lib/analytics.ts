declare global {
  interface Window {
    gtag?: (command: 'event' | 'config' | 'js', ...args: unknown[]) => void
  }
}

/**
 * GA4 is loaded by Layout.astro only when PUBLIC_GOOGLE_ANALYTICS_4 is set, so
 * every call has to tolerate gtag being absent — locally it always is.
 */
export function track(action: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  window.gtag?.('event', action, params)
}
