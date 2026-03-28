

# Rewrite Video Export with WebCodecs API + mp4-muxer

## Problem Summary
The current export pipeline has multiple compounding failures:
1. **MediaRecorder** produces 0-second or black-screen WebM files because it wasn't designed for programmatic frame-by-frame capture
2. **FFmpeg.wasm** hangs during initialization (25MB WASM download + environment restrictions)
3. The SVG serialization loses styles, and Lottie canvas rendering isn't compositing correctly
4. The animation itself broke — characters show a single pose instead of animating

## New Approach: WebCodecs API + mp4-muxer

**WebCodecs** is a browser-native API that gives direct access to hardware-accelerated H.264 encoding — no WASM, no MediaRecorder timing hacks. Combined with the **mp4-muxer** npm package, it produces real `.mp4` files at 10x faster than realtime.

This is what tools like Canva use — they leverage WebCodecs (or server-side rendering for complex cases) for video export.

```text
Canvas Frame → VideoFrame → VideoEncoder (H.264) → mp4-muxer → .mp4 blob → download
```

## Plan

### Step 1: Remove broken export infrastructure
- Delete `src/lib/ffmpegEncoder.ts` (FFmpeg.wasm — doesn't work)
- Remove `@ffmpeg/ffmpeg` and `@ffmpeg/util` from package.json
- Strip the broken `exportMP4` from `canvasExport.ts`

### Step 2: Install mp4-muxer
- Add `mp4-muxer` package (lightweight, ~50KB, no WASM)

### Step 3: Rewrite `canvasExport.ts` with WebCodecs pipeline
- Use `VideoEncoder` with codec `avc1.42001f` (H.264 Baseline — universal compatibility)
- For each frame: `timeline.seek(t)` → render SVG + Lottie to offscreen canvas → create `VideoFrame` → `encoder.encode()` → `mp4-muxer.addVideoChunk()`
- Finalize muxer → download as `.mp4`
- No real-time delays needed — frames encode as fast as the CPU/GPU can handle

### Step 4: Fix the SVG + Lottie rendering in `canvasRenderer.ts`
- **SVG**: Inline all computed styles before serialization (fill, stroke, font, opacity, transform) so nothing is lost
- **Lottie**: Ensure `lottie-web` canvas renderer containers are properly DOM-attached and sized
- **Compositing**: Draw SVG base layer first, then overlay each Lottie character at its current position/flip state
- **Background**: Draw canvas background color as first layer (fixes black screen)

### Step 5: Fix animation playback regression
- Verify `animateWalkingCharacter` in `timelineEngine.ts` still correctly calls `__lottiePlay`/`__lottieStop`
- Ensure `setupDeterministicControls` replaces DOM controls BEFORE `buildTimeline` is called
- The Lottie frame calculation (`elapsed * frameRate % totalFrames`) needs to correctly sync with the timeline seek position

### Step 6: Keep PDF/JPG export working
- PDF export via jsPDF stays as-is (already works)
- Add JPG/PNG still export option using the same canvas renderer

## Technical Details

**WebCodecs encoding (core logic):**
```typescript
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';

const muxer = new Muxer({
  target: new ArrayBufferTarget(),
  video: { codec: 'avc', width: 1920, height: 1080 },
  fastStart: 'in-memory',
});

const encoder = new VideoEncoder({
  output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
  error: (e) => console.error(e),
});

encoder.configure({
  codec: 'avc1.42001f',
  width: 1920, height: 1080,
  bitrate: 5_000_000,
  framerate: 30,
});

// For each frame:
const frame = new VideoFrame(canvas, {
  timestamp: frameNumber * (1_000_000 / 30), // microseconds
});
encoder.encode(frame, { keyFrame: frameNumber % 30 === 0 });
frame.close();

await encoder.flush();
muxer.finalize();
// Download muxer.target.buffer as .mp4
```

**Browser support**: WebCodecs is supported in Chrome 94+, Edge 94+, Opera 80+. Safari 16.4+ has partial support. For unsupported browsers, we show a clear error message.

**Performance**: No real-time waiting. A 3-second animation at 30fps = 90 frames, encodes in ~1-3 seconds total.

## Files Changed
1. **Delete** `src/lib/ffmpegEncoder.ts`
2. **Rewrite** `src/lib/canvasExport.ts` — WebCodecs + mp4-muxer pipeline
3. **Fix** `src/lib/canvasRenderer.ts` — proper SVG style inlining, background drawing, Lottie compositing
4. **Verify** `src/timeline/timelineEngine.ts` — ensure animation logic is intact
5. **Update** `package.json` — remove ffmpeg packages, add mp4-muxer

