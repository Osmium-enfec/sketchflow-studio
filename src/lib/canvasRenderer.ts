import lottie, { AnimationItem } from 'lottie-web';
import { WhiteboardComponent } from '@/store/whiteboardStore';
import { getVariantData } from '@/lib/characterLottieVariants';

interface LottieInstance {
  componentId: string;
  anim: AnimationItem;
  canvas: HTMLCanvasElement;
}

/**
 * Offscreen canvas renderer that programmatically draws the whiteboard scene
 * by serializing SVG content and overlaying Lottie character animations.
 * Replaces html2canvas for video export.
 */
export class CanvasRenderer {
  private offscreenCanvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lottieInstances: LottieInstance[] = [];

  constructor(private width: number, private height: number) {
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = width;
    this.offscreenCanvas.height = height;
    this.ctx = this.offscreenCanvas.getContext('2d')!;
  }

  getCanvas(): HTMLCanvasElement {
    return this.offscreenCanvas;
  }

  /**
   * Create offscreen lottie-web canvas renderers for each walkingCharacter.
   */
  initLottieInstances(components: WhiteboardComponent[]) {
    this.destroyLottieInstances();
    const walkingComponents = components.filter(c => c.type === 'walkingCharacter');

    for (const comp of walkingComponents) {
      const variant = getVariantData(comp.props.variant || 'femaleWalking');
      const w = comp.props.width || 250;
      const h = comp.props.height || 250;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;

      const anim = lottie.loadAnimation({
        container: canvas as any,
        renderer: 'canvas',
        rendererSettings: {
          context: canvas.getContext('2d')!,
          clearCanvas: true,
        },
        loop: true,
        autoplay: false,
        animationData: variant.data,
      });

      this.lottieInstances.push({ componentId: comp.id, anim, canvas });
    }
  }

  /**
   * Hook into DOM lottie controls so offscreen instances stay in sync.
   */
  hookDomControls(svgEl: SVGSVGElement, components: WhiteboardComponent[]) {
    const walkingComponents = components.filter(c => c.type === 'walkingCharacter');
    for (const comp of walkingComponents) {
      const gEl = svgEl.querySelector(`[data-component-id="${comp.id}"]`);
      if (!gEl) continue;
      const controlEl = gEl.querySelector('[data-lottie-control]') as any;
      if (!controlEl) continue;

      const origPlay = controlEl.__lottiePlay;
      const origStop = controlEl.__lottieStop;
      const origGoTo = controlEl.__lottieGoTo;
      const renderer = this;

      controlEl.__lottiePlay = function () {
        origPlay?.();
        renderer.startLottie(comp.id);
      };
      controlEl.__lottieStop = function () {
        origStop?.();
        renderer.stopLottie(comp.id);
      };
      controlEl.__lottieGoTo = function (frame: number, isFrame: boolean) {
        origGoTo?.(frame, isFrame);
        renderer.goToLottie(comp.id, frame, isFrame);
      };
    }
  }

  startLottie(componentId: string) {
    const inst = this.lottieInstances.find(i => i.componentId === componentId);
    if (inst) inst.anim.play();
  }

  stopLottie(componentId: string) {
    const inst = this.lottieInstances.find(i => i.componentId === componentId);
    if (inst) inst.anim.pause();
  }

  goToLottie(componentId: string, frame: number, isFrame: boolean) {
    const inst = this.lottieInstances.find(i => i.componentId === componentId);
    if (inst) inst.anim.goToAndStop(frame, isFrame);
  }

  /**
   * Render a single frame: draw SVG static content + overlay Lottie characters.
   */
  async renderFrame(svgEl: SVGSVGElement): Promise<void> {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Phase 1: Draw static SVG content (without foreignObjects)
    await this.drawSvgContent(svgEl);

    // Phase 2: Overlay Lottie character canvases at their current positions
    this.drawLottieCharacters(svgEl);
  }

  private drawSvgContent(svgEl: SVGSVGElement): Promise<void> {
    return new Promise((resolve) => {
      const clone = svgEl.cloneNode(true) as SVGSVGElement;

      // Remove all foreignObject elements (Lottie containers, markdown, etc.)
      clone.querySelectorAll('foreignObject').forEach(fo => fo.remove());

      // Set explicit dimensions and viewBox for correct rendering
      clone.setAttribute('width', String(this.width));
      clone.setAttribute('height', String(this.height));
      if (!clone.getAttribute('viewBox')) {
        clone.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
      }

      // Add xmlns if missing
      if (!clone.getAttribute('xmlns')) {
        clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      }

      const svgData = new XMLSerializer().serializeToString(clone);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });

      // Use createImageBitmap for faster off-thread decoding when available
      if (typeof createImageBitmap !== 'undefined') {
        createImageBitmap(blob)
          .then((bitmap) => {
            this.ctx.drawImage(bitmap, 0, 0, this.width, this.height);
            bitmap.close();
            resolve();
          })
          .catch(() => {
            // Fallback to Image approach
            this.drawSvgViaImage(blob).then(resolve);
          });
      } else {
        this.drawSvgViaImage(blob).then(resolve);
      }
    });
  }

  private drawSvgViaImage(blob: Blob): Promise<void> {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0, this.width, this.height);
        URL.revokeObjectURL(url);
        resolve();
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      img.src = url;
    });
  }

  private drawLottieCharacters(svgEl: SVGSVGElement) {
    for (const inst of this.lottieInstances) {
      const gEl = svgEl.querySelector(`[data-component-id="${inst.componentId}"]`);
      if (!gEl) continue;
      const fo = gEl.querySelector('foreignObject');
      if (!fo) continue;

      // Read current animated position from DOM (GSAP may have moved it)
      const x = parseFloat(fo.getAttribute('x') || '0');
      const y = parseFloat(fo.getAttribute('y') || '0');
      const w = parseFloat(fo.getAttribute('width') || '250');
      const h = parseFloat(fo.getAttribute('height') || '250');

      // Check opacity — skip if hidden
      const opacity = fo.style?.opacity;
      if (opacity === '0') continue;

      // Handle flip
      const flipped = gEl.getAttribute('data-walk-flipped') === '1';
      const facesRight = gEl.getAttribute('data-walk-faces-right') === '1';
      const needsFlip = facesRight ? flipped : !flipped;

      // Resize lottie canvas if dimensions changed
      if (inst.canvas.width !== w || inst.canvas.height !== h) {
        inst.canvas.width = w;
        inst.canvas.height = h;
        inst.anim.resize();
      }

      if (needsFlip) {
        this.ctx.save();
        this.ctx.translate(x + w, y);
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(inst.canvas, 0, 0, w, h);
        this.ctx.restore();
      } else {
        this.ctx.drawImage(inst.canvas, x, y, w, h);
      }
    }
  }

  destroyLottieInstances() {
    for (const inst of this.lottieInstances) {
      try { inst.anim.destroy(); } catch (_) { /* ignore */ }
    }
    this.lottieInstances = [];
  }

  destroy() {
    this.destroyLottieInstances();
  }
}
