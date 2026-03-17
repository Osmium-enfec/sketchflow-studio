import React from 'react';
import { WhiteboardComponent } from '@/store/whiteboardStore';

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

const TitleComponent: React.FC<Props> = ({ component, isSelected, onMouseDown }) => {
  const { text, x, y } = component.props;

  return (
    <g
      data-component-id={component.id}
      onMouseDown={onMouseDown}
      style={{ cursor: 'move' }}
    >
      {isSelected && (
        <rect
          x={x - 10}
          y={y - 45}
          width={text.length * 28 + 20}
          height={60}
          fill="none"
          stroke="hsl(210 80% 70%)"
          strokeWidth="2"
          strokeDasharray="6 3"
          rx="4"
        />
      )}
      <text
        x={x}
        y={y}
        className="title-text"
        fontFamily="'Patrick Hand', cursive"
        fontSize="42"
        fill="hsl(0 0% 7%)"
        style={{ userSelect: 'none' }}
      >
        {text}
      </text>
    </g>
  );
};

export default TitleComponent;
