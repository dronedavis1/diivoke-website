# Diivoke Creative — Website

## What's in this folder

```
index.html                          → Homepage
work.html                           → "Work" archive page (all projects grid)
works/
  gfl-transfer-station.html         → Case study page (real content, from your screenshots)
  athleta-power-of-she.html         → Case study page (placeholder copy — edit me)
  gatorball-storybrand.html         → Case study page (placeholder copy — edit me)
  varsa-app-teaser.html             → Case study page (placeholder copy — edit me)
styles.css                          → All site styling
script.js                           → Menu, accordions, FAQ, review carousel, contact form
assets/
  images/                           → Currently placeholder images — REPLACE these
  videos/                           → Currently empty — ADD your real video files here
```

## Where your real media goes (the part you said was always the blocker)

Every spot expecting a photo or video is marked with an HTML comment like:
`<!-- IMAGE: ... -->` or `<!-- VIDEO: ... -->`

To swap a placeholder for a real file:
1. Drop your video/photo into `assets/videos/` or `assets/images/`
2. Find the matching `<img src="...">` or `<video><source src="..."></video>` tag
3. Change the `src="..."` path to your new filename

Example — swapping the hero video:
```html
<video autoplay muted loop playsinline poster="assets/images/hero-poster.jpg">
  <source src="assets/videos/hero-reel.mp4" type="video/mp4">
</video>
```
Just replace `hero-reel.mp4` with your actual file, dropped into `assets/videos/`.

This is exactly the kind of thing to hand to Claude Code — e.g. "add my video `graduation-shoot.mp4` as the hero background" — and it'll wire it up correctly across HTML/paths.

## Known placeholders to replace

- **All images in `assets/images/`** are solid-color placeholders — swap for real photos/video stills
- **`athleta-power-of-she.html`, `gatorball-storybrand.html`, `varsa-app-teaser.html`** have plausible but made-up case study copy (Project Overview / On Site / Final Outcome) since your screenshots only showed the GFL case study in full — edit the actual project details in these
- **Contact form** currently opens the user's email client (mailto:) since there's no backend yet — swap `hello@diivoke.com` in `script.js` for your real inbox, or connect a form service like Formspree once you're live
- **"View Live" button** in case study pages links to `#` — point it to each project's live URL if there is one
- **Reviews carousel** only has 1 testimonial wired up — add more to the `window.REVIEWS` array in `index.html`

## Next steps (per our plan)

1. Open this folder in VS Code
2. Install Claude Code, point it at this folder
3. Tell Claude Code things like: "replace the hero video with my file X", "add 3 more testimonials", "fix the mobile menu on iPhone"
4. Push to a GitHub repo
5. Connect that repo to Cloudflare Pages for free hosting + auto-deploy on every push
