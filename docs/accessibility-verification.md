# Accessibility verification

Verified on 2026-09-23 unless explicitly marked as a manual release step.

## Automated evidence

- Axe scans pass with no WCAG 2.0/2.1 A or AA violations on the homepage and transformer case study in desktop Chrome and Pixel 7 emulation.
- Keyboard traversal reaches the theme control, motion control, primary calls to action, all three hero project links, and project-card links.
- The ambient canvas is `aria-hidden`, fixed behind content, and computed as `pointer-events: none`; a real click reaches the underlying projects anchor.
- The persisted motion preference passes reload checks. Operating-system reduced motion overrides an active local preference and produces a deterministic static frame.
- Pixel 7 emulation confirms a coarse pointer never activates pointer spotlights. A separate Chrome DevTools check confirms the main heading and primary call to action remain visible at a 200% page scale.
- Dark/light and desktop/mobile screenshots are captured by Playwright with motion paused on every browser run.

## Contrast evidence

WCAG relative-luminance calculations for the design tokens:

| Pair | Ratio |
| --- | ---: |
| Dark primary text `#F4FAF7` on `#030806` | 19.08:1 |
| Dark muted text `#9DB0A7` on `#09130F` | 8.28:1 |
| Emerald `#55E6A5` on `#030806` | 12.72:1 |
| Light primary text `#0B1C14` on `#F3F8F5` | 16.43:1 |
| Light muted text `#496158` on `#F3F8F5` | 6.24:1 |
| Dark interactive border `#526E62` on `#09130F` | 3.39:1 |
| Light interactive border `#6C8478` on `#FFFFFF` | 4.03:1 |

This keeps normal text above 4.5:1 and visible control boundaries above 3:1. Axe independently checks rendered text contrast in both tested themes.

## Manual release step

The browser accessibility tree was inspected and exposes correctly named navigation, buttons, project links, headings, definition lists, and landmarks. A human VoiceOver pass on macOS remains the final manual sign-off because enabling and driving a user's operating-system screen reader is intentionally not automated by this repository.
