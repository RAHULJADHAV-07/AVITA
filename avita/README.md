# AVITA Technologies

An expressive React, TypeScript and Vite homepage for AVITA: Home → Studio → Services → Product Explorations → Process → Contact → Footer.

## Run locally

```sh
cd avita
npm install
npm run dev
```

Open http://127.0.0.1:4173/. From inside this directory, omit `cd avita`.

```sh
npm run build
```

## Current design

The homepage uses a charcoal, off-white and lavender palette, self-hosted Space Grotesk and Manrope, and fluid desktop gutters of 3.1vw. The content width is capped at 2080px rather than the previous narrow desktop layout. Navigation is open and centred, with numbered links, a current-section underline and a scroll-progress line.

The hero features a new transparent chrome sculpture generated with the built-in image generator, integrated into the page with ambient stars and orbital lines. Product concepts use crisp HTML/CSS/SVG previews instead of generated interface photography. Studio imagery is presented as a panoramic scene. The portfolio follows a staggered editorial layout, and contact uses an open lavender composition.

The Studio refinement preserves that design direction with balanced headline and story columns, a serif accent, an inset panoramic image, more readable founder names and monograms, and keyboard-operable native disclosures for its principles. Its imagery is labelled as a visual exploration. Staggered title reveals, image parallax and rotating accents follow the global motion setting. Initial section links scroll to their target after local fonts load.

Motion includes staggered headline entrance, floating sculpture, pointer perspective, orbital animation, a type marquee, visibility-triggered reveals, subtle parallax, magnetic CTA movement and animated workflow connections. A visible motion control pauses or resumes the experience. Reduced-motion preferences start the page in its static state. The canvas stops rendering while offscreen or while the tab is hidden.

Navigation collapses into a sheet below 960px. The hero stacks below 700px; product previews, process steps and contact content adapt to narrow screens. Sticky anchor offsets, accessible labels and focus states are included.

## Files

- `src/components/website.tsx`: content, native product previews, navigation, motion control, dialogs and contact form.
- `src/components/motion.tsx`: canvas atmosphere, visibility-aware rendering, scroll progress, reveals and parallax.
- `src/styles.css`: visual system, animation and responsive layout.
- `public/artwork/hero-sculpture-v3.webp`: optimized hero artwork with transparency.
- `assets/generated/homepage-v3/hero-sculpture.png`: generated original.
- `public/fonts/`: local typefaces and their OFL licenses.
- `design/homepage-v3-research.json`: references, design decisions, asset provenance and complete generation prompt.
- `design/homepage-v3-checks.json`: current browser checks.
- `design/previews/homepage-v3/`: current responsive screenshots.
- `design/studio-refinement-checks.json`: Studio layout, keyboard, navigation and motion checks.
- `design/previews/studio-refinement/`: updated Studio previews on mobile, tablet and desktop.

Earlier design directions, unused images, previews and verification reports are retained as history.

Service links add the selected capability to the contact brief without deleting existing text. The form validates inputs and opens an email draft; the user sends it from their email application. Supplied founders and contact destinations are preserved. Product explorations are explicitly presented as concepts, without invented clients or project results.

This is a local website project. No external deployment or publication has been performed.
