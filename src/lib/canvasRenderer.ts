import lottie, { AnimationItem } from 'lottie-web';
import { WhiteboardComponent } from '@/store/whiteboardStore';
import { getVariantData } from '@/lib/characterLottieVariants';

interface LottieInstance {
  componentId: string;
  anim: AnimationItem;
  container: HTMLDivElement;
}

interface LottiePlayState {
  playing: boolean;
  startTime: number;
}

/**
 * Styles to inline when serializing SVG for offscreen rendering.
 */
const INLINE_STYLE_PROPS = [
  'fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-dashoffset',
  'opacity', 'fill-opacity', 'stroke-opacity', 'font-family', 'font-size',
  'font-weight', 'font-style', 'text-anchor', 'dominant-baseline',
  'transform', 'visibility', 'display',
];

/**
 * Deterministic offscreen canvas renderer for video export.
 * Uses lottie-web SVG renderer to avoid browser hidden-canvas paint optimization issues.
 * Each frame: serializes the main SVG + Lottie SVG frames → rasterizes to offscreen canvas.
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
   * Create offscreen lottie-web SVG renderers for each walkingCharacter.
   * SVG renderer mode produces DOM SVG elements that can be serialized
   * regardless of container visibility — no hidden-canvas paint issue.
   */
  async initLottieInstances(components: WhiteboardComponent[]) {
    this.destroyLottieInstances();
    const walkingComponents = components.filter(c => c.type === 'walkingCharacter');

    const initPromises: Promise<void>[] = [];

    for (const comp of walkingComponents) {
      const variant = getVariantData(comp.props.variant || 'femaleWalking');
      const w = comp.props.width || 250;
      const h = comp.props.height || 250;

      // Container can be completely off-screen — SVG renderer doesn't need painting
      const container = document.createElement('div');
      container.style.cssText = 'position:fixed;left:-99999px;top:-99999px;pointer-events:none;';
      container.style.width = w + 'px';
      container.style.height = h + 'px';
      document.body.appendChild(container);

      // KEY FIX: Use 'svg' renderer instead of 'canvas'
      // SVG renderer produces DOM elements that serialize reliably
      // regardless of visibility — no browser paint optimization issues
      const anim = lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        animationData: variant.data,
      });

      const instance: LottieInstance = { componentId: comp.id, anim, container };
      this.lottieInstances.push(instance);
      this.lottiePlayStates.set(comp.id, { playing: false, startTime: 0 });

      initPromises.push(new Promise<void>(resolve => {
        anim.addEventListener('DOMLoaded', () => {
          // Prime frame 0
          anim.goToAndStop(0, true);
          resolve();
        });
        // Fallback timeout
        setTimeout(() => resolve(), 1000);
      }));
    }

    await Promise.all(initPromises);
    // Extra buffer for SVG DOM readiness
    await new Promise(r => setTimeout(r, 200));
  }

  /**
   * Replace DOM lottie controls with deterministic state trackers.
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
        const existing = self.lottiePlayStates.get(comp.id);
        if (!existing || !existing.playing) {
          self.lottiePlayStates.set(comp.id, { playing: true, startTime: self._currentTime });
        }
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
   * Since we use SVG renderer, goToAndStop() updates the SVG DOM synchronously.
   */
  private updateLottieFrames(): void {
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
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.width, this.height);

    await this.drawSvgContent(svgEl);
    this.updateLottieFrames();
    await this.drawLottieCharacters(svgEl);
  }

  /**
   * Inline computed styles for SVG serialization.
   */
  private inlineStyles(clone: SVGSVGElement, original: SVGSVGElement) {
    const origAll = original.querySelectorAll('*');
    
    for (const origEl of Array.from(origAll)) {
      if (origEl.tagName === 'foreignObject' || origEl.closest('foreignObject')) continue;
      
      try {
        const computed = window.getComputedStyle(origEl);
        const componentGroup = origEl.closest('[data-component-id]');
        if (!componentGroup) continue;
        
        const compId = componentGroup.getAttribute('data-component-id');
        const cloneGroup = clone.querySelector(`[data-component-id="${compId}"]`);
        if (!cloneGroup) continue;
        
        let cloneEl: Element | null = null;
        const className = origEl.getAttribute('class');
        if (className) {
          const firstClass = className.split(' ')[0];
          cloneEl = cloneGroup.querySelector(`.${CSS.escape(firstClass)}`);
        }
        
        if (!cloneEl) {
          // Fallback: match by path from component group
          const origPathFromGroup: number[] = [];
          let cur: Element | null = origEl;
          while (cur && cur !== componentGroup) {
            const p = cur.parentElement;
            if (p) {
              const childIdx = Array.from(p.children).indexOf(cur as HTMLElement);
              origPathFromGroup.unshift(childIdx);
            }
            cur = p;
          }
          
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

  private async drawSvgContent(svgEl: SVGSVGElement): Promise<void> {
    const clone = svgEl.cloneNode(true) as SVGSVGElement;
    this.inlineStyles(clone, svgEl);
    clone.querySelectorAll('foreignObject').forEach(fo => fo.remove());

    clone.setAttribute('width', String(this.width));
    clone.setAttribute('height', String(this.height));
    clone.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);

    let xml = new XMLSerializer().serializeToString(clone);
    if (!xml.includes('xmlns=')) {
      xml = xml.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!xml.includes('xmlns:xlink')) {
      xml = xml.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
    const img = new Image();
    img.src = dataUrl;
    
    try {
      await img.decode();
      this.ctx.drawImage(img, 0, 0, this.width, this.height);
    } catch (err) {
      console.error('[CanvasRenderer] SVG decode/draw failed:', err);
    }
  }

  /**
   * Draw Lottie characters by serializing their SVG renderer output
   * and rasterizing each one onto the export canvas.
   * This bypasses the hidden-canvas paint problem entirely.
   */
  private async drawLottieCharacters(svgEl: SVGSVGElement): Promise<void> {
    for (const inst of this.lottieInstances) {
      const gEl = svgEl.querySelector(`[data-component-id="${inst.componentId}"]`);
      if (!gEl) continue;
      const fo = gEl.querySelector('foreignObject');
      if (!fo) continue;

      // Read current animated position from GSAP
      const x = parseFloat(fo.getAttribute('x') || '0');
      const y = parseFloat(fo.getAttribute('y') || '0');
      const w = parseFloat(fo.getAttribute('width') || '250');
      const h = parseFloat(fo.getAttribute('height') || '250');

      // Handle character flip
      const flipped = gEl.getAttribute('data-walk-flipped') === '1';
      const facesRight = gEl.getAttribute('data-walk-faces-right') === '1';
      const needsFlip = facesRight ? flipped : !flipped;

      // Grab the SVG element produced by lottie-web's SVG renderer
      const lottieSvg = inst.container.querySelector('svg');
      if (!lottieSvg) {
        console.warn(`[CanvasRenderer] No SVG found in lottie container for ${inst.componentId}`);
        continue;
      }

      // Clone and serialize the lottie SVG
      const svgClone = lottieSvg.cloneNode(true) as SVGSVGElement;
      svgClone.setAttribute('width', String(w));
      svgClone.setAttribute('height', String(h));
      // Ensure viewBox is set for proper scaling
      if (!svgClone.getAttribute('viewBox')) {
        svgClone.setAttribute('viewBox', `0 0 ${lottieSvg.clientWidth || w} ${lottieSvg.clientHeight || h}`);
      }

      let svgXml = new XMLSerializer().serializeToString(svgClone);
      if (!svgXml.includes('xmlns=')) {
        svgXml = svgXml.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      if (!svgXml.includes('xmlns:xlink')) {
        svgXml = svgXml.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
      }

      const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgXml);
      const img = new Image();
      img.src = dataUrl;

      try {
        await img.decode();

        if (needsFlip) {
          this.ctx.save();
          this.ctx.translate(x + w, y);
          this.ctx.scale(-1, 1);
          this.ctx.drawImage(img, 0, 0, w, h);
          this.ctx.restore();
        } else {
          this.ctx.drawImage(img, x, y, w, h);
        }
      } catch (err) {
        console.error(`[CanvasRenderer] Lottie SVG rasterize failed for ${inst.componentId}:`, err);
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
