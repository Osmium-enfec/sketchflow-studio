import React from 'react';
import { WhiteboardComponent } from '@/store/whiteboardStore';

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onEndpointDrag: (e: React.MouseEvent, endpoint: 'start' | 'end') => void;
}

const GradientArrowComponent: React.FC<Props> = ({ component, isSelected, onMouseDown, onEndpointDrag }) => {
  const { startX, startY, endX, endY } = component.props;
  const gradId = `grad-arrow-${component.id}`;

  const angle = Math.atan2(endY - startY, endX - startX);
  const headLen = 28;
  const headWidth = 18;

  // Arrow shaft vector
  const dx = endX - startX;
  const dy = endY - startY;
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = -dy / len; // normal
  const ny = dx / len;

  const shaftW = 8;
  // Shaft end stops before the arrowhead
  const shaftEndX = endX - headLen * Math.cos(angle);
  const shaftEndY = endY - headLen * Math.sin(angle);

  // Arrowhead triangle points
  const ax1 = endX - headLen * Math.cos(angle - Math.PI / 5);
  const ay1 = endY - headLen * Math.sin(angle - Math.PI / 5);
  const ax2 = endX - headLen * Math.cos(angle + Math.PI / 5);
  const ay2 = endY - headLen * Math.sin(angle + Math.PI / 5);

  // Shaft polygon (thick rectangle along the line)
  const s1x = startX + nx * shaftW;
  const s1y = startY + ny * shaftW;
  const s2x = startX - nx * shaftW;
  const s2y = startY - ny * shaftW;
  const s3x = shaftEndX - nx * shaftW;
  const s3y = shaftEndY - ny * shaftW;
  const s4x = shaftEndX + nx * shaftW;
  const s4y = shaftEndY + ny * shaftW;

  const shaftPath = `M${s1x},${s1y} L${s4x},${s4y} L${s3x},${s3y} L${s2x},${s2y} Z`;
  const headPath = `M${ax1},${ay1} L${endX},${endY} L${ax2},${ay2} L${shaftEndX},${shaftEndY} Z`;

  return (
    <g
      data-component-id={component.id}
      onMouseDown={onMouseDown}
      style={{ cursor: 'move' }}
    >
      <defs>
        <linearGradient id={gradId} x1={startX} y1={startY} x2={endX} y2={endY} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="hsl(140 60% 65%)" />
          <stop offset="100%" stopColor="hsl(0 70% 70%)" />
        </linearGradient>
      </defs>
      {isSelected && (
        <>
          <circle cx={startX} cy={startY} r="12" fill="hsl(210 80% 70%)" fillOpacity="0.3" stroke="hsl(210 80% 70%)" strokeWidth="2"
            style={{ cursor: 'crosshair' }}
            onMouseDown={(e) => { e.stopPropagation(); onEndpointDrag(e, 'start'); }}
          />
          <circle cx={endX} cy={endY} r="12" fill="hsl(210 80% 70%)" fillOpacity="0.3" stroke="hsl(210 80% 70%)" strokeWidth="2"
            style={{ cursor: 'crosshair' }}
            onMouseDown={(e) => { e.stopPropagation(); onEndpointDrag(e, 'end'); }}
          />
        </>
      )}
      {/* Shaft */}
      <path
        className="gradient-arrow-shaft"
        d={shaftPath}
        fill={`url(#${gradId})`}
        stroke="hsl(0 0% 20%)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Arrowhead */}
      <path
        className="gradient-arrow-head"
        d={headPath}
        fill={`url(#${gradId})`}
        stroke="hsl(0 0% 20%)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </g>
  );
};

export default GradientArrowComponent;
