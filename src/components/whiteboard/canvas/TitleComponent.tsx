import React, { useEffect, useRef } from 'react';
import { WhiteboardComponent } from '@/store/whiteboardStore';

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  isEditing: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent) => void;
}

const TitleComponent: React.FC<Props> = ({ component, isSelected, onMouseDown, onDoubleClick }) => {
  const { text, x, y, fontSize = 42 } = component.props;
  const textRef = useRef<SVGTextElement>(null);
  const [bbox, setBbox] = React.useState({ width: 0, height: 0 });

  useEffect(() => {
    if (textRef.current) {
      const b = textRef.current.getBBox();
      setBbox({ width: b.width, height: b.height });
    }
  }, [text, fontSize]);

  return (
    <g
      data-component-id={component.id}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      style={{ cursor: 'move' }}
    >
      {isSelected && (
        <rect
          x={x - 10}
          y={y - bbox.height - 5}
          width={bbox.width + 20}
          height={bbox.height + 15}
          fill="none"
          stroke="hsl(210 80% 70%)"
          strokeWidth="2"
          strokeDasharray="6 3"
          rx="4"
        />
      )}
      <text
        ref={textRef}
        x={x}
        y={y}
        className="title-text"
        fontFamily="'Patrick Hand', cursive"
        fontSize={fontSize}
        fill="hsl(var(--foreground))"
        data-full-text={text}
        style={{ userSelect: 'none' }}
      >
        {text}
      </text>
    </g>
  );
};

export default TitleComponent;
