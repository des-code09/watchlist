---
name: List Item Hover
overview: Add a subtle hover background to each movie list item using a semantic CSS token, scoped to pointer devices.
status: ready
todos:
  - id: hover-token
    content: Add --color-row-hover token to :root in app.css
    status: pending
  - id: hover-styles
    content: Add transition and li:hover rule in app.css
    status: pending
---

# List Item Hover State

## Change

In [`src/app.css`](src/app.css):

### 1. Add token in `:root` (after `--color-surface`)

```css
--color-row-hover: var(--color-bg);
```

Uses `--color-bg` so hover adapts automatically in light and dark mode without duplicating per theme block.

### 2. Update `li` rules

```css
li {
  /* existing rules … */
  transition: background-color 0.15s ease;
}

@media (hover: hover) {
  li:hover {
    background: var(--color-row-hover);
  }
}
```

`@media (hover: hover)` avoids sticky hover on touch devices.

## Result

- Light mode: rows shift to `#f4f2ef` on hover (subtle grey on white surface)
- Dark mode: rows shift to `#1c1917` on hover (slightly darker than `#292524` surface)
- No component changes needed
