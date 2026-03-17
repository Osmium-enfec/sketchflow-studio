import React from 'react';
import { WhiteboardComponent } from '@/store/whiteboardStore';

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onResizeStart: (e: React.MouseEvent, handle: string) => void;
}

const HighlightComponent: React.FC<Props> = ({ component, isSelected, onMouseDown, onResizeStart }) => {
  const { x, y, width, height = 18, color = 'hsl(48 100% 67%)' } = component.props;
  const handleSize = 8;

  return (
    <g
      data-component-id={component.id}
      onMouseDown={onMouseDown}
      style={{ cursor: 'move' }}
    >
      {isSelected && (
        <>
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
          {/* Right edge resize */}
          <rect x={x + width - handleSize/2} y={y + height/2 - handleSize/2} width={handleSize} height={handleSize}
            fill="hsl(210 80% 70%)" stroke="white" strokeWidth="1" rx="2"
            style={{ cursor: 'ew-resize' }}
            onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, 'e'); }}
          />
          {/* Bottom edge resize */}
          <rect x={x + width/2 - handleSize/2} y={y + height - handleSize/2} width={handleSize} height={handleSize}
            fill="hsl(210 80% 70%)" stroke="white" strokeWidth="1" rx="2"
            style={{ cursor: 'ns-resize' }}
            onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, 's'); }}
          />
        </>
      )}
      <rect
        className="highlight-rect"
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        opacity="0.5"
        rx="3"
      />
    </g>
  );
};

export default HighlightComponent;
