import jsPDF from 'jspdf';
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
 * Wait for a specific duration using requestAnimationFrame for accuracy.
 */
const waitFrame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

/**
 * Export animation as WebM video using deterministic frame-by-frame rendering + MediaRecorder.
 *
 * 1. Build a paused GSAP timeline
 * 2. Step through it frame-by-frame with timeline.seek()
 * 3. At each frame, render SVG + Lottie to an offscreen canvas
 * 4. Use canvas.captureStream() + MediaRecorder to encode WebM
 * 5. Download the result
 */
export const exportMP4 = async (
  svgEl: SVGSVGElement,
  canvasW: number,
  canvasH: number,
  components: WhiteboardComponent[],
  fileName = 'whiteboard-animation',
): Promise<void> => {
  const FPS = 30;

  console.log('[exportMP4] Starting export', { canvasW, canvasH, componentCount: components.length });

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

  // 4. Setup MediaRecorder on the offscreen canvas stream
  const canvas = renderer.getCanvas();
  const stream = canvas.captureStream(0); // 0 = manual frame capture
  
  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
    ? 'video/webm;codecs=vp9'
    : 'video/webm;codecs=vp8';
  
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 8_000_000,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  recorder.start();
  console.log('[exportMP4] MediaRecorder started with', mimeType);

  // 5. Render each frame deterministically
  for (let f = 0; f < totalFrames; f++) {
    const t = Math.min(f / FPS, duration);
    renderer.setCurrentTime(t);
    timeline.seek(t);

    try {
      await renderer.renderFrame(svgEl);
    } catch (err) {
      console.error(`[exportMP4] Frame ${f} render failed:`, err);
      continue;
    }

    // Request a frame capture from the stream
    const track = stream.getVideoTracks()[0] as any;
    if (track?.requestFrame) {
      track.requestFrame();
    }

    // Small delay to let MediaRecorder process the frame
    await waitFrame();

    if (f % 30 === 0) console.log(`[exportMP4] Frame ${f}/${totalFrames}`);
  }

  console.log('[exportMP4] All frames rendered, stopping recorder...');

  // 6. Stop and download
  const blob = await new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: 'video/webm' }));
    };
    recorder.stop();
  });

  console.log('[exportMP4] Video blob size:', blob.size);

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.webm`;
  a.click();
  URL.revokeObjectURL(url);

  // 7. Cleanup
  renderer.destroy();
  timeline.seek(0);
  timeline.kill();
};
