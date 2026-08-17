# Handoff — Astro port landed, not yet deployed

Updated 2026-08-17 (second session). The Sanity migration was finished in the previous session;
**this session replaced the Vite/React SPA with Astro.** The site builds, type-checks clean and
was verified in a browser against the live Sanity dataset. What remains is deployment plumbing
that needs your accounts.

---

## 0. Environment facts

**Use `bun` for everything.** No `npm`, `npx`, `yarn`, or `node`.

**Do not use a git worktree for this project.** A stale one still exists at
`.claude/worktrees/website-feedback-55c10f` — it holds nothing unique (verified: its `sanity/`
is byte-identical and it lacks the asset manifest), but the permission classifier blocked its
removal, so run this yourself:

```bash
git worktree remove --force .claude/worktrees/website-feedback-55c10f && git branch -D claude/website-feedback-55c10f
```

---

## 1. Context

artpechka.com is the portfolio of **Artem Pichak**, a Kyiv-based video editor, colorist and
filmmaker with 13 years of experience (Panasonic, Sony, Samsung, Xiaomi, Microsoft/Mojang, ICTV
and others). Alex maintains the site; Artem does not write code. The driving requirement was a
CMS so Artem can update the site himself — everything else followed from it.

Original review of the old site:
<https://claude.ai/code/artifact/c749a0f9-7d01-4f74-a47d-49b271670035>

---

## 2. Architecture (settled — don't relitigate)

1. **Astro + Sanity**, static output. Studio mounts at `/studio` via `@sanity/astro`.
2. **Images come straight from Sanity's CDN** — no build-time download, no self-hosted sharp
   pipeline for stills. (`sharp` *is* used, but only for the one local portrait in `src/assets`.)
3. **Per-project pages** at `/work/[slug]`, each emitting `VideoObject` JSON-LD.
4. **Thin-content guard:** `publishedToSearch` (default `false`) keeps a project page `noindex`
   until it has real `body` and `credits`. All 33 are currently `false`, so *every project page
   is `noindex` today* — that is by design, lift it per project in the Studio.
5. **Page copy (hero, about, contact details) stays in code.** No `siteSettings` singleton yet.

---

## 3. What this session built

### Shape of the new site

| Route | File | Notes |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | Hero, About, filterable grid, Contact. `Person` JSON-LD. |
| `/work` | `src/pages/work/index.astro` | Full archive, grouped by category, **zero JS**. |
| `/work/[slug]` | `src/pages/work/[slug].astro` | 33 pages. Video, story, stills, credits. |
| `/404` | `src/pages/404.astro` | |
| `/studio` | — | Mounted by `@sanity/astro` (hash router, static output). |

Two React islands only, both `client:visible`:
`islands/PortfolioGrid.tsx` (+ `ProjectCard.tsx`) and `islands/ContactForm.tsx`.
Everything else is static Astro with small inline scripts. Home page ships ~88 KB of JS
(76 KB of it is Formik + Yup + reCAPTCHA in the contact form); project pages ship none.

`src/lib/` holds the seams: `content.ts` (GROQ queries + types), `image.ts` (srcset builder),
`video.ts` (YouTube/Vimeo parsing), `analytics.ts` (`gtag` wrapper).

### Decisions worth knowing

- **Studio drag order is the only thing that orders the grid.** The `featured` flag no longer
  hoists projects to the front — Alex chose strict Studio order everywhere (home grid, category
  filters, `/work`), so what Artem drags is what ships. `featured` now only picks which project's
  still becomes the site-level share image; the field's Studio description says so.
- **`/work` exists because the home grid isn't crawlable past six cards.** The island only
  renders its initial six in HTML; the other 27 live in serialized props. The archive page is
  what makes all 33 project pages reachable by a crawler, and it's linked from the grid and the
  footer.
- **Video is a click-to-play facade**, not an iframe: poster still + play button, swapped for a
  `youtube-nocookie` iframe on click. Saves ~1 MB of player JS per page view and is where the
  `play_video` GA event fires. **`TrailerModal` is gone** — video lives on a shareable URL now.
- **The Studio's root `sanity.config.ts` stays.** The old handoff said to delete it;
  `@sanity/astro` reads it to mount `/studio`. `projectId`/`dataset` are now hardcoded there
  because that file gets bundled for the browser, where `process.env` doesn't exist.
- **Gallery arrows are visible on touch** (`opacity-100 md:opacity-0 md:group-hover:opacity-100`),
  fixing the 30-of-33 unreachable galleries.
- **Contact form degrades instead of crashing.** A missing site key now renders a mailto
  fallback; previously it threw during render and blanked the whole page.
- **Accent is now `#D62839`** (4.97:1 on white) with `cinema-accentDark` for hover.
- **`og:image` is generated per page** from the project's own still via the Sanity CDN
  (1200×630 crop), with `seo.shareImage` as an override. No more `lovable.dev` image, and
  `author` is Artem.
