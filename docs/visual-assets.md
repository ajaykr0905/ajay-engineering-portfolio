# Visual asset provenance

## Astral engineer hero

- File: `public/images/astral-engineer.avif`
- Created: 2026-09-23 with OpenAI image generation
- Purpose: decorative homepage artwork for the portfolio's astral systems-engineering identity
- Source boundary: generated as an original, fictional, non-identifiable marble bust. The supplied screenshot informed only the broad cosmic mood; no source artwork, logo, person, or text was copied into the asset.
- Accessibility: intentionally uses empty alternative text because the adjacent headline and evidence panel carry the meaning.
- Delivery: 1122 × 1402 AVIF, 53 KB at commit time, with intrinsic dimensions supplied in the page to prevent layout shift. Next.js emits responsive candidates including 360, 384, 480, 560, and 640 px widths; the measured Lighthouse mobile request was 31 KB.

Final generation brief: an original fictional marble engineer bust in a deep black-green cosmic field, crossed by an abstract neural-light band and surrounded by precise constellation and orbital traces, with restrained emerald, cyan, violet, coral, and amber lighting; portrait 4:5 composition; no text, logos, watermark, recognizable person, or copied composition.

## Social preview

- File: `public/og.png`
- Created: 2026-09-23 with OpenAI image generation, using the approved hero artwork as the visual anchor
- Purpose: site-wide Open Graph and X link preview
- Text validation: “AJAY PONDUGALA”, “Distributed Systems and AI Infrastructure Engineer”, and “EVIDENCE BEFORE CLAIMS” were checked after generation; no additional copy or claim is present.
- Delivery: crop-safe 1200 × 630 PNG. Project-detail routes deliberately clear the site-wide image because they do not yet have their own verified project image.

Final generation brief: a premium landscape social card with the fictional marble bust on the right, clean technical copy on the left, the portfolio's black-green and spectral palette, and the three exact text strings above; no employer names, metrics, logos, URLs, or invented claims.

## Lighthouse image note

Lighthouse 12's `image-delivery-insight` compares the 640 px candidate with the 378 CSS-pixel rendered width without crediting the audit device's 1.75 device-pixel ratio. The browser selects 640 px because 378 × 1.75 is approximately 662 physical pixels; serving 384 px would reduce detail on the simulated high-density display. The insight therefore remains visible as a warning while the older responsive-image audit and the four required category thresholds remain release-blocking errors.
