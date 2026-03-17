import React from 'react';
import { WhiteboardComponent } from '@/store/whiteboardStore';

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onResizeStart: (e: React.MouseEvent, handle: string) => void;
}

const CodeBoxComponent: React.FC<Props> = ({ component, isSelected, onMouseDown, onResizeStart }) => {
  const { x, y, width, height } = component.props;
  const r = 16;
  const dotR = 10;
  const dotY = y + 24;
  const dotStartX = x + 24;
  const dotGap = 28;

  return (
    <g
      data-component-id={component.id}
      onMouseDown={onMouseDown}
      style={{ cursor: 'grab' }}
    >
      {/* Main body - dark rounded rect */}
      <rect
        className="codebox-body"
        x={x}
        y={y}
        width={width}
        height={height}
        rx={r}
        ry={r}
        fill="hsl(220 20% 18%)"
        stroke="hsl(220 15% 28%)"
        strokeWidth={2}
      />

      {/* Traffic light dots */}
      <circle
        className="codebox-dot codebox-dot-red"
        cx={dotStartX}
        cy={dotY}
        r={dotR}
        fill="hsl(0 80% 58%)"
      />
      <circle
        className="codebox-dot codebox-dot-yellow"
        cx={dotStartX + dotGap}
        cy={dotY}
        r={dotR}
        fill="hsl(45 90% 55%)"
      />
      <circle
        className="codebox-dot codebox-dot-green"
        cx={dotStartX + dotGap * 2}
        cy={dotY}
        r={dotR}
        fill="hsl(130 55% 48%)"
      />

      {/* Selection outline */}
      {isSelected && (
        <>
          <rect
            x={x - 2}
            y={y - 2}
            width={width + 4}
            height={height + 4}
            rx={r + 2}
            ry={r + 2}
            fill="none"
            stroke="hsl(217 91% 60%)"
            strokeWidth={2}
            strokeDasharray="6 3"
          />
          {/* Resize handles */}
          {['nw', 'ne', 'sw', 'se'].map((handle) => {
            const hx = handle.includes('e') ? x + width : x;
            const hy = handle.includes('s') ? y + height : y;
            return (
              <rect
                key={handle}
                x={hx - 5}
                y={hy - 5}
                width={10}
                height={10}
                fill="hsl(0 0% 100%)"
                stroke="hsl(217 91% 60%)"
                strokeWidth={2}
                rx={2}
                style={{ cursor: `${handle}-resize` }}
                onMouseDown={(e) => onResizeStart(e, handle)}
              />
            );
          })}
        </>
      )}
    </g>
  );
};

export default CodeBoxComponent;
