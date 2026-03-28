import React, { useMemo } from 'react';
import { useLottie } from 'lottie-react';
import { WhiteboardComponent } from '@/store/whiteboardStore';
import { getLottieData } from '@/lib/lottiePresets';

export const LOTTIE_PRESET_LIST = [
  { value: 'walking', label: 'Walking' },
  { value: 'running', label: 'Running' },
  { value: 'bouncing', label: 'Bouncing Ball' },
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

const LottieInner: React.FC<{ animationData: any; width: number; height: number }> = ({ animationData, width, height }) => {
  const { View } = useLottie({
    animationData,
    loop: true,
    autoplay: true,
    style: { width: '100%', height: '100%' },
  });
  return <div style={{ width, height, pointerEvents: 'all' }}>{View}</div>;
};

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
        <LottieInner animationData={animationData} width={width} height={height} />
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
