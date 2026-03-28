

# Replace html2canvas Video Export with Canvas API + Lottie Renderer

## Problem
`html2canvas` is fundamentally unsuitable for frame-by-frame video capture — it's slow (~200ms per frame), captures the viewport with CSS transforms/zoom artifacts, and produces misaligned output with empty margins.

## New Approach: Offscreen Canvas Rendering

Instead of screenshotting the DOM, we **render each frame programmatically** onto an offscreen `<canvas>` by reading the scene graph from the whiteboard store and drawing each component directly.

```text
Store (components[]) → for each frame:
  1. Clear offscreen canvas (1920×1080)
  2. Draw static SVG elements (boxes, arrows, text) via SVG→Image→drawImage
  3. Draw Lottie characters by advancing their frame and rendering to canvas
  4. Feed frame to MediaRecorder (captureStream)
→ Download .webm
```

## How It Works

### Phase 1: SVG-only elements (boxes, arrows, titles, highlights, etc.)
- Clone the SVG element, strip all `foreignObject` nodes (Lottie containers)
- Set explicit `width`/`height`/`viewBox` on the clone to match canvas dimensions (e.g. 1920×1080)
- Serialize to blob → load as `Image` → `drawImage` onto offscreen canvas
- This captures all non-animated content perfectly with no layout issues

### Phase 2: Lottie characters rendered via `lottie-web` renderer
- For each `walkingCharacter` component, create a standalone `lottie-web` animation instance (not tied to DOM)
- Use `lottie.loadAnimation({ renderer: 'canvas' })` to render each character's current frame directly onto the offscreen canvas at the correct position
- Advance frames manually with `goToAndStop(frameNum)` synced to the timeline

### Phase 3: Frame capture loop
- Use `requestAnimationFrame` at 30fps
- For each frame: draw SVG snapshot + overlay Lottie canvas renders
- `MediaRecorder` on `captureStream(30)` encodes to WebM
- No html2canvas dependency needed at all

## Files to Change

### New: `src/lib/canvasRenderer.ts`
- `renderSceneFrame(components, svgEl, canvas, frameIndex, fps)` — the core per-frame render function
- Clones SVG, removes foreignObjects, serializes, draws to canvas
- Manages offscreen lottie-web canvas renderers for each walking character
- Handles position/scale/flip for each character

### Edit: `src/lib/canvasExport.ts`
- Remove `html2canvas` import and all html2canvas usage
- Rewrite `exportMP4` to use the new `renderSceneFrame` approach
- Keep `MediaRecorder` + `captureStream` for encoding (this part works fine)
- Keep `exportPDF` as-is (static snapshot is fine with SVG serialization)

### Edit: `package.json`
- Remove `html2canvas` dependency (no longer needed)

## Technical Details

- **SVG rendering**: `XMLSerializer` + `Blob` + `Image.onload` + `ctx.drawImage` — same proven approach already used in `svgToCanvas` for PDF export
- **Lottie canvas rendering**: `lottie-web` supports `renderer: 'canvas'` mode which draws directly to a canvas context — no DOM needed
- **Positioning**: Each component's `x, y, width, height` from the store maps directly to `drawImage` coordinates on the offscreen canvas
- **Timeline sync**: The animation timeline (GSAP) still runs normally; we just sample the visual state each frame
- **No CORS/viewport issues**: Everything is rendered programmatically from data, not screenshotted from the DOM

