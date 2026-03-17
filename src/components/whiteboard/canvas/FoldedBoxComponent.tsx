import React from 'react';
import { WhiteboardComponent } from '@/store/whiteboardStore';

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  isEditing: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent) => void;
  onResizeStart: (e: React.MouseEvent, handle: string) => void;
}

const FoldedBoxComponent: React.FC<Props> = ({ component, isSelected, isEditing, onMouseDown, onDoubleClick, onResizeStart }) => {
  const { x, y, width, height, text, fontSize: customFontSize } = component.props;
  const fold = 30; // fold size

  const autoFontSize = Math.max(12, Math.min(width, height) * 0.15);
  const fontSize = customFontSize || Math.round(autoFontSize);
  const handleSize = 8;

  // Main body path (rectangle minus top-right corner)
  const bodyPath = `M${x},${y} L${x + width - fold},${y} L${x + width},${y + fold} L${x + width},${y + height} L${x},${y + height} Z`;
  // Fold triangle
  const foldPath = `M${x + width - fold},${y} L${x + width - fold},${y + fold} L${x + width},${y + fold}`;

  return (
    <g
      data-component-id={component.id}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      style={{ cursor: 'move' }}
    >
      {isSelected && (
        <>
          <rect
            x={x - 4} y={y - 4}
            width={width + 8} height={height + 8}
            fill="none" stroke="hsl(210 80% 70%)" strokeWidth="2" strokeDasharray="6 3" rx="2"
          />
          <rect x={x + width - handleSize / 2} y={y + height - handleSize / 2} width={handleSize} height={handleSize}
            fill="hsl(210 80% 70%)" stroke="white" strokeWidth="1" rx="2"
            style={{ cursor: 'nwse-resize' }}
            onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, 'se'); }}
          />
          <rect x={x - handleSize / 2} y={y + height - handleSize / 2} width={handleSize} height={handleSize}
            fill="hsl(210 80% 70%)" stroke="white" strokeWidth="1" rx="2"
            style={{ cursor: 'nesw-resize' }}
            onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, 'sw'); }}
          />
          <rect x={x - handleSize / 2} y={y - handleSize / 2} width={handleSize} height={handleSize}
            fill="hsl(210 80% 70%)" stroke="white" strokeWidth="1" rx="2"
            style={{ cursor: 'nwse-resize' }}
            onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, 'nw'); }}
          />
        </>
      )}
      {/* Body fill */}
      <path
        d={bodyPath}
        fill="hsl(0 0% 98%)"
        stroke="hsl(0 0% 15%)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        className="foldedbox-body"
      />
      {/* Fold crease */}
      <path
        d={foldPath}
        fill="hsl(0 0% 90%)"
        stroke="hsl(0 0% 15%)"
        strokeWidth="2"
        strokeLinejoin="round"
        className="foldedbox-fold"
      />
      {/* Text */}
      <text
        x={x + width / 2}
        y={y + height / 2 + fontSize * 0.35}
        textAnchor="middle"
        fontFamily="'Patrick Hand', cursive"
        fontSize={fontSize}
        fill="hsl(0 0% 15%)"
        data-full-text={text}
        style={{ userSelect: 'none' }}
      >
        {text}
      </text>
    </g>
  );
};

export default FoldedBoxComponent;
