import gsap from 'gsap';
import { WhiteboardComponent } from '@/store/whiteboardStore';

const DURATION: Record<string, number> = {
  title: 1.2,
  content: 1.2,
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
  openPeep: 3.0,
  documentation: 2.0,
  noteBox: 1.5,
  docCodeBlock: 1.8,
  markdown: 1.5,
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

  // Collect all paths inside the peep component
  const allPaths = el.querySelectorAll('path');

  // First pass: set all paths invisible
  allPaths.forEach((path) => {
    const pathEl = path as SVGPathElement;
    try {
      const length = pathEl.getTotalLength();
      gsap.set(pathEl, {
        strokeDasharray: length,
        strokeDashoffset: length,
        fillOpacity: 0,
        stroke: pathEl.getAttribute('fill') || '#000',
        strokeWidth: 2,
        opacity: 1,
      });
    } catch {
      gsap.set(pathEl, { opacity: 0 });
    }
  });

  // Animate body paths first, then head/hair, then face
  const groups = ['.peep-body', '.peep-hair', '.peep-face', '.peep-beard', '.peep-accessory'];
  let groupDelay = 0;

  groups.forEach((selector) => {
    const group = el.querySelector(selector);
    if (!group) return;
    const paths = group.querySelectorAll(':scope > path, :scope > g > path, path');
    if (paths.length === 0) return;

    const uniquePaths = Array.from(new Set(Array.from(paths)));
    uniquePaths.forEach((pathNode, i) => {
      const pathEl = pathNode as SVGPathElement;
      try {
        const length = pathEl.getTotalLength();
        const drawDuration = Math.min(1.5, Math.max(0.3, length / 2000));

        // Stroke draw
        tl.to(pathEl, {
          strokeDashoffset: 0,
          duration: drawDuration,
          ease: 'power1.inOut',
        }, groupDelay + i * 0.08);

        // Fill reveal slightly after stroke starts
        tl.to(pathEl, {
          fillOpacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        }, groupDelay + i * 0.08 + drawDuration * 0.6);
      } catch {
        tl.to(pathEl, { opacity: 1, duration: 0.3 }, groupDelay + i * 0.1);
      }
    });

    groupDelay += 0.5;
  });

  return tl;
}

function animateDocumentation(el: SVGGElement): gsap.core.Timeline {
  const tl = gsap.timeline();

  const shadow = el.querySelector('.doc-shadow');
  const page = el.querySelector('.doc-page');
  const header = el.querySelector('.doc-header');
  const headerLine = el.querySelector('.doc-header-line');
  const icon = el.querySelector('.doc-icon');
  const titleText = el.querySelector('.doc-title-text');
  const headingBg = el.querySelector('.doc-heading-bg');
  const headingUnderline = el.querySelector('.doc-heading-underline');
  const textLines = el.querySelectorAll('.doc-text-line');
  const codeBlock = el.querySelector('.doc-code-block');
  const codeLines = el.querySelectorAll('.doc-code-line');
  const footerLine = el.querySelector('.doc-footer-line');
  const footerText = el.querySelector('.doc-footer-text');

  // Page slides in and fades
  if (shadow) { gsap.set(shadow, { opacity: 0 }); tl.to(shadow, { opacity: 1, duration: 0.3 }, 0); }
  if (page) { gsap.set(page, { opacity: 0, scaleY: 0.9, transformOrigin: 'top center' }); tl.to(page, { opacity: 1, scaleY: 1, duration: 0.5, ease: 'power2.out' }, 0); }

  // Header
  if (header) { gsap.set(header, { opacity: 0 }); tl.to(header, { opacity: 1, duration: 0.3 }, 0.2); }
  if (headerLine) { gsap.set(headerLine, { opacity: 0 }); tl.to(headerLine, { opacity: 1, duration: 0.2 }, 0.3); }
  if (icon) { gsap.set(icon, { opacity: 0, scale: 0 }); tl.to(icon, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, 0.3); }
  if (titleText) { gsap.set(titleText, { opacity: 0 }); tl.to(titleText, { opacity: 1, duration: 0.3 }, 0.4); }

  // Heading
  if (headingBg) { gsap.set(headingBg, { scaleX: 0, transformOrigin: 'left' }); tl.to(headingBg, { scaleX: 1, duration: 0.4, ease: 'power2.out' }, 0.5); }
  if (headingUnderline) { gsap.set(headingUnderline, { scaleX: 0, transformOrigin: 'left' }); tl.to(headingUnderline, { scaleX: 1, duration: 0.3, ease: 'power2.out' }, 0.6); }

  // Text lines stagger
  textLines.forEach((line, i) => {
    gsap.set(line, { scaleX: 0, transformOrigin: 'left' });
    tl.to(line, { scaleX: 1, duration: 0.2, ease: 'power1.out' }, 0.7 + i * 0.06);
  });

  // Code block
  if (codeBlock) { gsap.set(codeBlock, { opacity: 0, scaleY: 0, transformOrigin: 'top' }); tl.to(codeBlock, { opacity: 1, scaleY: 1, duration: 0.3, ease: 'power2.out' }, 1.2); }
  codeLines.forEach((line, i) => {
    gsap.set(line, { scaleX: 0, transformOrigin: 'left' });
    tl.to(line, { scaleX: 1, duration: 0.2, ease: 'power1.out' }, 1.3 + i * 0.08);
  });

  // Footer
  if (footerLine) { gsap.set(footerLine, { opacity: 0 }); tl.to(footerLine, { opacity: 1, duration: 0.2 }, 1.6); }
  if (footerText) { gsap.set(footerText, { opacity: 0 }); tl.to(footerText, { opacity: 1, duration: 0.2 }, 1.7); }

  return tl;
}

