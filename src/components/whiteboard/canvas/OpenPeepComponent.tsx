import React from 'react';
import { Effigy } from '@opeepsfun/open-peeps';
import { WhiteboardComponent } from '@/store/whiteboardStore';

export const PEEP_PRESETS: Record<string, { label: string; body: any; head: any; face: any; beard?: any; accessory?: any }> = {
  explaining: {
    label: 'Explaining',
    body: { type: 'Explaining' },
    head: { type: 'ShortOne' },
    face: { type: 'BigSmile' },
  },
  coffee: {
    label: 'Coffee',
    body: { type: 'Coffee' },
    head: { type: 'Bangs' },
    face: { type: 'Calm' },
  },
  pointing: {
    label: 'Pointing',
    body: { type: 'PointingUp' },
    head: { type: 'Pomp' },
    face: { type: 'Cheeky' },
  },
  gaming: {
    label: 'Gaming',
    body: { type: 'Gaming' },
    head: { type: 'ShortTwo' },
    face: { type: 'BigSmile' },
    accessory: { type: 'Glasses' },
  },
  hoodie: {
    label: 'Hoodie',
    body: { type: 'Hoodie' },
    head: { type: 'Wavy' },
    face: { type: 'Awe' },
  },
  blazer: {
    label: 'Blazer',
    body: { type: 'BlazerBlackTee' },
    head: { type: 'GrayShort' },
    face: { type: 'Calm' },
    beard: { type: 'Full' },
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

  // The Effigy SVG viewBox is roughly 940x1130, we scale it down
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
          <Effigy
            style={{ width: '100%', height: '100%' }}
            body={preset.body}
            head={preset.head}
            face={preset.face}
            beard={preset.beard}
            accessory={preset.accessory}
          />
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
