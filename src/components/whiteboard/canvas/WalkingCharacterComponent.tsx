import React, { useRef, useEffect } from 'react';
import { useLottie } from 'lottie-react';
import { WhiteboardComponent } from '@/store/whiteboardStore';
import femaleWalkingData from '@/assets/female-walking.json';

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onResizeStart?: (e: React.MouseEvent, handle: string) => void;
}

const WalkingInner: React.FC<{ width: number; height: number; flipped: boolean }> = ({ width, height, flipped }) => {
  const { View, goToAndStop, play, stop } = useLottie({
    animationData: femaleWalkingData,
    loop: true,
    autoplay: false,
    style: {
      width: '100%',
      height: '100%',
      transform: flipped ? 'scaleX(-1)' : 'scaleX(1)',
    },
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    (el as any).__lottiePlay = play;
    (el as any).__lottieStop = stop;
    (el as any).__lottieGoTo = goToAndStop;
    goToAndStop(0, true);
    return () => { stop(); };
  }, [play, stop, goToAndStop]);

  return (
    <div ref={containerRef} data-lottie-control="true" style={{ width, height, pointerEvents: 'all' }}>
      {View}
    </div>
  );
};

const WalkingCharacterComponent: React.FC<Props> = ({ component, isSelected, onMouseDown, onResizeStart }) => {
  const {
    x, y,
    width = 250,
    height = 250,
    flipped = false,
    walkDistance = 200,
  } = component.props;

  const handles = ['se', 'sw', 'ne', 'nw'];
  const handlePositions: Record<string, { cx: number; cy: number }> = {
    nw: { cx: 0, cy: 0 },
    ne: { cx: width, cy: 0 },
    sw: { cx: 0, cy: height },
    se: { cx: width, cy: height },
  };

  return (
    <g data-component-id={component.id} data-walk-distance={walkDistance} data-walk-flipped={flipped ? '1' : '0'}>
      <foreignObject
        x={x}
        y={y}
        width={width}
        height={height}
        onMouseDown={onMouseDown}
        style={{ cursor: 'grab', overflow: 'visible' }}
      >
        <WalkingInner width={width} height={height} flipped={flipped} />
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

export default WalkingCharacterComponent;
