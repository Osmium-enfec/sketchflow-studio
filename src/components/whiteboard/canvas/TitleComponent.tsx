import React, { useEffect, useRef, useState } from 'react';
import { WhiteboardComponent } from '@/store/whiteboardStore';
import { textToSVGPaths, CharPath } from '@/utils/textToPath';

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  isEditing: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent) => void;
}

const TitleComponent: React.FC<Props> = ({ component, isSelected, onMouseDown, onDoubleClick }) => {
  const { text, x, y, fontSize = 42 } = component.props;
  const [charPaths, setCharPaths] = useState<CharPath[]>([]);
  const [totalWidth, setTotalWidth] = useState(0);

  useEffect(() => {
    let cancelled = false;
    textToSVGPaths(text || '', x, y, fontSize).then((paths) => {
      if (cancelled) return;
      setCharPaths(paths);
      if (paths.length > 0) {
        const last = paths[paths.length - 1];
        setTotalWidth(last.advanceWidth + (parseFloat(last.pathData.split(' ')[1]) || 0) - x + 20);
      }
    });
    return () => { cancelled = true; };
  }, [text, x, y, fontSize]);

  // Estimate total width from char paths
  const estimatedWidth = charPaths.length > 0 ? totalWidth : (text?.length || 5) * fontSize * 0.6;

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
          y={y - fontSize - 5}
          width={estimatedWidth + 20}
          height={fontSize + 20}
          fill="none"
          stroke="hsl(210 80% 70%)"
          strokeWidth="2"
          strokeDasharray="6 3"
          rx="4"
        />
      )}
      {/* Fill paths (visible after animation) */}
      {charPaths.map((cp) => (
        <path
          key={`fill-${cp.index}`}
          className="title-char-fill"
          d={cp.pathData}
          fill="hsl(var(--foreground))"
          stroke="none"
        />
      ))}
      {/* Stroke paths (for animation tracing) */}
      {charPaths.map((cp) => (
        <path
          key={`stroke-${cp.index}`}
          className={`title-char title-char-${cp.index}`}
          d={cp.pathData}
          fill="none"
          stroke="hsl(var(--foreground))"
          strokeWidth="1.5"
        />
      ))}
    </g>
  );
};

export default TitleComponent;
