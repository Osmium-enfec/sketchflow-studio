import gsap from 'gsap';
import { WhiteboardComponent } from '@/store/whiteboardStore';

const DURATION: Record<string, number> = {
  title: 1.2,
  box: 1.5,
  arrow: 0.8,
  highlight: 0.6,
};

function animateCharPaths(
  el: SVGGElement,
  charClass: string,
  fillClass: string
): gsap.core.Timeline {
  const tl = gsap.timeline();
  const strokePaths = el.querySelectorAll(`path[class*="${charClass}"]`) as NodeListOf<SVGPathElement>;
  const fillPaths = el.querySelectorAll(`.${fillClass}`) as NodeListOf<SVGPathElement>;

  if (strokePaths.length === 0) return tl;

  // Hide fills initially
  fillPaths.forEach((fp) => gsap.set(fp, { opacity: 0 }));

  // Animate each character stroke path sequentially
  strokePaths.forEach((path, i) => {
    const length = path.getTotalLength?.() || 200;
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 1,
    });
    const charDuration = Math.min(0.4, Math.max(0.15, length / 500));
    tl.to(path, {
      strokeDashoffset: 0,
      duration: charDuration,
      ease: 'power1.inOut',
    }, i > 0 ? `-=${charDuration * 0.3}` : 0);
  });

  // After all strokes drawn, fade in fills and fade out strokes
  tl.to(Array.from(fillPaths), { opacity: 1, duration: 0.25, ease: 'power1.out' });
  tl.to(Array.from(strokePaths), { opacity: 0, duration: 0.25, ease: 'power1.out' }, '<');

  return tl;
}

function animateTitle(el: SVGGElement): gsap.core.Timeline {
  return animateCharPaths(el, 'title-char', 'title-char-fill');
}

function animateBox(el: SVGGElement): gsap.core.Timeline {
  const tl = gsap.timeline();
  const roughRect = el.querySelector('.rough-rect');

  // Animate the rough.js rectangle border first
  if (roughRect) {
    const paths = roughRect.querySelectorAll('path');
    paths.forEach((path) => {
      const length = (path as SVGPathElement).getTotalLength?.() || 500;
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      tl.to(path, { strokeDashoffset: 0, duration: 0.8, ease: 'power1.inOut' }, 0);
    });
  }

  // Then animate text paths
  const textTl = animateCharPaths(el, 'box-char', 'box-char-fill');
  tl.add(textTl, 0.5);

  return tl;
}

function animateArrow(el: SVGGElement): gsap.core.Timeline {
  const tl = gsap.timeline();
  const path = el.querySelector('.arrow-path') as SVGPathElement | null;
  const polygon = el.querySelector('polygon');

  if (path) {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    tl.to(path, { strokeDashoffset: 0, duration: 0.7, ease: 'power1.inOut' });
  }

  if (polygon) {
    gsap.set(polygon, { opacity: 0, scale: 0 });
    tl.to(polygon, { opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(2)' }, '-=0.1');
  }

  return tl;
}

function animateHighlight(el: SVGGElement): gsap.core.Timeline {
  const tl = gsap.timeline();
  const rect = el.querySelector('.highlight-rect');
  if (rect) {
    const fullWidth = parseFloat(rect.getAttribute('width') || '200');
    gsap.set(rect, { attr: { width: 0 } });
    tl.to(rect, { attr: { width: fullWidth }, duration: 0.5, ease: 'power2.out' });
  }
  return tl;
}

const animators: Record<string, (el: SVGGElement) => gsap.core.Timeline> = {
  title: animateTitle,
  box: animateBox,
  arrow: animateArrow,
  highlight: animateHighlight,
};

export function playAnimation(svgEl: SVGSVGElement, components: WhiteboardComponent[]) {
  gsap.killTweensOf(svgEl.querySelectorAll('*'));

  const sorted = [...components].sort((a, b) => a.order - b.order);

  const master = gsap.timeline();
  let currentTime = 0;

  sorted.forEach((comp) => {
    const el = svgEl.querySelector(`[data-component-id="${comp.id}"]`) as SVGGElement | null;
    if (!el) return;

    const animator = animators[comp.type];
    if (!animator) return;

    const startTime = currentTime + (comp.delay || 0);
    const tl = animator(el);
    master.add(tl, startTime);

    currentTime = startTime + (DURATION[comp.type] || 1);
  });

  master.play(0);
}
