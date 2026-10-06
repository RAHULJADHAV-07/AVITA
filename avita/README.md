# AVITA Technologies

A local React, TypeScript, and Vite website with five responsive pages: Home, About, Services, Projects, and Contact. The supplied design guides the typography, wording, blue/violet accents, scene composition, and page layouts.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:4173. No account or login is required.

## Build locally

```sh
npm run build
npm run preview
```

## Files

- `src/components/website.tsx`: page layouts, navigation, project filters, dialogs, and contact form.
- `src/styles.css`: responsive phone, tablet, and desktop styling.
- `src/App.tsx`: page selection from the URL.
- `public/artwork/`: 11 newly generated images compressed as WebP for the website.
- `assets/generated/`: full-resolution original PNG artwork.
- `design/reference.png`: your supplied design reference.
- `design/image-prompts.json`: scene prompts for the recreated artwork.
- `design/previews/`: full-page mobile and desktop screenshots of all five pages.
- `design/responsive-checks.json`: browser verification results at 320, 390, 768, and 1440 pixels.

Headings, descriptions, project labels, founder cards, and the logo use native text or SVG so they stay sharp at every screen size. Artwork is generated afresh from the reference; individual image details naturally differ from the original AI illustrations.

The contact form opens an email draft with the entered details. Sending happens in your email application. Phone, email, and the business website shown in your design retain their original destinations. Social marks are decorative because no profile addresses were provided.

This project contains no hosting configuration, GitHub connection, authentication service, or deployment scripts.
