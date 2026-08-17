# Research — how editors, colorists and post houses present themselves

Compiled 2026-08-17. Nineteen pages examined across four buckets, each one actually fetched.
Site copy is paraphrased rather than quoted. Where a conclusion is inference rather than
observation, it says so.

Companion documents: [HANDOFF.md](HANDOFF.md) for current state, and the review artifact at
<https://claude.ai/code/artifact/c749a0f9-7d01-4f74-a47d-49b271670035> for the issue list.

---

## 1. What was examined

### Bucket 1 — individual editors and colorists at a similar career stage

| Site | Reel | Leads with | Project structure | Credits | Clients | Rates | Text |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [stefanozordan.com](https://www.stefanozordan.com/) | none | role, city, worldwide availability, then an email ask | masonry grid, ~25 pieces, 4-way filter | category tag only | named as a text list in About | none | substantial bio |
| [joshkanuck.com](http://www.joshkanuck.com/) | first nav item | one sentence: freelance DI colorist and online editor, NYC | reel-led, not card-led | offloaded to an IMDb link labelled Credits | named in a prose sentence | none | moderate |
| [videoeditormel.com](https://videoeditormel.com/) | in nav | brand-led headline plus a 30+ logo strip in the hero | thumbnails, no project pages found | none | animated logo wall | none | minimal |
| [rachelshenton.co.uk](https://www.rachelshenton.co.uk/) | none | role, then 10 years / 1,500 weddings | portfolio split four ways | deliberately none — ghost editing | three named testimonials on the homepage | none, but a Process page | moderate |
| [farazparsa.com](https://www.farazparsa.com/) | none | abstract tagline | six selected projects; card = title, category, year, sometimes agency | agency only, on the card | six-logo strip, labelled | availability statement, no numbers | ~150 words total |
| [matheus.works](https://matheus.works/) | GIF mosaic | name and role in one line | ten works, thumbnail grid | none | one composite image | none | minimal |
| [samkolder.com](https://www.samkolder.com/) | headline + click-to-play button | name, role, city, email | cards with animated preview, category, date | none | five-logo strip | FAQ block and a stats block instead | low + 6-question FAQ |
| [dariobigi.com](https://dariobigi.com/) | — | name and two labelled doors (colour / cyber) | — | — | — | — | extreme minimal |

### Bucket 2 — higher-end colorists, post houses, editorial rosters

- **[Company 3 — Tom Poole](https://www.company3.com/artists/tom-poole/)** — portrait, role title, a four-sentence bio that does all the credentialing in prose (commercial clients named inline, feature credits woven in with director names), then a stacked awards list, then a grid of 100+ pieces. Inquiries go to **two named producers' email addresses**, not a form. The [roster page](https://company3.com/artists/) is portrait + name + two-sentence snippet + Read More.
- **[Trim Editing](https://trimediting.com/)** — 30+ card grid where **every card carries Client / Title / Director / Editor / Production Company / Agency**. An individual editor page ([Tom Lindsay](https://trimediting.com/tom-lindsay/)) is nine projects with no reel, no bio and no availability. The credit blocks are the entire page.
- **[Nomad Edit](https://www.nomadedit.com/)** — 23 cards, each captioned Editor / Director / Agency. A [single project page](https://www.nomadedit.com/us/featured/spectrum-never-miss/) is a player, a title, three credit lines, then the rest of the grid. Zero prose. Two structural notes: its project pages carry `googlebot: noindex,indexifembedded`, and the CMS is headless WordPress on a separate API subdomain — the same decoupled shape as this repo. Navigation is by craft (Editorial / VFX / Design / Color / Special Projects / Music Videos) plus a region switch.
- **[Arcade Edit](https://www.arcadeedit.com/)** — craft nav, filterable lists of 40+ brands and 50+ agencies, almost no prose.
- **[Harbor](https://harborpicturecompany.com/)** — services enumerated in a single flat sentence; contact split by market (entertainment vs advertising).
- **[Exile](https://exileedit.com/editors/)** — 23 editor cards, name plus one thumbnail, and a separate standalone finishing reel entry.
- **[Whitehouse Post](https://whitehousepost.com/editors/brian-gannon/)** — an editor's URL **redirects to that editor's reel**. The reel is the default view of a person.

### Bucket 3 — the same tooling pattern (static front end + headless CMS)

Honest gap: **no filmmaker or editor portfolio could be found that is publicly identified as Astro + Sanity.** The [Astro showcase](https://astro.build/showcase/) has essentially one individual creative portfolio ([ky.fyi](https://ky.fyi/) — twelve items, thumbnail + title + category + year, minimal prose, no contact form). [sanity-astro](https://github.com/sanity-io/sanity-astro) and the [Netlify astro-sanity starter](https://github.com/netlify-templates/astro-sanity-starter) document setup only and ship no content model worth copying.

The transferable evidence is structural rather than tool-specific: Nomad runs a decoupled CMS behind a static-feeling front end and keeps the **editable unit tiny** — title, credits, one video, one still. That is what makes a 23-piece roster maintainable by non-engineers. Separately, Kolder's site announces its purchased Webflow template in the footer, which is its own lesson about how much of a template to leave untouched.

### Bucket 4 — directories and marketplaces, where editors compete directly

- **[Upwork colorists](https://www.upwork.com/hire/color-grading-freelancers/)** — each card shows verified-ID badge, a one-line role headline, city and country, **hourly rate**, star rating with review count, jobs completed, total earnings, skill tags, then a long self-written bio. The same page prices the work for buyers: social grading $100–300, commercial/brand video $300–800, music video or short $500–1,500, feature or doc $2,000–5,000+, retainer $1,000–3,000. Ukraine is one of the browsable geographies. Buyers are told to review reels and before/after examples, and to check camera and codec experience.
- **[Creativepool](https://creativepool.com/colour-graders)** — the hiring wizard filters on exactly four axes: contract type, job title, skill level, **location**.
- **[Behance](https://www.behance.net/search/projects/?search=video%20editing%20reel)** — ranked by appreciations and views, tagged by tool.
- **[Vimeo's guide to editor portfolios](https://vimeo.com/blog/post/video-editor-portfolio)** — says to put the showreel front and centre on the homepage, and recommends short descriptions or client testimonials specifically for people who don't yet have brand recognition to coast on.

---

## 2. Recommendations for artpechka.com

### High value, low effort — do next

**1. Put a showreel in the hero.** The single biggest gap. Every bucket-2 site treats the reel as the person's front door; Whitehouse redirects an editor URL straight to their reel, Josh Kanuck's first nav item is the demo reel, Vimeo's own guide says front and centre. artpechka has no reel anywhere, and the hero currently spends its first screen on a 26-word abstraction plus an anchor link.
*How:* reuse `src/components/VideoEmbed.astro` — the click-to-play facade already exists — inside `Hero.astro`. No schema change if it follows the existing "page copy lives in code" precedent. **Needs one asset from Artem: a 60–90 second reel.** That is the real cost, not the code.

**2. Rewrite the hero headline to state role, city and availability.** Copy only. The two most credible individual sites in the sample are almost brutally literal — role, city, availability, in that order. That also matches what directories index on: Creativepool filters on job title, skill level and location; Upwork cards put role and city on line one. Suggested shape: video editor, colorist and filmmaker in Kyiv; 13 years; working remotely worldwide. Drop the separate "EDITOR & FILMMAKER" eyebrow, which duplicates it.

**3. Move the client names into the hero.** Panasonic, Sony, Samsung, Xiaomi, Tefal, Sennheiser, Renault, Microsoft/Mojang and ICTV are currently buried mid-way through a 120-word block in `About.astro` that a scanning buyer will never reach. Company 3 and Josh Kanuck both do their entire credentialing with one prose sentence of client names near the top. Pure layout change.

**4. Stop gating indexing on long-form `body`. Make credits the bar, and surface them.** The highest-leverage finding here. All 33 project pages are `noindex` because `publishedToSearch` waits for a full story and credits — and this industry does not write the story. Nomad's project page is a video plus three credit lines. Trim's editor page has no bio at all. Company 3's project pages are thumbnails. Expecting 33 essays is why the site has zero indexable project pages.
*How:* change the `publishedToSearch` description in `sanity/schemaTypes/project.ts` to require credits plus description; leave `body` optional. **No schema change needed** — `credits` is already `{role, name}` pairs, exactly the Trim/Nomad unit. Then print credits on the grid cards and on `/work`, not just the project page: category/client/year/services is self-description, while "Director X · Agency Y" is third-party and reads as verification. That is precisely why Trim and Nomad put full credits on every grid card.

**5. Add the sitemap, filtered on `publishedToSearch`.** Already on the open-items list; it becomes worth doing the moment #4 lands. Note that Nomad deliberately keeps its own project pages out of the index and lets craft and landing pages carry the SEO — so excluding a project with no credits and no story is a defensible position, not a failure.

**6. Cut the category filter from 8 buckets to 3–4.** Studio-only, zero code. Peers filter three or four ways over a comparable body of work. Eight buttons across 33 projects leaves several buckets holding two items, which makes the work look thin rather than broad.

**7. Add a one-line availability and logistics statement to the contact block.** Creativepool makes buyers choose contract type before showing anyone. `Contact.astro` already lists email, phone/WhatsApp, Telegram and Kyiv — add remote work, timezone and languages. Copy from Artem, layout change only.

### High value, higher effort — worth planning

**8. Three named client testimonials under the reel.** Rachel Shenton puts three full quotes on her homepage, each attributed to a named person at a named company, and keeps a testimonials page in the nav. Vimeo's guide names testimonials as the thing to add when you lack agency-level brand recognition. Under the reel and above the grid is the right slot: a buyer deciding whether to trust someone with a brand launch hits it before judging individual thumbnails.
*Effort:* a `testimonial` document type (quote, name, role, company, optional project ref), a static Astro component, a homepage slot — about a day. The real cost is Artem asking three producers. **They must be real:** Kolder's testimonials read as untouched template placeholders (generic names, vague roles, star ratings) and actively damage that page. Three real quotes or none.

**9. Split the reel by discipline — an edit reel and a color reel.** Artem sells three things and the market segments buyers exactly that way: Nomad's nav is Editorial / VFX / Design / Color, Arcade's is Edit / Color / VFX Finishing, Exile rosters a standalone finishing reel. Someone looking for a colorist does not want a montage of gadget reviews.
*Effort:* a small `reel` document type plus either a `/reel` route or two facades in the hero. Depends on #1; needs two cuts from Artem.

**10. A ProCut teaching page, quantified.** 2,000+ students since 2017 is a strong, verifiable, unusual credential currently reduced to one 30-word blurb among six identical skill boxes. Quantified proof does real work on the sites that use it (1,500 weddings; 10+ years; award-by-award lists). The site already surfaces "13 YEARS OF EXPERIENCE" as a badge — that instinct is right, extend it. Also a plausible second revenue funnel; mentoring is a nav item on one peer site.

**11. Replace the six skill blurbs with services that name deliverables, formats and turnaround.** The current boxes name tools, which is the level marketplace bios operate at — fine for Upwork, weak for a site whose value is not being Upwork. Upwork's own buyer guide tells clients to ask about grading workflow, revision and feedback cycles, HDR, color management and delivery standards. Publish the answers and you pre-empt the interview.
*Effort:* the `service` document type exists and is drag-orderable, so this could be data-driven cheaply — but it needs description/deliverable fields adding, plus real process and turnaround copy from Artem.

---

## 3. Considered and rejected

**An autoplaying muted video hero.** The most-cited cinematic-portfolio pattern, and wrong here. Of the high-end sites actually loaded, Nomad, Trim, Arcade, Exile and Company 3 all lead with **still-image grids**; Kolder uses a click-to-play button. The one full-screen-reel homepage in the sample comes with an explicit condition in Vimeo's own write-up: it works only if other elements or brand recognition back it up. Beyond that, this repo deliberately replaced iframes with a click-to-play facade to keep roughly a megabyte of player JS off every page view. An autoplaying hero would undo the main performance decision of the rebuild for a pattern its own peer group doesn't use.

**Long-form `body` case studies on all 33 projects.** Rejected outright; the expectation should come out of the schema description. Nobody at the top of this market writes a narrative per spot — the credit block *is* the case study, because a buyer reads the director and agency names and knows what they needed. Keep `body` optional for the two or three projects with a genuinely interesting story.

**A wall of brand logos.** Tempting, and two peers do it, but wrong here for three reasons. (a) The higher-credibility half of the sample names clients in prose instead. (b) Artem worked as editor, colorist and video assistant inside productions for these brands; a wall of trademarks implies a direct client relationship the About copy itself doesn't claim — *this is inference about how a buyer reads it, not something any site stated.* (c) It is fifteen more assets for a non-technical maintainer to source at consistent quality, and the sites that pull it off have a designer keeping the strip tidy.

**A published rates page.** Not one professional site in the sample shows a price. Meanwhile Upwork publishes $300–800 for a commercial video and offers a browsable page of colorists in Ukraine. Publishing a number drops Artem into that comparison; silence keeps him in the one his client list belongs to. Publish process and turnaround instead (#11).

**Marketplace-style credibility metrics** — jobs completed, total earnings, star ratings, 24/7 availability. Persuasive on Upwork because the platform vouches for them; self-reported on a personal site they read as unverifiable, or as a signal you came from a gig platform. Same verdict on subscriber and view counts: they work for a creator whose product is an audience. Artem's isn't. Keep the two numbers that mean something — 13 years, 2,000 students.

**A news or blog section.** Company 3 and Whitehouse both run one, but those are companies with PR staff and their recent posts are hiring announcements. A solo editor's blog goes stale in a quarter and then advertises inactivity. The teaching page (#10) gives the same active-practitioner signal without a publishing cadence.

**Removing the category filter entirely.** Rejected in both directions — a three-or-four-way filter is the norm for a body of work this size and the filter island already works. Just cut the number of buckets (#6).

**Any new React island.** The contact form is already the heaviest thing on the home page. Testimonials, reel, credits and services can all be static Astro. Worth stating because "add a testimonial carousel" is the reflexive implementation.

---

## 4. Caveats

- **Bucket 3 is thin.** No verifiable Astro + headless CMS portfolio in this field was found. The transferable lesson is structural: keep the per-project editable surface small enough that Artem actually fills it in — title, cover still, one video, credits — and put the effort into the handful of site-level pieces (reel, headline, testimonials) that don't need repeating 33 times.
- **One recommendation revises an earlier decision.** #4 contradicts the first session's choice to gate indexing on `body`. That was a defensible call for thin-content protection; the research says the market's definition of "not thin" is credits, not prose.
- **The logo-wall rejection rests on inference** about buyer perception, flagged inline above.
- Everything else is reported from a page that was fetched, with the URL given.
