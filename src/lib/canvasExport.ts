import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
 * Record the canvas animation as WebM using MediaRecorder.
 * Uses html2canvas to capture the actual rendered DOM (including foreignObject / Lottie).
 */
export const exportMP4 = (
  svgEl: SVGSVGElement,
  canvasW: number,
  canvasH: number,
  onStart: () => void,
  fileName = 'whiteboard-animation'
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const recCanvas = document.createElement('canvas');
    recCanvas.width = canvasW;
    recCanvas.height = canvasH;
    const ctx = recCanvas.getContext('2d')!;

    const stream = recCanvas.captureStream(30);
    
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/webm;codecs=vp8')
        ? 'video/webm;codecs=vp8'
        : 'video/webm';
    
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 8_000_000,
    });
    
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    
    recorder.onstop = () => {
      capturing = false;
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      resolve();
    };

    recorder.onerror = (e) => reject(e);
    
    // Find the parent container that holds the SVG (the actual rendered DOM element)
    const svgContainer = svgEl.closest('.whiteboard-canvas-container') || svgEl.parentElement;
    
    recorder.start();
    onStart();
    
    let capturing = true;
    let lastCaptureTime = 0;
    const CAPTURE_INTERVAL = 66; // ~15fps to avoid lag

    const captureFrame = async (timestamp: number) => {
      if (!capturing) return;
      
      // Throttle: only capture every ~66ms (15fps)
      if (timestamp - lastCaptureTime < CAPTURE_INTERVAL) {
        requestAnimationFrame(captureFrame);
        return;
      }
      lastCaptureTime = timestamp;

      try {
        const captureTarget = svgContainer || svgEl;
        const snapshot = await html2canvas(captureTarget as HTMLElement, {
          width: canvasW,
          height: canvasH,
          scale: 1,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          foreignObjectRendering: true,
          imageTimeout: 0,
          removeContainer: true,
        });
        ctx.clearRect(0, 0, canvasW, canvasH);
        ctx.drawImage(snapshot, 0, 0, canvasW, canvasH);
      } catch (_) {
        // Skip frame on error
      }
      if (capturing) {
        requestAnimationFrame(captureFrame);
      }
    };
    
    requestAnimationFrame(captureFrame);
    
    const onEnd = () => {
      setTimeout(() => {
        capturing = false;
        if (recorder.state === 'recording') recorder.stop();
        window.removeEventListener('whiteboard-animation-end', onEnd);
      }, 500);
    };
    
    window.addEventListener('whiteboard-animation-end', onEnd);
    
    setTimeout(() => {
      if (recorder.state === 'recording') {
        capturing = false;
        recorder.stop();
        window.removeEventListener('whiteboard-animation-end', onEnd);
      }
    }, 60_000);
  });
};
