# Steps to Christ — project guide

A static website presenting the 13 chapters of Ellen G. White's *Steps to Christ*
(1892, public domain), retold for young people. No build step, no dependencies —
plain HTML/CSS/JS. Open `index.html` directly or serve the folder.

## Run / preview
```bash
python3 -m http.server 4340 --directory .
# then open http://localhost:4340
```
There is no framework, bundler, or package.json. Just edit files and reload.

## Structure
```
index.html                 # cover: hero emblem + 13 chapter cards + journey ribbon
chapters/NN-slug.html      # 13 chapter pages, one per chapter (same template)
assets/styles.css          # the entire design system (one file)
assets/engravings.js       # procedural inline-SVG art + section glyphs (see below)
assets/site.js             # scroll-reveal, reading-progress bar, parallax glow
```

## Design system (assets/styles.css)
- **Committed dark, cinematic** theme. Deep near-black background (`--bg:#09070e`),
  a glowing radial "light" behind titles, glassy blurred cards, glowing line-art.
- Fonts: **Fraunces** (display/serif) + **Inter** (body), via Google Fonts.
- **Per-page accent:** each page sets only `--accent` on `<body style="--accent:#hex">`.
  Everything else (`--accent-ink`, `--accent-tint`, `--accent-glow`) is derived from it
  with `color-mix()`. The 13 chapters run a "journey of light" palette from rose (ch1)
  to gold (ch13); the accents are also duplicated in `index.html` (card `--c` and ribbon `--dot`).
- No light mode (the theme toggle button is hidden via CSS).

## Chapter page anatomy (all 13 identical in structure)
1. `.topbar` — brand, "Chapter N of 13", prev/next buttons.
2. `.chapter-hero` — step pill, `<h1>`, subtitle, and a framed engraving `.plate`.
3. `.verse` — key Bible verse (KJV).
4. `.content`:
   - `.illo` **"Picture This"** — a modern analogy that opens the chapter.
   - `.section` **"The Big Idea"** — the retelling, 3 `<h3>` subsections, with two
     `.pull` magazine-style side-quotes (float right) drawn from Ellen White.
   - `.analogy` "Another way to see it" (inside Big Idea) and "Or picture" (before For Real Life).
   - `.forreal` **"For Real Life"**, `.reflect` **3 questions**, `.prayer` **a prayer**.
5. `.chapter-foot` — prev/next navigation.

## Artwork (assets/engravings.js)
- `ART` object: one procedural SVG motif per chapter, keyed by slug; mounted into
  `[data-engraving="slug"]` elements. `emblem` is the cover motif.
- `GLYPH` object: small section-header icons; `decorate()` injects one above each
  `.content .section .kicker` based on its label text (Picture This, Big Idea, quotes,
  For Real Life, Reflect, Prayer). All stroke color inherits the page `--accent`.

## Editing conventions (IMPORTANT — keep the voice human)
- **No em dashes (—).** Use periods, commas, or colons. This was a deliberate pass.
- Prefer short, plain sentences. Avoid AI-blog tics ("Here's the thing", "It's not X,
  it's Y", over-used "quietly/genuinely"). Read like a person summarizing the chapter.
- **Ellen White quotes are verbatim** (public domain). Don't paraphrase or alter them;
  they carry a `Steps to Christ, chapter N` citation.
- Analogies are modern and concrete (driving, phones, sports, nature). Vary the domains.

## Cache-busting during local preview
Asset links are versioned (`styles.css?v=7`, etc.) only to defeat browser caching while
iterating. When you change a shared asset, bump the number across all pages:
```bash
for f in index.html chapters/*.html; do
  sed -i '' -E 's#(assets/(styles\.css|engravings\.js|site\.js))\?v=[0-9]+"#\1?v=8"#g' "$f"
done
```
(On Linux use `sed -i` without the `''`.) This is cosmetic — it has no effect when the
site is opened as a plain file.

## Source
Original text: `~/Downloads/en_SC.pdf` (public domain). Chapter order and titles follow
the book exactly. Retellings, analogies, applications, and prayers are written for youth.
