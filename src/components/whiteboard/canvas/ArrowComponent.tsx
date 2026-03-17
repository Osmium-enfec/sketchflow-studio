import React from 'react';
import { WhiteboardComponent } from '@/store/whiteboardStore';

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

const ArrowComponent: React.FC<Props> = ({ component, isSelected, onMouseDown }) => {
  const { startX, startY, endX, endY } = component.props;

  // Calculate arrowhead
  const angle = Math.atan2(endY - startY, endX - startX);
  const headLen = 20;
  const ax1 = endX - headLen * Math.cos(angle - Math.PI / 6);
  const ay1 = endY - headLen * Math.sin(angle - Math.PI / 6);
  const ax2 = endX - headLen * Math.cos(angle + Math.PI / 6);
  const ay2 = endY - headLen * Math.sin(angle + Math.PI / 6);

  // Slight curve for hand-drawn feel
  const midX = (startX + endX) / 2 + (Math.random() * 4 - 2);
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
          <circle cx={startX} cy={startY} r="8" fill="none" stroke="hsl(210 80% 70%)" strokeWidth="2" />
          <circle cx={endX} cy={endY} r="8" fill="none" stroke="hsl(210 80% 70%)" strokeWidth="2" />
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
