

# Fix Lottie Character Animation in Video Export

## Root Cause Analysis

The Lottie characters appear as static images in the export because of **three compounding issues**:

1. **`opacity: 0` on the container** prevents the browser from painting to the internal canvas. `lottie-web`'s canvas renderer skips draw calls when the container is invisible.

2. **Double `requestAnimationFrame` wait is unreliable** — in a tight frame-rendering loop (90 frames back-to-back), rAF may not fire correctly, and during background tab execution it stops entirely. For canvas renderer mode, `goToAndStop()` is synchronous — no rAF needed.

3. **Internal canvas not grabbed early enough** — `lottie-web` creates its own `<canvas>` inside the container on `loadAnimation()`. We should grab that reference once after init, not hunt for it each frame.

## Solution

Minimal targeted fixes in `src/lib/canvasRenderer.ts`:

### 1. Fix container visibility
Replace `opacity:0` with `visibility:hidden` — this keeps the element in the render tree (so canvas painting works) but hides it visually.

### 2. Grab lottie's internal canvas once during init
After `lottie.loadAnimation()`, wait for the `DOMLoaded` event, then grab the `<canvas>` element from the container and store it permanently.

### 3. Remove the double-rAF wait
`goToAndStop()` on canvas renderer is synchronous. Remove the `requestAnimationFrame` promise entirely — just call `goToAndStop` and immediately read the canvas.

### 4. Add a small initialization delay
Use a `setTimeout(resolve, 100)` after all lottie instances are created to ensure they're fully initialized before the export loop starts.

## Files Changed
- `src/lib/canvasRenderer.ts` — three targeted fixes (visibility, canvas ref, remove rAF)

