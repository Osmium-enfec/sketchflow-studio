

# Video Export: WebCodecs API + mp4-muxer

## Architecture
Canvas Frame → VideoFrame → VideoEncoder (H.264) → mp4-muxer → .mp4 blob → download

## Implementation
- **canvasExport.ts**: WebCodecs `VideoEncoder` with `avc1.42001f` codec, 30fps, 5Mbps bitrate
- **canvasRenderer.ts**: Offscreen canvas renderer with SVG style inlining + Lottie canvas compositing
- **mp4-muxer**: Lightweight MP4 container muxer (no WASM)
- **PDF export**: jsPDF with SVG→canvas serialization (unchanged)

## Key Details
- H.264 requires even dimensions — auto-padded if needed
- Computed CSS styles are inlined into SVG clone before serialization
- White background drawn first to prevent black screen
- Lottie frames calculated deterministically from timeline position
- No real-time delays — encodes as fast as CPU/GPU can handle