function animateNoteBox(el: SVGGElement): gsap.core.Timeline {
  const tl = gsap.timeline();

  const bg = el.querySelector('.note-bg');
  const leftBar = el.querySelector('.note-left-bar');
  const leftBarOverlay = el.querySelector('.note-left-bar-overlay');
  const icon = el.querySelector('.note-icon');
  const titleText = el.querySelector('.note-title-text');
  const contentText = el.querySelector('.note-content-text');

  // Slide in background
  if (bg) { gsap.set(bg, { opacity: 0, scaleX: 0.8, transformOrigin: 'left center' }); tl.to(bg, { opacity: 1, scaleX: 1, duration: 0.4, ease: 'power2.out' }, 0); }
  
  // Left bar grows down
  if (leftBar) { gsap.set(leftBar, { scaleY: 0, transformOrigin: 'top' }); tl.to(leftBar, { scaleY: 1, duration: 0.3, ease: 'power2.out' }, 0.1); }
  if (leftBarOverlay) { gsap.set(leftBarOverlay, { scaleY: 0, transformOrigin: 'top' }); tl.to(leftBarOverlay, { scaleY: 1, duration: 0.3, ease: 'power2.out' }, 0.1); }

  // Icon pops in
  if (icon) { gsap.set(icon, { opacity: 0, scale: 0 }); tl.to(icon, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, 0.3); }

  // Title fades in
  if (titleText) { gsap.set(titleText, { opacity: 0 }); tl.to(titleText, { opacity: 1, duration: 0.3 }, 0.4); }

  // Content fades in
  if (contentText) { gsap.set(contentText, { opacity: 0 }); tl.to(contentText, { opacity: 1, duration: 0.4 }, 0.6); }

  return tl;
}

function animateDocCodeBlock(el: SVGGElement): gsap.core.Timeline {
  const tl = gsap.timeline();

  const body = el.querySelector('.code-body');
  const header = el.querySelector('.code-header');
  const headerLine = el.querySelector('.code-header-line');
  const titleText = el.querySelector('.code-title-text');
  const copyIcon = el.querySelector('.code-copy-icon');
  const contentText = el.querySelector('.code-content-text');
  const codeLines = el.querySelectorAll('.code-line');

  // Body fades in
  if (body) { gsap.set(body, { opacity: 0, scaleY: 0.9, transformOrigin: 'top center' }); tl.to(body, { opacity: 1, scaleY: 1, duration: 0.4, ease: 'power2.out' }, 0); }
  if (header) { gsap.set(header, { opacity: 0 }); tl.to(header, { opacity: 1, duration: 0.3 }, 0.1); }
  if (headerLine) { gsap.set(headerLine, { opacity: 0 }); tl.to(headerLine, { opacity: 1, duration: 0.2 }, 0.2); }
  if (titleText) { gsap.set(titleText, { opacity: 0 }); tl.to(titleText, { opacity: 1, duration: 0.3 }, 0.3); }
  if (copyIcon) { gsap.set(copyIcon, { opacity: 0, scale: 0 }); tl.to(copyIcon, { opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(2)' }, 0.3); }

  // Code lines appear one by one
  codeLines.forEach((line, i) => {
    gsap.set(line, { opacity: 0 });
    tl.to(line, { opacity: 1, duration: 0.15 }, 0.5 + i * 0.1);
  });

  // Fallback for content text
  if (contentText && codeLines.length === 0) {
    gsap.set(contentText, { opacity: 0 });
    tl.to(contentText, { opacity: 1, duration: 0.4 }, 0.5);
  }

  return tl;
}

function animateContent(el: SVGGElement): gsap.core.Timeline {
  const tl = gsap.timeline();
  const foreignObj = el.querySelector('foreignObject');

  if (foreignObj) {
    gsap.set(foreignObj, { opacity: 0 });
    tl.to(foreignObj, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 0);
  }
  return tl;
}

function animateMarkdown(el: SVGGElement): gsap.core.Timeline {
  const tl = gsap.timeline();
  const bg = el.querySelector('rect');
  const foreignObj = el.querySelector('foreignObject');

  if (bg) {
    gsap.set(bg, { opacity: 0, scaleY: 0.9, transformOrigin: 'top center' });
    tl.to(bg, { opacity: 1, scaleY: 1, duration: 0.4, ease: 'power2.out' }, 0);
  }
  if (foreignObj) {
    gsap.set(foreignObj, { opacity: 0 });
    tl.to(foreignObj, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.3);
  }
  return tl;
}

const animators: Record<string, (el: SVGGElement) => gsap.core.Timeline> = {
  title: animateTitle,
  content: animateContent,
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
  documentation: animateDocumentation,
  noteBox: animateNoteBox,
  docCodeBlock: animateDocCodeBlock,
  markdown: animateMarkdown,
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

  master.eventCallback('onComplete', () => {
    window.dispatchEvent(new CustomEvent('whiteboard-animation-end'));
  });

  master.play(0);
}
