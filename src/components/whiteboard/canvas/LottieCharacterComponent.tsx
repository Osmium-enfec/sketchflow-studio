import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { WhiteboardComponent } from '@/store/whiteboardStore';

// Built-in Lottie animation URLs from LottieFiles CDN
export const LOTTIE_PRESETS: Record<string, { label: string; url: string }> = {
  walking: {
    label: 'Walking',
    url: 'https://lottie.host/2a61b1ad-2d1c-4783-87ff-d5a8c20f15a0/sFJxSQP1LT.json',
  },
  waving: {
    label: 'Waving',
    url: 'https://lottie.host/f8a350dd-09ad-43d3-ac13-3d4b88b45e05/kKaFMZKgkP.json',
  },
  thinking: {
    label: 'Thinking',
    url: 'https://lottie.host/cfc41569-cb96-43cf-9b02-e12a1c2f1e42/WXkiKHrIYF.json',
  },
  celebrating: {
    label: 'Celebrating',
    url: 'https://lottie.host/b18b46e8-5ec6-41f6-b070-e4c4a8df49c9/1HpnJJQ5yE.json',
  },
  coding: {
    label: 'Coding',
    url: 'https://lottie.host/ddb0bbb1-ea52-4990-8a8e-c2b31dbb5e88/fQdLh4bLBd.json',
  },
};

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onResizeStart?: (e: React.MouseEvent, handle: string) => void;
}

const LottieCharacterComponent: React.FC<Props> = ({ component, isSelected, onMouseDown, onResizeStart }) => {
  const { x, y, width = 300, height = 300, lottiePreset = 'walking', lottieUrl } = component.props;
  const [animationData, setAnimationData] = useState<any>(null);

  const resolvedUrl = lottieUrl || LOTTIE_PRESETS[lottiePreset]?.url || LOTTIE_PRESETS.walking.url;

  useEffect(() => {
    let cancelled = false;
    fetch(resolvedUrl)
      .then(r => r.json())
      .then(data => { if (!cancelled) setAnimationData(data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [resolvedUrl]);

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
          {animationData ? (
            <Lottie
              animationData={animationData}
              loop
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.05)',
              borderRadius: 8,
              fontSize: 14,
              color: '#888',
            }}>
              Loading...
            </div>
          )}
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
