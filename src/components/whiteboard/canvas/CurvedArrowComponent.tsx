import React from 'react';
import { WhiteboardComponent } from '@/store/whiteboardStore';

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onEndpointDrag: (e: React.MouseEvent, endpoint: 'start' | 'end') => void;
}

const CurvedArrowComponent: React.FC<Props> = ({ component, isSelected, onMouseDown, onEndpointDrag }) => {
  const { startX, startY, endX, endY } = component.props;

  // Create a nice curve — control point offset perpendicular to the line
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const dx = endX - startX;
  const dy = endY - startY;
  const len = Math.sqrt(dx * dx + dy * dy);
  // Perpendicular offset for curvature
  const curvature = len * 0.4;
  const nx = -dy / (len || 1);
  const ny = dx / (len || 1);
  const cpX = midX + nx * curvature;
  const cpY = midY + ny * curvature;

  // Arrowhead at end, tangent to curve
  const t = 0.95;
  const tangentX = 2 * (1 - t) * (cpX - startX) + 2 * t * (endX - cpX);
  const tangentY = 2 * (1 - t) * (cpY - startY) + 2 * t * (endY - cpY);
  const angle = Math.atan2(tangentY, tangentX);
  const headLen = 14;
  const ax1 = endX - headLen * Math.cos(angle - Math.PI / 5);
  const ay1 = endY - headLen * Math.sin(angle - Math.PI / 5);
  const ax2 = endX - headLen * Math.cos(angle + Math.PI / 5);
  const ay2 = endY - headLen * Math.sin(angle + Math.PI / 5);

  const pathD = `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`;

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
        stroke="hsl(220 50% 25%)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <polygon
        points={`${endX},${endY} ${ax1},${ay1} ${ax2},${ay2}`}
        fill="hsl(220 50% 25%)"
      />
    </g>
  );
};

export default CurvedArrowComponent;
