import React from 'react';
import { WhiteboardComponent } from '@/store/whiteboardStore';

// Direct imports of individual Open Peeps parts (bypasses require()-based Effigy)
import ExplainingBody from '@opeepsfun/open-peeps/build/body/effigy/Explaining';
import CoffeeBody from '@opeepsfun/open-peeps/build/body/effigy/Coffee';
import PointingUpBody from '@opeepsfun/open-peeps/build/body/effigy/PointingUp';
import GamingBody from '@opeepsfun/open-peeps/build/body/effigy/Gaming';
import HoodieBody from '@opeepsfun/open-peeps/build/body/effigy/Hoodie';
import BlazerBlackTeeBody from '@opeepsfun/open-peeps/build/body/effigy/BlazerBlackTee';

import ShortOneHead from '@opeepsfun/open-peeps/build/head/ShortOne';
import BangsHead from '@opeepsfun/open-peeps/build/head/Bangs';
import PompHead from '@opeepsfun/open-peeps/build/head/Pomp';
import ShortTwoHead from '@opeepsfun/open-peeps/build/head/ShortTwo';
import WavyHead from '@opeepsfun/open-peeps/build/head/Wavy';
import GrayShortHead from '@opeepsfun/open-peeps/build/head/GrayShort';

import BigSmileFace from '@opeepsfun/open-peeps/build/face/BigSmile';
import CalmFace from '@opeepsfun/open-peeps/build/face/Calm';
import CheekyFace from '@opeepsfun/open-peeps/build/face/Cheeky';
import AweFace from '@opeepsfun/open-peeps/build/face/Awe';

import GlassesAccessory from '@opeepsfun/open-peeps/build/accessory/Glasses';
import FullBeard from '@opeepsfun/open-peeps/build/beard/Full';

// Preset configurations
export const PEEP_PRESETS: Record<string, {
  label: string;
  Body: React.FC<any>;
  Head: React.FC<any>;
  Face: React.FC<any>;
  Beard?: React.FC<any>;
  Accessory?: React.FC<any>;
  headOffset?: string;
}> = {
  explaining: {
    label: 'Explaining',
    Body: ExplainingBody,
    Head: ShortOneHead,
    Face: BigSmileFace,
    headOffset: 'translate(0 30)',
  },
  coffee: {
    label: 'Coffee',
    Body: CoffeeBody,
    Head: BangsHead,
    Face: CalmFace,
  },
  pointing: {
    label: 'Pointing',
    Body: PointingUpBody,
    Head: PompHead,
    Face: CheekyFace,
    headOffset: 'translate(0 30)',
  },
  gaming: {
    label: 'Gaming',
    Body: GamingBody,
    Head: ShortTwoHead,
    Face: BigSmileFace,
    Accessory: GlassesAccessory,
  },
  hoodie: {
    label: 'Hoodie',
    Body: HoodieBody,
    Head: WavyHead,
    Face: AweFace,
  },
  blazer: {
    label: 'Blazer',
    Body: BlazerBlackTeeBody,
    Head: GrayShortHead,
    Face: CalmFace,
    Beard: FullBeard,
  },
};

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

const OpenPeepComponent: React.FC<Props> = ({ component, isSelected, onMouseDown }) => {
  const { x, y, scale = 0.3, variant = 'explaining' } = component.props;
  const preset = PEEP_PRESETS[variant] || PEEP_PRESETS.explaining;

  const width = 940 * scale;
  const height = 1130 * scale;

  return (
    <g
      data-component-id={component.id}
      onMouseDown={onMouseDown}
      style={{ cursor: 'grab' }}
    >
      <foreignObject x={x} y={y} width={width} height={height} overflow="visible">
        <div style={{ width, height, pointerEvents: 'none' }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="184.21621621621625 210.7874999999999 940.2702702702704 1130.5875"
            overflow="visible"
            width="100%"
            height="100%"
          >
            <g id="Bust">
              <g id="Body" transform="translate(147, 639) scale(1 1)">
                <preset.Body />
              </g>
              <g id="Head" transform={preset.headOffset || 'translate(0 0)'}>
                <g id="Hair" transform="translate(342, 190) scale(1 1)">
                  <preset.Head />
                </g>
                <g id="Face" transform="translate(531, 366) scale(1 1)">
                  <preset.Face />
                </g>
                {preset.Beard && (
                  <g id="Beard" transform="translate(495, 518) scale(1 1)">
                    <preset.Beard />
                  </g>
                )}
                {preset.Accessory && (
                  <g id="Accessories" transform="translate(419, 421) scale(1 1)">
                    <preset.Accessory />
                  </g>
                )}
              </g>
            </g>
          </svg>
        </div>
      </foreignObject>
      {isSelected && (
        <rect
          x={x - 4}
          y={y - 4}
          width={width + 8}
          height={height + 8}
          fill="none"
          stroke="hsl(217 91% 60%)"
          strokeWidth="2"
          strokeDasharray="6 3"
          rx="4"
        />
      )}
    </g>
  );
};

export default OpenPeepComponent;
