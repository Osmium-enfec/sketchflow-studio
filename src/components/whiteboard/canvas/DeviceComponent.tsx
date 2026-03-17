import React from 'react';
import { WhiteboardComponent } from '@/store/whiteboardStore';

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

// Phone device paths (~160x300 local space)
const PHONE_PATHS = [
  // Outer body (rounded rectangle)
  { d: 'M20,2 L140,2 Q158,2 158,20 L158,280 Q158,298 140,298 L20,298 Q2,298 2,280 L2,20 Q2,2 20,2 Z' },
  // Screen area
  { d: 'M12,35 L148,35 L148,265 L12,265 Z' },
  // Top notch
  { d: 'M55,10 Q55,18 65,18 L95,18 Q105,18 105,10' },
  // Camera dot
  { d: 'M75,12 A2,2 0 1,1 79,12 A2,2 0 1,1 75,12 Z' },
  // Bottom bar
  { d: 'M60,280 L100,280' },
];

// Tablet device paths (~240x320 local space)
const TABLET_PATHS = [
  // Outer body
  { d: 'M15,2 L225,2 Q238,2 238,15 L238,305 Q238,318 225,318 L15,318 Q2,318 2,305 L2,15 Q2,2 15,2 Z' },
  // Screen area
  { d: 'M12,20 L228,20 L228,298 L12,298 Z' },
  // Top camera
  { d: 'M116,10 A3,3 0 1,1 124,10 A3,3 0 1,1 116,10 Z' },
  // Home button
  { d: 'M110,306 A5,5 0 1,1 130,306 A5,5 0 1,1 110,306 Z' },
];

const DeviceComponent: React.FC<Props> = ({ component, isSelected, onMouseDown }) => {
  const { x, y, scale = 1, variant = 'phone' } = component.props;
  const paths = variant === 'phone' ? PHONE_PATHS : TABLET_PATHS;
  const w = variant === 'phone' ? 160 : 240;
  const h = variant === 'phone' ? 300 : 320;

  // Screen fill color
  const screenPath = paths[1];

  return (
    <g
      data-component-id={component.id}
      onMouseDown={onMouseDown}
      style={{ cursor: 'move' }}
      transform={`translate(${x}, ${y}) scale(${scale})`}
    >
      {isSelected && (
        <rect
          x={-5 / scale}
          y={-5 / scale}
          width={(w + 10) / scale}
          height={(h + 10) / scale}
          fill="none"
          stroke="hsl(210 80% 70%)"
          strokeWidth={2 / scale}
          strokeDasharray="6 3"
          rx={4 / scale}
        />
      )}
      {/* Screen fill (green like reference) */}
      <path
        d={screenPath.d}
        fill="hsl(90 80% 70%)"
        stroke="none"
        className="device-screen"
      />
      {/* All strokes for drawing animation */}
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          className="device-stroke"
          fill="none"
          stroke="hsl(240 50% 20%)"
          strokeWidth={i === 0 ? 4 : 2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
};

export default DeviceComponent;
