import gsap from 'gsap';
import { WhiteboardComponent } from '@/store/whiteboardStore';

const DURATION: Record<string, number> = {
  title: 1.2,
  box: 1.5,
  arrow: 0.8,
  highlight: 0.6,
  character: 3.0,
  indianCharacter: 1.5,
  device: 2.5,
  gradientArrow: 1.0,
  curvedArrow: 0.8,
  foldedBox: 1.5,
  codeBox: 1.2,
  openPeep: 1.0,
};

function animateTyping(textEl: SVGTextElement, duration: number): gsap.core.Timeline {
  const tl = gsap.timeline();
  const fullText = textEl.getAttribute('data-full-text') || textEl.textContent || '';
  const len = fullText.length;

  if (len === 0) return tl;

  const proxy = { chars: 0 };
  textEl.textContent = '';

  tl.to(proxy, {
    chars: len,
    duration,
    ease: 'steps(' + len + ')',
    onUpdate: () => {
      textEl.textContent = fullText.slice(0, Math.round(proxy.chars));
    },
    onComplete: () => {
      textEl.textContent = fullText;
    },
  });

  // Add a blinking cursor effect via a temporary tspan
  tl.set(textEl, {}, '+=0.1');

  return tl;
}

function animateTitle(el: SVGGElement): gsap.core.Timeline {
  const tl = gsap.timeline();
  const textEl = el.querySelector('.title-text') as SVGTextElement | null;

  if (textEl) {
    const fullText = textEl.getAttribute('data-full-text') || textEl.textContent || '';
    const charDuration = Math.max(0.6, Math.min(1.5, fullText.length * 0.06));
    tl.add(animateTyping(textEl, charDuration));
  }

  return tl;
}

function animateBox(el: SVGGElement): gsap.core.Timeline {
  const tl = gsap.timeline();
  const roughRect = el.querySelector('.rough-rect');
  const textEl = el.querySelector('text') as SVGTextElement | null;

  // Draw box outline first
  if (roughRect) {
    const paths = roughRect.querySelectorAll('path');
    paths.forEach((path) => {
      const length = (path as SVGPathElement).getTotalLength?.() || 500;
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      tl.to(path, { strokeDashoffset: 0, duration: 0.8, ease: 'power1.inOut' }, 0);
    });
  }

  // Then type in the text
  if (textEl) {
    const fullText = textEl.textContent || '';
    textEl.setAttribute('data-full-text', fullText);
    const charDuration = Math.max(0.4, Math.min(1.0, fullText.length * 0.05));
    tl.add(animateTyping(textEl, charDuration), 0.5);
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

function animateCharacter(el: SVGGElement): gsap.core.Timeline {
  const tl = gsap.timeline();
  const paths = el.querySelectorAll('.character-stroke');

  paths.forEach((pathEl, i) => {
    const path = pathEl as SVGPathElement;
    const length = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 1,
    });
    tl.to(path, {
      strokeDashoffset: 0,
      duration: 0.15 + length / 600,
      ease: 'power1.inOut',
    }, i === 0 ? 0 : '>-0.05');
  });

  return tl;
}

function animateDevice(el: SVGGElement): gsap.core.Timeline {
  const tl = gsap.timeline();
  const screen = el.querySelector('.device-screen');
  const strokes = el.querySelectorAll('.device-stroke');

  // Hide screen initially
  if (screen) {
    gsap.set(screen, { opacity: 0 });
  }

  // Draw strokes one by one
  strokes.forEach((pathEl, i) => {
    const path = pathEl as SVGPathElement;
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
    tl.to(path, {
      strokeDashoffset: 0,
      duration: 0.2 + length / 800,
      ease: 'power1.inOut',
    }, i === 0 ? 0 : '>-0.05');
  });

  // Fade in screen after outline is drawn
  if (screen) {
    tl.to(screen, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '>-0.1');
  }

  return tl;
}

