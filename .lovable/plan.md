

## Plan: SVG Path Tracing Handwriting Animation

### What We're Building
Replace the current stroke-dash text animation with true SVG path tracing using **opentype.js** to convert text into real vector paths, then animate those paths with GSAP's `strokeDashoffset` technique. This produces a realistic "someone is drawing each letter" effect.

### Why Current Approach Fails
SVG `<text>` elements have a single `strokeDashoffset` for the entire text block — letters don't draw sequentially; they fill in chunks simultaneously. Real handwriting needs individual letter paths traced in order.

### Implementation Steps

**1. Add opentype.js dependency**
- Install `opentype.js` to parse font files and extract glyph outlines as SVG paths.

**2. Create a font-to-path utility (`src/utils/textToPath.ts`)**
- Load the "Patrick Hand" `.ttf` font file (download and place in `/public/fonts/`)
- Function: `textToSVGPaths(text, x, y, fontSize)` → returns an array of `{ char, pathData, advanceWidth }` per character
- Cache the loaded font to avoid re-fetching

**3. Update `TitleComponent.tsx`**
- Replace `<text>` elements with `<path>` elements generated from opentype.js
- Each character becomes its own `<path>` with class `title-char-{index}`
- Keep a hidden `<text>` for bounding box measurement (for selection rect and editing)

**4. Update `BoxComponent.tsx`**
- Same path-based rendering for box text content
- Apply the same per-character path approach

**5. Update `timelineEngine.ts` — `animateTitle()`**
- Query all `.title-char-*` paths inside the component group
- For each path: measure `getTotalLength()`, set `strokeDasharray` and `strokeDashoffset`
- Stagger animation across characters (each starts slightly after the previous)
- After all strokes complete, fade in filled version and fade out stroke version
- Similar update for box text animation

**6. Download Patrick Hand font file**
- Place `PatrickHand-Regular.ttf` in `public/fonts/`
- opentype.js needs the raw font file, not a CSS @font-face reference

### Technical Details
- **opentype.js** `Font.getPath(text, x, y, fontSize)` returns a single combined path; we'll use `Font.charToGlyph()` + `glyph.getPath()` per character for individual letter control
- Each letter path gets animated with staggered timing (~0.15s per character)
- After stroke animation completes, a filled version fades in for crisp final appearance

