import femaleWalkingData from '@/assets/female-walking.json';
import maleWalkingData from '@/assets/male-walking.json';
import happyBoyData from '@/assets/happy-boy.json';
import talkingGreenManData from '@/assets/talking-green-man.json';
import manRunningData from '@/assets/man-running.json';

export interface LottieVariant {
  key: string;
  label: string;
  data: any;
  /** Whether this animation moves across the canvas */
  translates: boolean;
  /** Whether the source animation naturally faces right */
  facesRight: boolean;
  /** Whether this variant has a looping animation */
  animates: boolean;
}

export const LOTTIE_VARIANTS: LottieVariant[] = [
  { key: 'femaleWalking', label: 'Female Walking', data: femaleWalkingData, translates: true, facesRight: false, animates: true },
  { key: 'maleWalking', label: 'Male Walking', data: maleWalkingData, translates: true, facesRight: true, animates: true },
  { key: 'happyBoy', label: 'Happy Boy', data: happyBoyData, translates: false, facesRight: true, animates: true },
  { key: 'talkingGreenMan', label: 'Talking Man', data: talkingGreenManData, translates: false, facesRight: true, animates: true },
  { key: 'manRunning', label: 'Man Running', data: manRunningData, translates: true, facesRight: false, animates: true },
];

export function getVariantData(key: string): LottieVariant {
  return LOTTIE_VARIANTS.find(v => v.key === key) || LOTTIE_VARIANTS[0];
}