function animateGradientArrow(el: SVGGElement): gsap.core.Timeline {
  const tl = gsap.timeline();
  const shaft = el.querySelector('.gradient-arrow-shaft') as SVGPathElement | null;
  const head = el.querySelector('.gradient-arrow-head') as SVGPathElement | null;

  if (shaft) {
    const len = shaft.getTotalLength();
    gsap.set(shaft, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 });
    tl.to(shaft, { strokeDashoffset: 0, fillOpacity: 1, duration: 0.7, ease: 'power1.inOut' });
  }
  if (head) {
    gsap.set(head, { opacity: 0, scale: 0, transformOrigin: 'center' });
    tl.to(head, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, '-=0.1');
  }
  return tl;
}

function animateCurvedArrow(el: SVGGElement): gsap.core.Timeline {
  return animateArrow(el); // Same stroke-draw logic
}

function animateFoldedBox(el: SVGGElement): gsap.core.Timeline {
  const tl = gsap.timeline();
  const body = el.querySelector('.foldedbox-body') as SVGPathElement | null;
  const fold = el.querySelector('.foldedbox-fold') as SVGPathElement | null;
  const text = el.querySelector('text') as SVGTextElement | null;

  if (body) {
    const len = body.getTotalLength();
    gsap.set(body, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 });
    tl.to(body, { strokeDashoffset: 0, duration: 0.8, ease: 'power1.inOut' });
    tl.to(body, { fillOpacity: 1, duration: 0.3 }, '-=0.2');
  }
  if (fold) {
    const len = fold.getTotalLength();
    gsap.set(fold, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 });
    tl.to(fold, { strokeDashoffset: 0, fillOpacity: 1, duration: 0.3, ease: 'power1.out' }, '-=0.3');
  }
  if (text) {
    const fullText = text.textContent || '';
    text.setAttribute('data-full-text', fullText);
    const charDuration = Math.max(0.4, Math.min(1.0, fullText.length * 0.05));
    tl.add(animateTyping(text, charDuration), '-=0.1');
  }
  return tl;
}

function animateCodeBox(el: SVGGElement): gsap.core.Timeline {
  const tl = gsap.timeline();
  const body = el.querySelector('.codebox-body') as SVGRectElement | null;
  const dots = el.querySelectorAll('.codebox-dot');

  // Fade in body
  if (body) {
    gsap.set(body, { opacity: 0, scaleX: 0.8, scaleY: 0.8, transformOrigin: 'center' });
    tl.to(body, { opacity: 1, scaleX: 1, scaleY: 1, duration: 0.6, ease: 'power2.out' });
  }

  // Pop in dots one by one
  dots.forEach((dot, i) => {
    gsap.set(dot, { opacity: 0, scale: 0, transformOrigin: 'center' });
    tl.to(dot, { opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(3)' }, 0.5 + i * 0.12);
  });

  return tl;
}

function animateIndianCharacter(el: SVGGElement): gsap.core.Timeline {
  const tl = gsap.timeline();
  // Fade + scale the whole face in
  gsap.set(el, { opacity: 0, scale: 0.7, transformOrigin: 'center center' });
  tl.to(el, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.4)' });

  // Then reveal individual parts with slight stagger
  const parts = el.querySelectorAll('.indian-face-shape, .indian-hair-main, .indian-hair-top, .indian-eyes, .indian-eyebrows, .indian-nose, .indian-lips');
  parts.forEach((part, i) => {
    gsap.set(part, { opacity: 0 });
    tl.to(part, { opacity: 1, duration: 0.15, ease: 'power2.out' }, 0.3 + i * 0.08);
  });

  return tl;
}

function animateOpenPeep(el: SVGGElement): gsap.core.Timeline {
  const tl = gsap.timeline();
  gsap.set(el, { opacity: 0, scale: 0.6, transformOrigin: 'center bottom' });
  tl.to(el, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.4)' });
  return tl;
}

const animators: Record<string, (el: SVGGElement) => gsap.core.Timeline> = {
  title: animateTitle,
  box: animateBox,
  arrow: animateArrow,
  highlight: animateHighlight,
  character: animateCharacter,
  indianCharacter: animateIndianCharacter,
  device: animateDevice,
  gradientArrow: animateGradientArrow,
  curvedArrow: animateCurvedArrow,
  foldedBox: animateFoldedBox,
  codeBox: animateCodeBox,
  openPeep: animateOpenPeep,
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
