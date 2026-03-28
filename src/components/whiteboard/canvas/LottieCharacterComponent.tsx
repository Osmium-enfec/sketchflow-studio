import React, { useMemo } from 'react';
import LottiePlayer from 'lottie-react';
import { WhiteboardComponent } from '@/store/whiteboardStore';
import { getLottieData } from '@/lib/lottiePresets';

// Handle both default and named export patterns
const Lottie = (typeof LottiePlayer === 'object' && LottiePlayer && 'default' in LottiePlayer)
  ? (LottiePlayer as any).default
  : LottiePlayer;

export const LOTTIE_PRESET_LIST = [
  { value: 'bouncing', label: 'Bouncing' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'spinner', label: 'Spinner' },
  { value: 'checkmark', label: 'Checkmark' },
  { value: 'waveform', label: 'Waveform' },
];

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onResizeStart?: (e: React.MouseEvent, handle: string) => void;
}

const LottieCharacterComponent: React.FC<Props> = ({ component, isSelected, onMouseDown, onResizeStart }) => {
  const { x, y, width = 300, height = 300, lottiePreset = 'bouncing' } = component.props;
  const animationData = useMemo(() => getLottieData(lottiePreset), [lottiePreset]);

  const handles = ['se', 'sw', 'ne', 'nw'];
  const handlePositions: Record<string, { cx: number; cy: number }> = {
    nw: { cx: 0, cy: 0 },
    ne: { cx: width, cy: 0 },
    sw: { cx: 0, cy: height },
    se: { cx: width, cy: height },
  };

  return (
    <g data-component-id={component.id}>
      <foreignObject
        x={x}
        y={y}
        width={width}
        height={height}
        onMouseDown={onMouseDown}
        style={{ cursor: 'grab', overflow: 'visible' }}
      >
        <div style={{ width, height, pointerEvents: 'all' }}>
          <Lottie
            animationData={animationData}
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </foreignObject>

      {isSelected && (
        <>
          <rect
            x={x - 2} y={y - 2}
            width={width + 4} height={height + 4}
            fill="none"
            stroke="hsl(217 91% 60%)"
            strokeWidth="2"
            strokeDasharray="6 3"
            rx="4"
          />
          {handles.map((h) => (
            <circle
              key={h}
              cx={x + handlePositions[h].cx}
              cy={y + handlePositions[h].cy}
              r={5}
              fill="white"
              stroke="hsl(217 91% 60%)"
              strokeWidth={2}
              style={{ cursor: h === 'se' || h === 'nw' ? 'nwse-resize' : 'nesw-resize' }}
              onMouseDown={(e) => { e.stopPropagation(); onResizeStart?.(e, h); }}
            />
          ))}
        </>
      )}
    </g>
  );
};

export default LottieCharacterComponent;
