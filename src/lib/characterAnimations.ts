import gsap from 'gsap';

export type CharacterAnimation = 'idle' | 'talking' | 'smiling' | 'waving' | 'nodding' | 'breathing';

export const CHARACTER_ANIMATIONS: { value: CharacterAnimation; label: string }[] = [
  { value: 'idle', label: 'Idle' },
  { value: 'talking', label: 'Talking' },
  { value: 'smiling', label: 'Smiling' },
  { value: 'waving', label: 'Waving' },
  { value: 'nodding', label: 'Nodding' },
  { value: 'breathing', label: 'Breathing' },
];

export function createTalkingAnimation(mouthEl: Element, headEl?: Element): gsap.core.Timeline {
  const tl = gsap.timeline({ repeat: -1 });
  tl.to(mouthEl, { scaleY: 1.4, transformOrigin: 'center top', duration: 0.15, ease: 'power2.out' })
    .to(mouthEl, { scaleY: 0.6, duration: 0.12, ease: 'power2.in' })
    .to(mouthEl, { scaleY: 1.3, duration: 0.14, ease: 'power2.out' })
    .to(mouthEl, { scaleY: 1, duration: 0.1, ease: 'power2.in' });

  if (headEl) {
    tl.to(headEl, { y: '-=1.5', duration: 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 0);
  }
  return tl;
}

export function createSmilingAnimation(mouthEl: Element): gsap.core.Timeline {
  const tl = gsap.timeline();
  tl.to(mouthEl, { scaleX: 1.2, scaleY: 1.15, transformOrigin: 'center center', duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  return tl;
}

export function createWavingAnimation(bodyEl: Element): gsap.core.Timeline {
  const tl = gsap.timeline({ repeat: -1 });
  tl.to(bodyEl, { rotation: -8, transformOrigin: 'center bottom', duration: 0.4, ease: 'sine.inOut' })
    .to(bodyEl, { rotation: 8, duration: 0.4, ease: 'sine.inOut' })
    .to(bodyEl, { rotation: -6, duration: 0.35, ease: 'sine.inOut' })
    .to(bodyEl, { rotation: 6, duration: 0.35, ease: 'sine.inOut' })
    .to(bodyEl, { rotation: 0, duration: 0.3, ease: 'sine.inOut' });
  return tl;
}

export function createNoddingAnimation(headEl: Element): gsap.core.Timeline {
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
  tl.to(headEl, { y: '+=4', duration: 0.25, ease: 'power2.out' })
    .to(headEl, { y: '-=4', duration: 0.2, ease: 'power2.in' })
    .to(headEl, { y: '+=3', duration: 0.2, ease: 'power2.out' })
    .to(headEl, { y: '-=3', duration: 0.2, ease: 'power2.in' });
  return tl;
}

export function createBreathingAnimation(bodyEl: Element): gsap.core.Timeline {
  const tl = gsap.timeline({ repeat: -1 });
  tl.to(bodyEl, { scaleY: 1.015, scaleX: 1.01, transformOrigin: 'center bottom', duration: 1.8, ease: 'sine.inOut' })
    .to(bodyEl, { scaleY: 1, scaleX: 1, duration: 1.8, ease: 'sine.inOut' });
  return tl;
}

export function applyCharacterAnimation(
  animation: CharacterAnimation,
  refs: {
    mouthEl?: Element | null;
    headEl?: Element | null;
    bodyEl?: Element | null;
  }
): gsap.core.Timeline | null {
  const { mouthEl, headEl, bodyEl } = refs;

  switch (animation) {
    case 'talking':
      if (mouthEl) return createTalkingAnimation(mouthEl, headEl || undefined);
      break;
    case 'smiling':
      if (mouthEl) return createSmilingAnimation(mouthEl);
      break;
    case 'waving':
      if (bodyEl) return createWavingAnimation(bodyEl);
      break;
    case 'nodding':
      if (headEl) return createNoddingAnimation(headEl);
      break;
    case 'breathing':
      if (bodyEl) return createBreathingAnimation(bodyEl);
      break;
    case 'idle':
    default:
      return null;
  }
  return null;
}
