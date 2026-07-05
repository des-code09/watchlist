---
name: Light Mode Pattern BG
overview: Add the provided movie-themed tile image as a subtle repeating background in light mode only, using a fixed pseudo-element layer with reduced opacity and a small tile size so icons stay unobtrusive.
status: deferred
reference_image: .cursor/projects/Users-drchak-Cursor-Work-Watchlist/assets/2358-96045a4c-5f8f-4bf5-bbc0-0270831b0e17.png
todos:
  - id: add-image
    content: Copy pattern image to static/images/movie-pattern.png
    status: pending
  - id: css-tokens
    content: Add --bg-pattern-size and --bg-pattern-opacity tokens for light/dark in app.css
    status: pending
  - id: css-layer
    content: Add body::before fixed tiled pattern layer with light-mode-only visibility
    status: pending
---

# Light Mode Tiled Background

## Goal

Use the provided coral movie-icon pattern as a **repeating tiled background in light mode only**, scaled down so icons are small and washed out enough not to distract from the UI.

## Approach

Apply the pattern via a `body::before` fixed overlay rather than setting `background-image` directly on `body`. This keeps the existing `--color-bg` solid base and lets us tune opacity independently without fighting the image's built-in coral color.

```css
body::before {
  background-image: url('/images/movie-pattern.png');
  background-repeat: repeat;
  background-size: var(--bg-pattern-size);   /* ~180px — small tiles */
  opacity: var(--bg-pattern-opacity);        /* ~0.07 — subtle watermark */
}
```

Dark mode sets `--bg-pattern-opacity: 0` so the layer is invisible.

## File changes

### 1. Add the image to static assets

Copy the user-provided image to:

[`static/images/movie-pattern.png`](static/images/movie-pattern.png)

SvelteKit serves this at `/images/movie-pattern.png`.

### 2. Add CSS tokens in [`src/app.css`](src/app.css)

Add to `:root` and `[data-theme='light']`:

```css
--bg-pattern-size: 180px;
--bg-pattern-opacity: 0.07;
```

Add to `[data-theme='dark']` and the existing `@media (prefers-color-scheme: dark) { :root:not([data-theme]) { ... } }` block:

```css
--bg-pattern-opacity: 0;
```

### 3. Apply the pattern layer in [`src/app.css`](src/app.css)

Update `body` and add `body::before`:

- `body` keeps `background: var(--color-bg)` and gets `position: relative` (stacking context)
- `body::before` — fixed full-viewport layer, repeating tile, `pointer-events: none`, `z-index: -1`, opacity driven by token

**Light mode visibility logic** (matches existing theme system):

| State | Pattern |
|-------|---------|
| `data-theme="light"` | visible |
| `data-theme="dark"` | hidden |
| No `data-theme`, OS light | visible (default `:root` tokens) |
| No `data-theme`, OS dark | hidden (dark media query sets opacity 0) |

No changes needed to components — cards, nav, inputs, and lists already use opaque `--color-surface` backgrounds, so content stays readable over the pattern.

### 4. Dark mode — no pattern (by design)

**As planned, the same image is not used in dark mode.** Dark mode keeps the existing solid `--color-bg: #1c1917` with `--bg-pattern-opacity: 0`, so the tile layer is fully hidden.

**Would the same image work in dark mode?** Not as-is. The tile has a **coral/salmon background with white line icons** — that palette reads as warm and bright, not as a dark-mode surface. Even at low opacity over `#1c1917`, it would likely leave a faint pinkish cast rather than feeling like native dark UI.

If a dark-mode pattern is desired later, options would be:
- **CSS-adapted same asset:** reuse the tile with filters (e.g. `opacity` ~0.04–0.06, `filter: invert(1) brightness(0.4) saturate(0.3)`) so icons appear as subtle grey marks on the dark base
- **Separate dark asset:** a tile designed with a dark background and muted icon strokes

This plan intentionally scopes to **light mode only** to avoid that mismatch.

## Tuning (if needed after preview)

If still too strong or too faint, adjust only these two tokens:

- `--bg-pattern-opacity` — try `0.05`–`0.10`
- `--bg-pattern-size` — try `150px`–`220px` (smaller = denser, smaller icons)

## Test plan

- Light mode (`/` and `/login`): faint repeating movie icons visible in page margins and between content blocks
- Dark mode: solid dark background, no pattern
- Toggle light/dark: pattern appears/disappears immediately
- System preference (no stored theme): pattern follows OS light/dark
- Scroll long watchlist: pattern stays fixed and does not interfere with sticky nav or dropdown menus
