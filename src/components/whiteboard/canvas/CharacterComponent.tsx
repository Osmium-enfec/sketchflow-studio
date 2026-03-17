import React from 'react';
import { WhiteboardComponent } from '@/store/whiteboardStore';

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

// All paths drawn in a ~200x260 local coordinate space, then translated/scaled via transform
// Inspired by a simple doodle character: head, hair, glasses, smile, collar/body
const CHARACTER_PATHS = [
  // Head outline (oval)
  { d: 'M100,40 C145,40 170,70 170,120 C170,170 145,210 100,210 C55,210 30,170 30,120 C30,70 55,40 100,40 Z', label: 'head' },
  // Hair strokes (messy scribbles on top)
  { d: 'M60,55 C65,20 80,10 100,15 C110,8 125,12 130,20', label: 'hair1' },
  { d: 'M55,50 C60,25 75,5 95,10', label: 'hair2' },
  { d: 'M95,10 C115,2 135,15 140,35', label: 'hair3' },
  { d: 'M70,45 Q80,15 100,12 Q120,10 135,30', label: 'hair4' },
  { d: 'M65,52 Q75,28 90,18', label: 'hair5' },
  { d: 'M110,15 Q125,8 138,28', label: 'hair6' },
  // Left eye (glasses circle)
  { d: 'M65,110 C65,95 80,95 80,110 C80,125 65,125 65,110 Z', label: 'glass-left' },
  // Right eye (glasses circle)
  { d: 'M120,110 C120,95 135,95 135,110 C135,125 120,125 120,110 Z', label: 'glass-right' },
  // Glasses bridge
  { d: 'M80,108 L120,108', label: 'bridge' },
  // Left glasses arm
  { d: 'M65,108 L40,105', label: 'arm-left' },
  // Right glasses arm
  { d: 'M135,108 L160,105', label: 'arm-right' },
  // Left pupil dot
  { d: 'M73,112 C74,110 76,110 75,113 C74,114 72,114 73,112 Z', label: 'pupil-left' },
  // Right pupil dot
  { d: 'M127,112 C128,110 130,110 129,113 C128,114 126,114 127,112 Z', label: 'pupil-right' },
  // Smile
  { d: 'M80,150 Q100,170 120,150', label: 'smile' },
  // Collar left
  { d: 'M70,210 L55,255 L100,240', label: 'collar-left' },
  // Collar right
  { d: 'M130,210 L145,255 L100,240', label: 'collar-right' },
  // Body/shoulders hint
  { d: 'M55,255 Q30,260 15,270', label: 'shoulder-left' },
  { d: 'M145,255 Q170,260 185,270', label: 'shoulder-right' },
];

const CharacterComponent: React.FC<Props> = ({ component, isSelected, onMouseDown }) => {
  const { x, y, scale = 1 } = component.props;
  const w = 200 * scale;
  const h = 280 * scale;

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
      {CHARACTER_PATHS.map((p, i) => (
        <path
          key={i}
          d={p.d}
          className="character-stroke"
          fill="none"
          stroke="hsl(0 0% 15%)"
          strokeWidth={p.label.startsWith('pupil') ? 1.5 : 2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
};

export default CharacterComponent;
