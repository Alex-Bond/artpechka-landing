# artpechka.com

Portfolio of Artem Pichak — video editor, colorist and filmmaker. Static [Astro](https://astro.build)
site with content in [Sanity](https://www.sanity.io), deployed on Vercel.

Artem edits the site himself in the Studio; he does not write code. That constraint decides most
of what follows.

## Running it

```bash
bun install
bun run dev          # localhost:4321
bun run build        # static build to dist/
bun run preview      # serve the built output
bun run check        # astro check
```

Use `bun`, not npm or node.

Editing `astro.config.mjs` or `package.json` makes the dev server restart itself, which
occasionally fails to rebind the port. Restart it manually if the site stops responding.

## Content

Everything except page copy lives in Sanity (project `ntn8xrgb`, dataset `production`, public).
The Studio is embedded at `/studio`.

| Type | Notes |
| --- | --- |
| `project` | Title, slug, client, year, category, description, services, body, credits, stills, videos |
| `category` | Drives the filter buttons on the home grid |
| `service` | The craft tags on a card |
| `client` | The logo strip in the hero |

All four are drag-to-reorder, and that order is what the site renders — there is no separate
sort field or featured-first behaviour.

Things worth knowing before changing the schema:

- **The first still is the cover.** There is no thumbnail field; ordering the array chooses it.
  When a project has a video, the cover doubles as the player poster and drops out of the stills
  strip so it is not shown twice.
- **Project pages are indexed by default.** `hideFromSearch` is an opt-out for the exceptions.
  Hidden projects are excluded from the sitemap as well as serving `noindex`.
- **`featured` only picks the site-level share image.** It does not affect ordering.
- **The client strip is not wired to `project.client`.** The strip is a curated roster; the
  project field is a per-project fact. Coupling them would put every tagged client on the home page.
- **Client logos want a one-colour white SVG.** Without a logo a client is skipped entirely, since
  a name in text among four logos reads as a broken image.

Page copy (hero, about, contact details) is in the components, not the CMS. Artem changes it about
once a year, and a settings singleton is how a small job becomes a large one.

## Adding client logos

```bash
bun run logos:upload -- --dir=<folder>            # add
bun run logos:upload -- --dir=<folder> --replace  # overwrite existing
```

Filenames map to client documents inside the script. Needs `SANITY_WRITE_TOKEN`.

## Environment

`.env.local`, gitignored. Astro only exposes `PUBLIC_*` to the browser.

| Variable | Used by |
| --- | --- |
| `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET` | build and Studio |
| `SANITY_WRITE_TOKEN` | the logo upload script only |
| `PUBLIC_RECAPTCHA_SITE_KEY` | contact form; without it the form degrades to a mailto |
| `PUBLIC_GOOGLE_ANALYTICS_4` | analytics; absent means no tracking |
| `RESEND_API_KEY`, `RECAPTCHA_SECRET_KEY`, `CONTACT_NOTIFICATION_EMAIL` | `api/send-email.js` |

## Before this goes live

- [ ] Set `PUBLIC_RECAPTCHA_SITE_KEY` and `PUBLIC_GOOGLE_ANALYTICS_4` in Vercel — the old `VITE_*`
      names no longer reach the browser
- [ ] Wire a Vercel deploy hook into Sanity's webhooks so publishing rebuilds the site
- [ ] Fix `api/send-email.js`: it reads `CONTACT_NOTIFICATION_EMAIL_FROM` / `_TO`, which are not
      set, so mail currently goes to a fallback address instead of Artem
- [ ] Send one real contact-form submission end to end — never yet exercised, because it emails
- [ ] Submit the sitemap in Search Console
- [ ] Check the Vercel plan: a portfolio soliciting paid work reads as commercial use

## Rolling back

The previous Vite/React SPA, its hardcoded `portfolioData.ts` and the 22 MB of local stills are on
`main`. This branch deleted them because nothing here reads them; recover with
`git checkout main -- public/images src/data`.
