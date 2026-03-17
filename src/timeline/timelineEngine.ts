import gsap from 'gsap';
import { WhiteboardComponent } from '@/store/whiteboardStore';

const DURATION: Record<string, number> = {
  title: 1.2,
  box: 1.5,
  arrow: 0.8,
  highlight: 0.6,
};

function animateTitle(el: SVGGElement): gsap.core.Timeline {
  const tl = gsap.timeline();
  const fillText = el.querySelector('.title-text') as SVGTextElement | null;
  const strokeText = el.querySelector('.title-text-stroke') as SVGTextElement | null;

  if (fillText) {
    gsap.set(fillText, { opacity: 0 });
  }

  if (strokeText) {
    // Handwriting stroke animation
    const length = strokeText.getComputedTextLength?.() || 500;
    gsap.set(strokeText, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 1,
    });
    tl.to(strokeText, {
      strokeDashoffset: 0,
      duration: 1.0,
      ease: 'power1.inOut',
    });
    // Then fade in the fill text and fade out the stroke
    if (fillText) {
      tl.to(fillText, { opacity: 1, duration: 0.3, ease: 'power1.out' }, '-=0.2');
      tl.to(strokeText, { opacity: 0, duration: 0.3, ease: 'power1.out' }, '-=0.2');
    }
  } else if (fillText) {
    tl.fromTo(fillText, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
  }

  return tl;
}

function animateBox(el: SVGGElement): gsap.core.Timeline {
  const tl = gsap.timeline();
  const roughRect = el.querySelector('.rough-rect');
  const text = el.querySelector('text');

  if (roughRect) {
    const paths = roughRect.querySelectorAll('path');
    paths.forEach((path) => {
      const length = (path as SVGPathElement).getTotalLength?.() || 500;
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      tl.to(path, { strokeDashoffset: 0, duration: 0.8, ease: 'power1.inOut' }, 0);
    });
  }

  if (text) {
    tl.fromTo(text, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power1.out' }, 0.5);
  }

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
