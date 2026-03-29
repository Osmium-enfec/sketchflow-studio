import lottie, { AnimationItem } from 'lottie-web';
import { WhiteboardComponent } from '@/store/whiteboardStore';
import { getVariantData } from '@/lib/characterLottieVariants';

interface LottieInstance {
  componentId: string;
  anim: AnimationItem;
  canvas: HTMLCanvasElement;
  container: HTMLDivElement;
}

interface LottiePlayState {
  playing: boolean;
  startTime: number;
}

/**
 * Styles to inline when serializing SVG for offscreen rendering.
 * This prevents losing CSS-applied styles during serialization.
 */
const INLINE_STYLE_PROPS = [
  'fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-dashoffset',
  'opacity', 'fill-opacity', 'stroke-opacity', 'font-family', 'font-size',
  'font-weight', 'font-style', 'text-anchor', 'dominant-baseline',
  'transform', 'visibility', 'display',
];

/**
 * Deterministic offscreen canvas renderer for video export.
 * Draws each frame programmatically: SVG serialization for static content
 * + lottie-web canvas renderer for character animations.
 */
export class CanvasRenderer {
  private offscreenCanvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lottieInstances: LottieInstance[] = [];
  private lottiePlayStates: Map<string, LottiePlayState> = new Map();
  private _currentTime = 0;

  constructor(private width: number, private height: number) {
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = width;
    this.offscreenCanvas.height = height;
    this.ctx = this.offscreenCanvas.getContext('2d')!;
  }

  getCanvas(): HTMLCanvasElement {
    return this.offscreenCanvas;
  }

