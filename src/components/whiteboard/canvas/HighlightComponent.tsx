import React from 'react';
import { WhiteboardComponent } from '@/store/whiteboardStore';

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

const HighlightComponent: React.FC<Props> = ({ component, isSelected, onMouseDown }) => {
  const { x, y, width } = component.props;
  const height = 18;

  return (
    <g
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
          rx="2"
        />
      )}
      <rect
        className="highlight-rect"
        x={x}
        y={y}
        width={width}
        height={height}
        fill="hsl(48 100% 67%)"
        opacity="0.5"
        rx="3"
      />
    </g>
  );
};

export default HighlightComponent;
