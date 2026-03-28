import jsPDF from 'jspdf';

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
  
  // Use the actual canvas aspect ratio
  const pdfWidth = isPortrait ? 210 : 297; // A4 mm
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
 * Record the canvas animation as MP4 using MediaRecorder.
 * Captures frames by repeatedly drawing the SVG onto a canvas.
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

    const stream = recCanvas.captureStream(30); // 30 fps
    
    // Check for supported mime types
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/webm;codecs=vp8')
        ? 'video/webm;codecs=vp8'
        : 'video/webm';
    
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 8_000_000, // 8 Mbps for high quality
    });
    
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    
    recorder.onstop = () => {
      cancelAnimationFrame(frameId);
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
    
    // Start recording
    recorder.start();
    
    // Trigger the animation
    onStart();
    
    // Capture frames
    let frameId: number;
    const captureFrame = () => {
      const svgData = new XMLSerializer().serializeToString(svgEl);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvasW, canvasH);
        ctx.drawImage(img, 0, 0, canvasW, canvasH);
        URL.revokeObjectURL(url);
      };
      img.src = url;
      frameId = requestAnimationFrame(captureFrame);
    };
    
    frameId = requestAnimationFrame(captureFrame);
    
    // Listen for animation end — stop after a timeout based on component count
    // The animation engine dispatches 'whiteboard-animation-end' when done
    const onEnd = () => {
      // Give a small buffer for the last frames
      setTimeout(() => {
        recorder.stop();
        window.removeEventListener('whiteboard-animation-end', onEnd);
      }, 500);
    };
    
    window.addEventListener('whiteboard-animation-end', onEnd);
    
    // Safety timeout: stop after 60 seconds max
    setTimeout(() => {
      if (recorder.state === 'recording') {
        recorder.stop();
        window.removeEventListener('whiteboard-animation-end', onEnd);
      }
    }, 60_000);
  });
};
