import React from 'react';
import { WhiteboardComponent } from '@/store/whiteboardStore';

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onEndpointDrag: (e: React.MouseEvent, endpoint: 'start' | 'end') => void;
}

const ArrowComponent: React.FC<Props> = ({ component, isSelected, onMouseDown, onEndpointDrag }) => {
  const { startX, startY, endX, endY } = component.props;

  const angle = Math.atan2(endY - startY, endX - startX);
  const headLen = 20;
  const ax1 = endX - headLen * Math.cos(angle - Math.PI / 6);
  const ay1 = endY - headLen * Math.sin(angle - Math.PI / 6);
  const ax2 = endX - headLen * Math.cos(angle + Math.PI / 6);
  const ay2 = endY - headLen * Math.sin(angle + Math.PI / 6);

  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2 - 15;

  const pathD = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;

  return (
    <g
      data-component-id={component.id}
      onMouseDown={onMouseDown}
      style={{ cursor: 'move' }}
    >
      {isSelected && (
        <>
          <circle cx={startX} cy={startY} r="10" fill="hsl(210 80% 70%)" fillOpacity="0.3" stroke="hsl(210 80% 70%)" strokeWidth="2"
            style={{ cursor: 'crosshair' }}
            onMouseDown={(e) => { e.stopPropagation(); onEndpointDrag(e, 'start'); }}
          />
          <circle cx={endX} cy={endY} r="10" fill="hsl(210 80% 70%)" fillOpacity="0.3" stroke="hsl(210 80% 70%)" strokeWidth="2"
            style={{ cursor: 'crosshair' }}
            onMouseDown={(e) => { e.stopPropagation(); onEndpointDrag(e, 'end'); }}
          />
        </>
      )}
      <path
        className="arrow-path"
        d={pathD}
        fill="none"
        stroke="hsl(0 0% 7%)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <polygon
        points={`${endX},${endY} ${ax1},${ay1} ${ax2},${ay2}`}
        fill="hsl(0 0% 7%)"
      />
    </g>
  );
};

export default ArrowComponent;
