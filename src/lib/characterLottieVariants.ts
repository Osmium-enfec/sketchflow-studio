import femaleWalkingData from '@/assets/female-walking.json';
import maleWalkingData from '@/assets/male-walking.json';
import maleWalking2Data from '@/assets/male-walking-2.json';

export interface LottieVariant {
  key: string;
  label: string;
  data: any;
  /** Whether this animation moves across the canvas */
  translates: boolean;
}

export const LOTTIE_VARIANTS: LottieVariant[] = [
  { key: 'femaleWalking', label: 'Female Walking', data: femaleWalkingData, translates: true },
  { key: 'maleWalking', label: 'Male Walking', data: maleWalkingData, translates: true },
  { key: 'maleWalking2', label: 'Male Walking 2', data: maleWalking2Data, translates: true },
];

export function getVariantData(key: string): LottieVariant {
  return LOTTIE_VARIANTS.find(v => v.key === key) || LOTTIE_VARIANTS[0];
}
