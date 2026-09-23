# Accessibility verification

Monochrome-revision implementation reviewed and tested on 2026-09-23. These results
come from the revision itself, not from the earlier astral design.

## Implemented accessibility contracts

- The Canvas cosmos is `aria-hidden`, fixed behind the document, and
  `pointer-events: none`; it cannot intercept selection, scrolling, focus, or clicks.
- The motion control remains keyboard reachable and persists only `auto` or `paused`.
  `prefers-reduced-motion` overrides an active preference, freezes the 72-second
  cosmos at its deterministic first frame, and freezes the 32-second spectrum at
  pale cyan.
- Every spectrum control has a keyboard `:focus-visible` equivalent with a permanent
  two-tone black-and-white focus ring. Project-title focus activates its entire editorial row;
  repository and other standalone controls activate only their own surface.
- Coarse/no-hover pointers do not receive simulated hover behavior. Action arrows
  remain permanently visible so touch users do not lose an affordance.
- `forced-colors: active` suppresses the decorative project-row fill, stops the
  spectrum, and uses system `Canvas`, `CanvasText`, and `Highlight` colors.
- Public pages contain no image, picture, video, or audio element that needs an
  alternative-text, caption, or media-control path. The metadata-only social card
  does not appear in the page accessibility tree.
- Project titles retain a 44px minimum touch target, and the wide-screen mission
  rail is absent below its safe gutter breakpoint. It exposes no false current
  location before a section enters the observation band.
- Failure replays remain fully operable with Previous and Next controls when
  motion is paused or reduced. Their inactive explanatory text retains AA
  contrast, and every replay deep link clears the sticky header.

## Contrast evidence

WCAG relative-luminance calculations for the current tokens:

| Pair | Ratio |
| --- | ---: |
| Primary text `#F7F7F4` on background `#030303` | 19.22:1 |
| Muted text `#A8A8A2` on surface `#090909` | 8.33:1 |
| Interactive border `#666666` on surface `#090909` | 3.47:1 |
| Pale-cyan spectrum text `#080808` on `#8DE8FF` | 14.42:1 |
| Lowest spectrum text pair, `#080808` on `#93B8FF` | 10.05:1 |

Normal text remains above 4.5:1, and the persistent interactive boundary remains
above 3:1. The completed Axe scan supplements these token calculations and
reported no rendered violations on the audited routes.

## Automated checks completed

- Playwright: 46 passed, 10 intentional device-profile skips, 0 failed across desktop
  Chrome and Pixel 7 profiles.
- Keyboard traversal: skip link, navigation, motion control, hero actions, project
  titles, standalone project actions, contact actions, and footer links.
- Motion: persisted pause/resume, operating-system reduction override, deterministic
  Canvas frame, and static spectrum fallback.
- Input/media modes: fine-pointer hover, coarse-pointer non-hover behavior, forced
  colors, 200% page scale, 44px project-title targets, and 360px/1024px
  horizontal-overflow checks across every public route.
- Axe WCAG 2.0/2.1 A and AA scans on the homepage and a representative project page
  reported no violations.
- Desktop and mobile screenshots at rest and in a deterministic paused focus state.
- Lighthouse ran three times each on the homepage, experience page, and flagship
  project page. Median scores were Performance 0.99, Accessibility 1.00, Best
  Practices 1.00, and SEO 1.00. One cold homepage run measured Performance 0.77;
  the other eight runs measured 0.99. The configured aggregate gates passed.

## Manual release steps

A human macOS VoiceOver pass and visual inspection of the protected Vercel preview
remain required. These are release gates, not automated claims.
