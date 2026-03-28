import jsPDF from 'jspdf';
import { CanvasRenderer } from './canvasRenderer';
import { WhiteboardComponent } from '@/store/whiteboardStore';
import { buildTimeline } from '@/timeline/timelineEngine';
import { loadFFmpeg } from './ffmpegEncoder';

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
      canvas.width = width * 2; // 2x for high quality
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
 * Export animation as H.264 MP4 using deterministic frame-by-frame rendering + FFmpeg.wasm.
 * 
 * How it works (Canva-style approach):
 * 1. Build a paused GSAP timeline
 * 2. Step through it frame-by-frame with timeline.seek()
 * 3. At each frame, render SVG + Lottie to an offscreen canvas
 * 4. Collect frames as JPEG images
 * 5. Encode into H.264 MP4 with FFmpeg.wasm
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

  // 1. Setup offscreen renderer + lottie instances
  const renderer = new CanvasRenderer(canvasW, canvasH);
  renderer.initLottieInstances(components);

  // 2. Replace DOM lottie controls with deterministic state trackers
  //    (must happen BEFORE building the timeline)
  renderer.setupDeterministicControls(svgEl, components);

  // 3. Build paused GSAP timeline
  const timeline = buildTimeline(svgEl, components);
  const duration = timeline.duration();
  const totalFrames = Math.ceil(duration * FPS) + 1;

  // 4. Load FFmpeg.wasm (cached after first load)
  const ffmpeg = await loadFFmpeg();

  // 5. Render each frame deterministically
  for (let f = 0; f < totalFrames; f++) {
    const t = Math.min(f / FPS, duration);
    renderer.setCurrentTime(t);
    timeline.seek(t);

    await renderer.renderFrame(svgEl);

    // Convert canvas to JPEG and write to FFmpeg virtual FS
    const blob = await new Promise<Blob>((resolve) => {
      renderer.getCanvas().toBlob((b) => resolve(b!), 'image/jpeg', 0.92);
    });
    const data = new Uint8Array(await blob.arrayBuffer());
    await ffmpeg.writeFile(`f${String(f).padStart(5, '0')}.jpg`, data);
  }

  // 6. Encode frames into H.264 MP4
  await ffmpeg.exec([
    '-framerate', String(FPS),
    '-i', 'f%05d.jpg',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'ultrafast',
    '-crf', '23',
    'output.mp4',
  ]);

  // 7. Download the MP4
  const output = await ffmpeg.readFile('output.mp4');
  const outputData = output as Uint8Array;
  const mp4Blob = new Blob([new Uint8Array(outputData)], { type: 'video/mp4' });
  const url = URL.createObjectURL(mp4Blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.mp4`;
  a.click();
  URL.revokeObjectURL(url);

  // 8. Cleanup
  renderer.destroy();
  timeline.seek(0);
  timeline.kill();

  for (let f = 0; f < totalFrames; f++) {
    try { await ffmpeg.deleteFile(`f${String(f).padStart(5, '0')}.jpg`); } catch { /* ignore */ }
  }
  try { await ffmpeg.deleteFile('output.mp4'); } catch { /* ignore */ }
};
