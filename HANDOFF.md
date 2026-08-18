# Handoff — Astro port landed, not yet deployed

Updated 2026-08-17 (second session). The Sanity migration was finished in the previous session;
**this session replaced the Vite/React SPA with Astro.** The site builds, type-checks clean and
was verified in a browser against the live Sanity dataset. What remains is deployment plumbing
that needs your accounts.

---

## 0. Environment facts

**Use `bun` for everything.** No `npm`, `npx`, `yarn`, or `node`.

**Do not use a git worktree for this project.** The stale one has been removed — `git worktree
list` shows only the main checkout and the `claude/website-feedback-55c10f` branch is gone. An
empty `.claude/worktrees/` directory may linger; it is gitignored and harmless.

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
4. **Thin-content guard:** `publishedToSearch` (default `false`) keeps a project page `noindex`.
   **The bar is credits, not prose** — the research found this market's credibility unit is the
   credit block (Nomad, Trim and Company 3 publish a player plus Director / Editor / Agency and
   nothing else), so waiting on 33 written case studies was holding every page out of the index
   for a standard nobody in the field meets. `body` is optional. The Studio blocks turning the
   switch on with no credits, and credits print on the grid cards as well as the project page,
   where third-party names read as verification rather than self-description.
   All 33 are still `false` and 0 have credits, so *every project page is `noindex` today*:
   Artem filling in Director / Production / Agency is what unblocks it.
5. **Page copy (hero, about, contact details) stays in code.** No `siteSettings` singleton yet.
   The hero now leads with the role — "Video editor, colorist and filmmaker" — then 13 years,
   the YouTube/creator work (Amo Pictures, Ali Abdaal, KADDR, Hotline) and remote availability.
   **Kyiv is deliberately not in the hero**: Alex wants location in the contact section only, so
   it stays visible there and, invisibly, in the page title and `Person` JSON-LD for local search.

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
Everything else is static Astro with small inline scripts. Measured gzipped: the grid island's
entry is under 2 KB and the contact form is ~24 KB (Formik + Yup + reCAPTCHA); project pages
ship no JavaScript at all.

`src/lib/` holds the seams: `content.ts` (GROQ queries + types), `image.ts` (srcset builder),
`video.ts` (YouTube/Vimeo parsing), `analytics.ts` (`gtag` wrapper).

### Decisions worth knowing

- **Services are documents** (`service`), like categories — drag-to-reorder, and Artem can add or
  rename one without an engineer. They were a hardcoded list of nine strings in `project.ts`.
  Projects reference them; `services[]->title` in the GROQ keeps the rest of the site seeing a
  plain string array, so no component changed. The live dataset was migrated with
  `bun run migrate:services` — 9 services created, 33 projects patched, verified every reference
  resolves with no empty arrays. The previous string values sit in the gitignored
  `scripts/.services-backup.json` if anything needs reverting.
- **Clients are documents** (`client`) driving a five-logo row inside the hero
  (`src/components/ClientLogos.astro`, rendered by `Hero.astro`). Name, logo, an "invert" switch
  for dark logos, optional website, drag order. **Logos only** — a name in text among four logos
  reads as a missing asset, so a client without a logo is skipped and the row hides entirely until
  logos exist. **It is hidden right now: 15 clients, 0 logos.** Which five show is simply the top
  five in the Studio's Clients list, so reordering there is the whole control — no extra flag.
  Deliberately *not* wired to `project.client`: the row is a curated roster, the project field is
  a per-project fact. Seeded from Artem's About copy with `bun run seed:clients` (additive).
  **Three logos are live** — Xiaomi, Hotline.ua and Caterpillar (a new client, added with its
  logo) — prepared as one-color white SVG and uploaded with
  `bun run logos:upload -- --dir=<folder>` (`--replace` overwrites). Sizing is optical, not
  uniform: squarish marks render at 24px and wordmarks at 28px, because identical pixel
  heights make a square logo dominate a row of wordmarks. Two more logos fill the row of five.
  Note: the research argued against a logo wall (peers name clients in prose; a trademark wall
  implies a direct client relationship the bio doesn't claim) — Alex chose logos in the hero.
- **`project.client` and `project.year` are empty on all 33 projects.** The old `portfolioData`
  never had those fields, so nothing populated them and the card meta line silently falls back to
  the category. If `client` is ever wanted as a reference rather than free text, now is the free
  moment — there is no data to migrate.
- **About was rewritten around a belief, not a CV.** It opens with a statement about what
  automation can't do, then three short paragraphs in Artem's first person, four craft cards
  (Editing, Color, Camera, Motion) and a teaching band led by the 2,000+ student count. Gone: the
  client roll-call (the logo strip in the hero already names them), the six-card skills grid
  (Post-Production was the container the other four sit in; Tutoring was a different offer to a
  different buyer), and the section title that duplicated the hero. The section is narrower than
  the rest of the page (`max-w-5xl`) because it is read rather than scanned, and the portrait is
  capped on phones where a full-width 3:4 image filled the screen. Drafts, alternates and the
  reasoning live in `design/about-option-a.html`, which is outside the build.
  **Still invented:** "which of nine takes is alive" — ask Artem for his real version.
- **Em dashes are hyphens in visible copy**, American spelling throughout. Code comments keep
  em dashes; one in `content.ts` sits inside a regex character class and must stay.
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
bun run migrate -- --dry-run     # portfolioData -> Sanity; safe, never overwrites
bun run migrate:services         # one-off: services strings -> references (idempotent, already run)
bun run seed:clients             # seed the Clients list from the About copy (additive, already run)
bun run logos:upload -- --dir=<folder>   # upload prepared white SVG logos (--replace to overwrite)
```
