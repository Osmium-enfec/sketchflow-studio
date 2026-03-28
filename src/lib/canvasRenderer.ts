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
 */
export class CanvasRenderer {
  private offscreenCanvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lottieInstances: LottieInstance[] = [];
  // Cache the SVG image to avoid re-creating every frame when static content hasn't changed
  private cachedSvgImg: HTMLImageElement | null = null;
  private cachedSvgUrl: string | null = null;

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

      const container = document.createElement('div');
      container.style.width = w + 'px';
      container.style.height = h + 'px';
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.pointerEvents = 'none';
      container.style.opacity = '0';
      document.body.appendChild(container);

      const anim = lottie.loadAnimation({
        container,
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
      const self = this;

      controlEl.__lottiePlay = function () {
        origPlay?.();
        self.startLottie(comp.id);
      };
      controlEl.__lottieStop = function () {
        origStop?.();
        self.stopLottie(comp.id);
      };
      controlEl.__lottieGoTo = function (frame: number, isFrame: boolean) {
        origGoTo?.(frame, isFrame);
        self.goToLottie(comp.id, frame, isFrame);
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

  /**
   * Inline all computed styles into element attributes for SVG serialization.
   * This ensures styles survive when the SVG is rendered as a standalone image.
   */
  private inlineStyles(clone: SVGSVGElement) {
    const allElements = clone.querySelectorAll('*');
    const important = [
      'fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-dashoffset',
      'opacity', 'font-family', 'font-size', 'font-weight', 'text-anchor',
      'dominant-baseline', 'transform', 'visibility', 'display',
      'fill-opacity', 'stroke-opacity', 'stroke-linecap', 'stroke-linejoin',
    ];
    
    allElements.forEach(el => {
      const computed = window.getComputedStyle(el as Element);
      important.forEach(prop => {
        const val = computed.getPropertyValue(prop);
        if (val && val !== 'none' && val !== 'normal' && val !== '' && val !== 'auto') {
          (el as SVGElement).style.setProperty(prop, val);
        }
      });
    });
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
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

      // Inline computed styles so they survive serialization
      // We need the clone temporarily in the DOM to compute styles
      clone.style.position = 'fixed';
      clone.style.left = '-99999px';
      clone.style.top = '-99999px';
      document.body.appendChild(clone);
      this.inlineStyles(clone);
      document.body.removeChild(clone);

      const svgData = new XMLSerializer().serializeToString(clone);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0, this.width, this.height);
        URL.revokeObjectURL(url);
        resolve();
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(); // skip on error
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
      const opacity = (fo as SVGForeignObjectElement).style?.opacity;
      if (opacity === '0') continue;

      // Handle flip
      const flipped = gEl.getAttribute('data-walk-flipped') === '1';
      const facesRight = gEl.getAttribute('data-walk-faces-right') === '1';
      const needsFlip = facesRight ? flipped : !flipped;

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
      try {
        // Clean up hidden container
        const container = (inst.anim as any).wrapper;
        if (container?.parentNode) container.parentNode.removeChild(container);
        inst.anim.destroy();
      } catch (_) { /* ignore */ }
    }
    this.lottieInstances = [];
  }

  destroy() {
    this.destroyLottieInstances();
    if (this.cachedSvgUrl) {
      URL.revokeObjectURL(this.cachedSvgUrl);
      this.cachedSvgUrl = null;
    }
  }
}