  setCurrentTime(t: number) {
    this._currentTime = t;
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

      // lottie-web canvas renderer needs a DOM-attached container
      const container = document.createElement('div');
      container.style.cssText = 'position:fixed;left:-99999px;top:-99999px;pointer-events:none;opacity:0;';
      container.style.width = w + 'px';
      container.style.height = h + 'px';
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

      this.lottieInstances.push({ componentId: comp.id, anim, canvas, container });
      this.lottiePlayStates.set(comp.id, { playing: false, startTime: 0 });
    }
  }

  /**
   * Replace DOM lottie controls with deterministic state trackers.
   * Must be called BEFORE building the GSAP timeline so the timeline's
   * call() callbacks use our tracking functions instead of real playback.
   */
  setupDeterministicControls(svgEl: SVGSVGElement, components: WhiteboardComponent[]) {
    const walkingComponents = components.filter(c => c.type === 'walkingCharacter');
    const self = this;

    for (const comp of walkingComponents) {
      const gEl = svgEl.querySelector(`[data-component-id="${comp.id}"]`);
      if (!gEl) continue;
      const controlEl = gEl.querySelector('[data-lottie-control]') as any;
      if (!controlEl) continue;

      controlEl.__lottiePlay = () => {
        self.lottiePlayStates.set(comp.id, { playing: true, startTime: self._currentTime });
      };
      controlEl.__lottieStop = () => {
        const state = self.lottiePlayStates.get(comp.id);
        if (state) state.playing = false;
      };
      controlEl.__lottieGoTo = (_frame: number, _isFrame: boolean) => {
        self.lottiePlayStates.set(comp.id, { playing: false, startTime: 0 });
        const inst = self.lottieInstances.find(i => i.componentId === comp.id);
        if (inst) inst.anim.goToAndStop(0, true);
      };
    }
  }

  /**
   * Update all offscreen Lottie instances to the correct frame for the current time.
   */
  private updateLottieFrames() {
    for (const inst of this.lottieInstances) {
      const state = this.lottiePlayStates.get(inst.componentId);
      if (!state || !state.playing) {
        inst.anim.goToAndStop(0, true);
        continue;
      }
      const elapsed = this._currentTime - state.startTime;
      if (elapsed < 0) {
        inst.anim.goToAndStop(0, true);
        continue;
      }
      const frameRate = inst.anim.frameRate || 30;
      const totalFrames = inst.anim.totalFrames || 60;
      const lottieFrame = Math.floor((elapsed * frameRate) % totalFrames);
      inst.anim.goToAndStop(lottieFrame, true);
    }
  }

  /**
   * Render a single frame: background + SVG static content + Lottie character overlays.
   */
  async renderFrame(svgEl: SVGSVGElement): Promise<void> {
    // Draw white background first (prevents black screen)
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.width, this.height);

    await this.drawSvgContent(svgEl);
    this.updateLottieFrames();
    this.drawLottieCharacters(svgEl);
  }

  /**
   * Inline computed styles directly by matching data-component-id and element tags.
   * This avoids index mismatch issues when foreignObjects are removed.
   */
  private inlineStyles(clone: SVGSVGElement, original: SVGSVGElement) {
    // Walk every element in original that has an inline or computed style we care about
    const origAll = original.querySelectorAll('*');
    
    for (const origEl of Array.from(origAll)) {
      // Skip foreignObject and its children — we remove those
      if (origEl.tagName === 'foreignObject' || origEl.closest('foreignObject')) continue;
      
      try {
        const computed = window.getComputedStyle(origEl);
        
        // Build a unique path to find the same element in the clone
        const componentGroup = origEl.closest('[data-component-id]');
        if (!componentGroup) continue;
        
        const compId = componentGroup.getAttribute('data-component-id');
        const cloneGroup = clone.querySelector(`[data-component-id="${compId}"]`);
        if (!cloneGroup) continue;
        
        // Find matching element within the group by class or tag position
        let cloneEl: Element | null = null;
        const className = origEl.getAttribute('class');
        if (className) {
          // Try matching by first class name for specificity
          const firstClass = className.split(' ')[0];
          cloneEl = cloneGroup.querySelector(`.${CSS.escape(firstClass)}`);
        }
        
        if (!cloneEl) {
          // Fallback: match by tag name + index within parent
          const parent = origEl.parentElement;
          if (parent) {
            const siblings = Array.from(parent.children);
            const idx = siblings.indexOf(origEl as HTMLElement);
            const cloneParentCompId = parent.closest('[data-component-id]')?.getAttribute('data-component-id');
            if (cloneParentCompId === compId && parent.tagName) {
              // Find equivalent parent in clone
              const origPathFromGroup = [];
              let cur: Element | null = origEl;
              while (cur && cur !== componentGroup) {
                const p = cur.parentElement;
                if (p) {
                  const childIdx = Array.from(p.children).indexOf(cur as HTMLElement);
                  origPathFromGroup.unshift(childIdx);
                }
                cur = p;
              }
              
              // Navigate same path in clone
              let cloneCur: Element | null = cloneGroup;
              for (const childIdx of origPathFromGroup) {
                if (cloneCur && cloneCur.children[childIdx]) {
                  cloneCur = cloneCur.children[childIdx];
                } else {
                  cloneCur = null;
                  break;
                }
              }
              cloneEl = cloneCur;
            }
          }
        }
        
        if (!cloneEl) continue;
        
        const svgCloneEl = cloneEl as SVGElement;
        for (const prop of INLINE_STYLE_PROPS) {
          const val = computed.getPropertyValue(prop);
          if (val && val !== 'none' && val !== 'normal' && val !== '' && val !== 'auto') {
            svgCloneEl.style.setProperty(prop, val);
          }
        }
      } catch {
        // Skip elements that can't be styled
      }
    }
  }

  private drawSvgContent(svgEl: SVGSVGElement): Promise<void> {
    return new Promise((resolve) => {
      const clone = svgEl.cloneNode(true) as SVGSVGElement;
      
      // Inline styles BEFORE removing foreignObjects to maintain element structure
      this.inlineStyles(clone, svgEl);
      
      // Now remove foreignObject elements (Lottie containers) - we draw those separately
      clone.querySelectorAll('foreignObject').forEach(fo => fo.remove());

      clone.setAttribute('width', String(this.width));
      clone.setAttribute('height', String(this.height));
      if (!clone.getAttribute('viewBox')) {
        clone.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
      }
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

      const svgData = new XMLSerializer().serializeToString(clone);
      const url = URL.createObjectURL(
        new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      );

      const img = new Image();
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0, this.width, this.height);
        URL.revokeObjectURL(url);
        resolve();
      };
      img.onerror = (err) => {
        console.error('[CanvasRenderer] SVG image load failed:', err);
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

      const x = parseFloat(fo.getAttribute('x') || '0');
      const y = parseFloat(fo.getAttribute('y') || '0');
      const w = parseFloat(fo.getAttribute('width') || '250');
      const h = parseFloat(fo.getAttribute('height') || '250');

      // Skip hidden elements
      const opacity = (fo as SVGForeignObjectElement).style?.opacity;
      if (opacity === '0') continue;

      // Handle character flip
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
        inst.anim.destroy();
        if (inst.container.parentNode) inst.container.parentNode.removeChild(inst.container);
      } catch (_) { /* ignore */ }
    }
    this.lottieInstances = [];
    this.lottiePlayStates.clear();
  }

  destroy() {
    this.destroyLottieInstances();
  }
}
