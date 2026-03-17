import React, { useEffect, useRef } from 'react';
import { WhiteboardComponent } from '@/store/whiteboardStore';
import rough from 'roughjs';

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

const BoxComponent: React.FC<Props> = ({ component, isSelected, onMouseDown }) => {
  const { x, y, width, height, text } = component.props;
  const gRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!gRef.current) return;
    // Clear previous rough drawings
    const existing = gRef.current.querySelector('.rough-rect');
    if (existing) existing.remove();

    const svg = gRef.current.ownerSVGElement;
    if (!svg) return;

    const rc = rough.svg(svg);
    const rect = rc.rectangle(x, y, width, height, {
      roughness: 1.5,
      stroke: 'hsl(0 0% 7%)',
      strokeWidth: 2,
      fill: 'hsl(48 100% 95%)',
      fillStyle: 'solid',
    });
    rect.classList.add('rough-rect');
    // Insert before the text
    const textEl = gRef.current.querySelector('text');
    if (textEl) {
      gRef.current.insertBefore(rect, textEl);
    } else {
      gRef.current.appendChild(rect);
    }
  }, [x, y, width, height]);

  return (
    <g
      ref={gRef}
      data-component-id={component.id}
      onMouseDown={onMouseDown}
      style={{ cursor: 'move' }}
    >
      {isSelected && (
        <rect
          x={x - 4}
          y={y - 4}
          width={width + 8}
          height={height + 8}
          fill="none"
          stroke="hsl(210 80% 70%)"
          strokeWidth="2"
          strokeDasharray="6 3"
          rx="4"
        />
      )}
      <text
        x={x + width / 2}
        y={y + height / 2 + 6}
        textAnchor="middle"
        fontFamily="'Patrick Hand', cursive"
        fontSize="24"
        fill="hsl(0 0% 7%)"
        style={{ userSelect: 'none' }}
      >
        {text}
      </text>
    </g>
  );
};

export default BoxComponent;