- Meta descriptions are truncated to ~155 chars; card copy stays full length.

### Files removed

The SPA shell (`main.tsx`, `App.tsx`, `App.css`, `index.css`, `src/pages/*.tsx`, the eight old
section components, `src/components/gallery/`, `TrailerModal.tsx`, `index.html`,
`vite.config.ts`, `tsconfig.app.json`, `tsconfig.node.json`), the entire unused
`src/components/ui/` shadcn tree, `src/hooks/`, `src/lib/utils.ts`, `components.json`,
`eslint.config.js`.

**Still present on purpose:** `src/data/portfolioData.ts` and `src/types/` (the migration script
imports them) and `public/images/` (22 MB, still the source of truth for the *deployed* SPA).
Delete `public/images/` only once Astro is live and verified.

50 runtime deps and 9 dev deps were dropped (all Radix, react-router, react-query, react-ga4,
react-player, lucide, eslint, vite…). React was upgraded to **19** — Astro 7's React pipeline
resolves `react/compiler-runtime`, which React 18 does not export. `autoprefixer` was upgraded
because its pinned `browserslist@4.23` can't parse Vite's `baseline` target query.

### Verified in a browser against live Sanity data

Category filter (9 buttons, counts correct), View All (6 → 33), card gallery arrows, mobile menu
+ the previously-broken mobile "Get in Touch" (now scrolls to contact), contact form renders with
reCAPTCHA loaded, project page video facade → nocookie iframe, both JSON-LD blocks present,
`noindex` present, `/work` links to all 33 slugs, `/studio` mounts.
`bun run build` → 37 pages. `bun run check` → 0 errors.

*Not* exercised: an actual contact-form submission (it would send a real email).

---

## 4. What's left — needs your accounts

1. **Add Sanity CORS origins.** The Studio at `/studio` shows "Connect this Studio to your
   project" until `http://localhost:4321` and `https://artpechka.com` are added as CORS origins
   (credentials allowed) in <https://sanity.io/manage>. This was deliberately not clicked.
2. **Set the new env vars in Vercel:** `PUBLIC_RECAPTCHA_SITE_KEY` and
   `PUBLIC_GOOGLE_ANALYTICS_4`. Astro only inlines `PUBLIC_*` into the browser bundle, so the
   old `VITE_*` names no longer reach the client. Both were appended to local `.env.local`
   already; the `VITE_*` copies can go once Vercel is updated.
3. **Wire the deploy hook.** Create a Vercel deploy hook for `main`, paste the URL into Sanity's
   webhook settings, so Artem publishing triggers a rebuild.
4. **Deploy and verify**, then delete `public/images/` and (optionally)
   `src/data/portfolioData.ts` + `src/types/` once the migration script is retired.

## 5. Open items

- **`api/send-email.js` reads the wrong env var names.** It looks for
  `CONTACT_NOTIFICATION_EMAIL_FROM` / `_TO`, but `.env.local` defines
  `CONTACT_NOTIFICATION_EMAIL`. Both fall back to `no-reply@resend.updg.net` and
  `info@updg.net` — so contact mail is currently going to the fallback address, not Artem's.
  Left alone because picking the intended address is your call.
- **`/api/send-email` needs a smoke test on the first deploy.** `vite-plugin-vercel` is gone and
  `vercel.json` no longer routes `/api/*` by hand — it now relies on Vercel's zero-config `api/`
  directory support alongside the Astro preset. That is standard behaviour, but it hasn't been
  exercised on a real deploy, and the contact form is the one thing on the site that can't fail
  quietly.
- **`trailingSlash: 'never'`** is set so canonical/`og:url` match the slash-free internal links.
  If Vercel is configured to *add* trailing slashes, make the two agree.
- **No sitemap.** `@astrojs/sitemap` would need a `publishedToSearch` filter to avoid listing 33
  `noindex` pages; worth adding the first time a project page goes live.
- **`VideoObject` JSON-LD omits `uploadDate`** — the dataset has `year` but not a real date, and
  inventing one seemed worse than being ineligible for the rich result. Adding a `publishedAt`
  date field to the schema would fix it properly.
- **Vercel Hobby plan** may not cover this — a portfolio soliciting paid work reads as
  commercial under their terms. Worth checking before launch.
- **`.prettierrc.json` says `semi: true`**, but every file written since the Sanity work omits
  semicolons. Either update the config or reformat; the inconsistency predates this session.
- `@sanity/client` is v8 while `@sanity/astro` declares a `^7.14.1` peer. It builds and runs
  fine; just don't be surprised by the install warning.

## 6. Commands

```bash
bun install
bun run dev                      # Astro dev server, localhost:4321
bun run build                    # static build to dist/
bun run preview                  # serve the built output
bun run check                    # astro check (types)
bun run studio                   # standalone Studio, localhost:3333
bun run studio:deploy            # free *.sanity.studio URL for Artem
bun run migrate -- --dry-run     # migration script still works; safe, never overwrites
```
