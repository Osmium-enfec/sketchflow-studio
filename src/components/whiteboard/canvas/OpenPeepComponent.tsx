import React, { useRef } from 'react';
import { WhiteboardComponent } from '@/store/whiteboardStore';

// Direct ESM imports of individual Open Peeps parts
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
import ButtonShirtSmilingPeep from './peeps/ButtonShirtSmilingPeep';

export const PEEP_PRESETS: Record<string, {
  label: string;
  Body?: React.FC<any>;
  Head?: React.FC<any>;
  Face?: React.FC<any>;
  Beard?: React.FC<any>;
  Accessory?: React.FC<any>;
  headOffset?: string;
  CustomComponent?: React.FC;
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
  buttonShirt: {
    label: 'Button Shirt',
    CustomComponent: ButtonShirtSmilingPeep,
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
  const isCustom = !!preset.CustomComponent;

  const headGroupRef = useRef<SVGGElement>(null);
  const faceGroupRef = useRef<SVGGElement>(null);
  const bodyGroupRef = useRef<SVGGElement>(null);

  const width = (isCustom ? 240 : 940) * scale;
  const height = (isCustom ? 324 : 1130) * scale;

  return (
    <g
      data-component-id={component.id}
      onMouseDown={onMouseDown}
      style={{ cursor: 'grab' }}
    >
      <g transform={`translate(${x}, ${y}) scale(${scale})`}>
        {isCustom ? (
          <preset.CustomComponent />
        ) : (
          <g transform="translate(-184, -210)">
            <g id="Bust">
              <g ref={bodyGroupRef} className="peep-body" transform="translate(147, 639) scale(1 1)">
                <preset.Body />
              </g>
              <g ref={headGroupRef} className="peep-head" transform={preset.headOffset || 'translate(0 0)'}>
                <g className="peep-hair" transform="translate(342, 190) scale(1 1)">
                  <preset.Head />
                </g>
                <g ref={faceGroupRef} className="peep-face" transform="translate(531, 366) scale(1 1)">
                  <preset.Face />
                </g>
                {preset.Beard && (
                  <g className="peep-beard" transform="translate(495, 518) scale(1 1)">
                    <preset.Beard />
                  </g>
                )}
                {preset.Accessory && (
                  <g className="peep-accessory" transform="translate(419, 421) scale(1 1)">
                    <preset.Accessory />
                  </g>
                )}
              </g>
            </g>
          </g>
        )}
      </g>
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
