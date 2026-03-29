

# Server-Side Video Rendering via Backend Function

## The Core Problem
`lottie-web`'s canvas renderer refuses to paint when its container is hidden or off-screen in the browser. Every client-side workaround (opacity, visibility, positioning) has failed because browsers aggressively optimize away paint operations for non-visible elements. This is a fundamental browser limitation that cannot be reliably worked around.

## Proposed Solution
Use a **backend function** (Edge Function) that receives the whiteboard scene data (components JSON + Lottie JSON assets), renders each frame server-side using **headless Puppeteer/Chromium**, and returns an MP4 file.

```text
Client                          Backend Function
  │                                    │
  ├─── POST scene JSON ───────────────►│
  │    (components, canvas size)       │
  │                                    ├── Spin up headless Chromium
  │                                    ├── Load minimal HTML with SVG + Lottie
  │                                    ├── Step GSAP timeline frame-by-frame
  │                                    ├── Screenshot each frame → encode MP4
  │◄── Return MP4 blob ───────────────┤
  │                                    │
  └── Download file                    │
```

## Pros and Cons

### Pros
- **Guaranteed rendering** — headless Chromium has a real compositor; Lottie canvas painting works correctly even in headless mode
- **No browser compatibility issues** — works for all users regardless of their browser (no WebCodecs dependency)
- **Consistent output** — same rendering environment every time, no variance across devices
- **User's browser stays responsive** — no heavy encoding work blocking the UI thread

### Cons
- **Slow** — headless Chromium startup + frame-by-frame screenshots is significantly slower (expect 30-90 seconds for a 3-second animation)
- **Edge Function limits** — Supabase Edge Functions have a ~150-second timeout and limited memory; long/complex animations may hit these limits
- **Large payload** — Lottie JSON files must be sent to the server (can be 100KB-1MB+ each); the MP4 must be sent back
- **Infrastructure complexity** — Puppeteer/Chromium binary (~300MB) cannot run in Deno Edge Functions directly. Would need an **external rendering service** (e.g., Browserless, or a custom Docker container) that the Edge Function calls
- **Cost** — every export consumes server resources; if using a third-party headless browser service, there's a per-use cost

## Alternative: Hybrid Client-Side Fix (Recommended First)

Before going server-side, there's one approach we haven't tried: **rendering Lottie directly from JSON data to canvas using manual frame extraction** — bypassing `lottie-web` entirely for export.

The `lottie-web` library's `renderer: 'canvas'` mode internally calls `canvasContext.drawImage()`. Instead of fighting browser paint optimization, we can:
1. Use `lottie-web` in **SVG renderer mode** (which doesn't need canvas painting)
2. Serialize each SVG frame and rasterize it to canvas (same as we do for static content)

This keeps everything client-side, avoids the hidden-canvas problem entirely, and needs no backend.

## Decision Point

| Approach | Reliability | Speed | Complexity | Cost |
|----------|------------|-------|------------|------|
| SVG renderer (client) | High | Fast (~3s) | Low | Free |
| Server-side Puppeteer | Very High | Slow (~60s) | High | $$$ |

## Recommended Plan: Try SVG Renderer First

### Step 1: Switch Lottie export instances to SVG renderer
In `canvasRenderer.ts`, change `renderer: 'canvas'` to `renderer: 'svg'` for export-only instances.

### Step 2: Render Lottie SVG frames to canvas
After `goToAndStop()`, grab the SVG element from the Lottie container, serialize it with `XMLSerializer`, and rasterize it to the export canvas via `Image.decode()` — the same proven pipeline we already use for static SVG content.

### Step 3: Remove hidden-canvas workarounds
No more `visibility:hidden` containers, no `requestAnimationFrame` waits, no canvas reference caching. The SVG renderer produces DOM elements that serialize reliably regardless of visibility.

### Files Changed
- `src/lib/canvasRenderer.ts` — switch to SVG renderer for export, serialize SVG frames

If SVG renderer also fails (unlikely but possible), we proceed with the server-side approach using an external headless browser service called from a backend function.

