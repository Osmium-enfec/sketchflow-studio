import jsPDF from 'jspdf';
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { CanvasRenderer } from './canvasRenderer';
import { WhiteboardComponent } from '@/store/whiteboardStore';
import { buildTimeline } from '@/timeline/timelineEngine';

/**
 * Serialize SVG to a data URL image, then resolve with the rendered canvas.
 */
const svgToCanvas = (svgEl: SVGSVGElement, width: number, height: number): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width * 2;
      canvas.height = height * 2;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * Export current canvas state as a PDF file.
 */
export const exportPDF = async (svgEl: SVGSVGElement, canvasW: number, canvasH: number, fileName = 'whiteboard') => {
  const isPortrait = canvasH > canvasW;
  const orientation = isPortrait ? 'portrait' : 'landscape';
  const pdfWidth = isPortrait ? 210 : 297;
  const pdfHeight = isPortrait ? 297 : 210;
  const scale = Math.min(pdfWidth / canvasW, pdfHeight / canvasH);
  const imgW = canvasW * scale;
  const imgH = canvasH * scale;
  const offsetX = (pdfWidth - imgW) / 2;
  const offsetY = (pdfHeight - imgH) / 2;

  const canvas = await svgToCanvas(svgEl, canvasW, canvasH);
  const imgData = canvas.toDataURL('image/png', 1.0);
  const pdf = new jsPDF({ orientation, unit: 'mm', format: 'a4' });
  pdf.addImage(imgData, 'PNG', offsetX, offsetY, imgW, imgH);
  pdf.save(`${fileName}.pdf`);
};

/**
 * Export animation as MP4 using WebCodecs API + mp4-muxer.
 *
 * Pipeline:
 * 1. Build a paused GSAP timeline
 * 2. Step through frame-by-frame with timeline.seek()
 * 3. At each frame, render SVG + Lottie to an offscreen canvas
 * 4. Create VideoFrame from canvas → encode with VideoEncoder (H.264)
 * 5. Mux into MP4 container with mp4-muxer
 * 6. Download the result
 */
export const exportMP4 = async (
  svgEl: SVGSVGElement,
  canvasW: number,
  canvasH: number,
  components: WhiteboardComponent[],
  fileName = 'whiteboard-animation',
): Promise<void> => {
  const FPS = 30;
  const FRAME_DURATION_US = Math.round(1_000_000 / FPS); // microseconds per frame

  // Check WebCodecs support
  if (typeof VideoEncoder === 'undefined') {
    throw new Error('WebCodecs API is not supported in this browser. Please use Chrome 94+ or Edge 94+.');
  }

  console.log('[exportMP4] Starting export', { canvasW, canvasH, componentCount: components.length });

  // Ensure dimensions are even (H.264 requirement)
  const encoderW = canvasW % 2 === 0 ? canvasW : canvasW + 1;
  const encoderH = canvasH % 2 === 0 ? canvasH : canvasH + 1;

  // 1. Setup offscreen renderer + lottie instances
  const renderer = new CanvasRenderer(canvasW, canvasH);
  renderer.initLottieInstances(components);

  // 2. Replace DOM lottie controls with deterministic state trackers
  renderer.setupDeterministicControls(svgEl, components);

  // 3. Build paused GSAP timeline
  const timeline = buildTimeline(svgEl, components);
  const duration = timeline.duration();
  const totalFrames = Math.ceil(duration * FPS) + 1;
  console.log('[exportMP4] Timeline built', { duration, totalFrames });

  if (duration <= 0 || totalFrames <= 0) {
    renderer.destroy();
    timeline.kill();
    throw new Error('Timeline has no duration — nothing to export');
  }

  // 4. Setup mp4-muxer
  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: {
      codec: 'avc',
      width: encoderW,
      height: encoderH,
    },
    fastStart: 'in-memory',
  });

  // 5. Setup VideoEncoder
  // 5. Setup VideoEncoder — try multiple codec profiles
  const codecs = ['avc1.42001f', 'avc1.4d001f', 'avc1.640028'];
  let selectedCodec = '';

  for (const codec of codecs) {
    try {
      const support = await VideoEncoder.isConfigSupported({
        codec,
        width: encoderW,
        height: encoderH,
        bitrate: 5_000_000,
        framerate: FPS,
      });
      if (support.supported) {
        selectedCodec = codec;
        break;
      }
    } catch {
      continue;
    }
  }

  if (!selectedCodec) {
    renderer.destroy();
    timeline.kill();
    throw new Error('No supported H.264 codec found in this browser.');
  }

  console.log('[exportMP4] Using codec:', selectedCodec);

  let encodeError: Error | null = null;

  const encoder = new VideoEncoder({
    output: (chunk, meta) => {
      muxer.addVideoChunk(chunk, meta);
    },
    error: (e) => {
      console.error('[exportMP4] Encoder error:', e);
      encodeError = e;
    },
  });

  encoder.configure({
    codec: selectedCodec,
    width: encoderW,
    height: encoderH,
    bitrate: 5_000_000,
    framerate: FPS,
  });

  console.log('[exportMP4] Encoder configured, starting frame rendering...');

  // 6. Render each frame and encode
  for (let f = 0; f < totalFrames; f++) {
    if (encodeError || encoder.state === 'closed') {
      throw encodeError || new Error('Encoder was closed unexpectedly');
    }

    const t = Math.min(f / FPS, duration);
    renderer.setCurrentTime(t);
    timeline.seek(t);

    try {
      await renderer.renderFrame(svgEl);
    } catch (err) {
      console.error(`[exportMP4] Frame ${f} render failed:`, err);
      continue;
    }

    const canvas = renderer.getCanvas();
    const frame = new VideoFrame(canvas, {
      timestamp: f * FRAME_DURATION_US,
      duration: FRAME_DURATION_US,
    });

    encoder.encode(frame, { keyFrame: f % 30 === 0 });
    frame.close();

    // Periodically flush to avoid backpressure
    if (f % 10 === 0 && encoder.encodeQueueSize > 5) {
      await encoder.flush();
    }

    if (f % 30 === 0) console.log(`[exportMP4] Frame ${f}/${totalFrames}`);
  }

  console.log('[exportMP4] All frames rendered, flushing encoder...');

  // 7. Flush encoder and finalize muxer
  await encoder.flush();
  encoder.close();
  muxer.finalize();

  const buffer = (muxer.target as ArrayBufferTarget).buffer;
  console.log('[exportMP4] MP4 size:', buffer.byteLength);

  // 8. Download
  const blob = new Blob([buffer], { type: 'video/mp4' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.mp4`;
  a.click();
  URL.revokeObjectURL(url);

  // 9. Cleanup
  renderer.destroy();
  timeline.seek(0);
  timeline.kill();
};
