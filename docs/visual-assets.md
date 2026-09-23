# Visual asset provenance

## Public-page media policy

The portfolio's public pages are image-free. They render typography, CSS surfaces,
CSS constellation glyphs, and the inert Canvas 2D cosmos only; they do not render
`img`, `picture`, `video`, or `audio` elements. The former astral-engineer hero asset
was removed. `public/og.png` is used only by Open Graph and X metadata when another
service renders a shared-link preview.

## Social preview

- File: `public/og.png`
- Created: 2026-09-23 with OpenAI built-in image generation
- Generation mode: one new image, accepted without a retry or reference image
- Source output: session-local built-in image-generation file `exec-d6de0583-9243-439d-b25e-c304561d295d.png` (not checked in)
- Source output: 1733 × 908 PNG; SHA-256 `26b9a02fd909a1fc6456a98ac34b3e0da9221383ca1b39866f350eb8b315eef6`
- Checked-in delivery asset: 1200 × 630 PNG; 338,709 bytes at documentation time; SHA-256 `2f6e1b5da3eb9545d876f0c74a6931413a69531f7f9fdda2d5670abf87d31a76`
- Text validation: `AJAY` and `Distributed Systems and AI Infrastructure Engineer` are the only text strings.
- Content boundary: no portrait, identifiable person, employer name, logo, metric, URL, or invented claim. Project-detail routes deliberately clear the site-wide image because they do not have a project-specific evidence image.

Exact generation prompt:

```text
Use case: ads-marketing
Asset type: social link preview card for a technical portfolio, landscape 1200×630.
Primary request: Create one original, typography-only monochrome social card for Ajay's engineering portfolio.
Scene and backdrop: deep pure-black field with a sparse, precise procedural-looking constellation of small white and gray points connected by very thin white-gray lines; generous negative space; no celestial photography.
Style: premium editorial engineering identity, severe black-and-white only, crisp, restrained, highly legible, minimal, no gradients with color.
Composition: crop-safe central-left typography with clear hierarchy. Large uppercase name, smaller role line beneath it. Keep every letter comfortably inside safe margins.
Text (verbatim, exact spelling, no other text):
“AJAY”
“Distributed Systems and AI Infrastructure Engineer”
Constraints: exact two text strings only; no portrait, person, face, statue, illustration, raster scene, logo, employer name, company branding, metrics, URL, watermark, signature, icons, or extra decorative text. Black, white, and neutral gray only. Do not imitate any existing brand layout. Output one finished card.
```

## Typeface

Inter Tight is self-hosted through `next/font/local`; public pages make no runtime
font request.

- Font file: `app/fonts/inter-tight-latin-variable.woff2`
- Upstream font URL: <https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsH8ahuQ2e8.woff2>
- Font SHA-256: `83d548cd73ef2e039167db3adb5ea9d7a7870466ffc8a162c9820bc348938aaf`
- License file: `app/fonts/Inter-Tight-OFL.txt`
- Upstream license URL: <https://raw.githubusercontent.com/google/fonts/main/ofl/intertight/OFL.txt>
- Upstream license SHA-256: `50240ab035cf1b6b3307940235481d515c4b6de3ab1fa843dbe59e7892cb9d58`
- Checked-in license SHA-256: `73aeb48eba2c48bb73c2b5a1718df9e0968b7f1f1f7bfd8e02cbd748766dd921`
  (one trailing ASCII space was normalized; the license text is otherwise unchanged)
- License: SIL Open Font License 1.1; the license text is distributed with the font.

## Procedural visual system

The site-wide cosmos is generated in Canvas 2D from a fixed seed. It contains three
depth levels, monochrome points and connections, and a mathematically closed
72-second drift/twinkle loop. The interaction spectrum is CSS-only and cycles over
32 seconds while motion is active. Paused and reduced-motion modes use deterministic
static states. Neither effect embeds third-party artwork or brand assets.
