import React, { useEffect, useRef, useState } from 'react';
import { WhiteboardComponent } from '@/store/whiteboardStore';
import { textToSVGPaths, CharPath } from '@/utils/textToPath';
import rough from 'roughjs';

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  isEditing: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent) => void;
  onResizeStart: (e: React.MouseEvent, handle: string) => void;
}

const BoxComponent: React.FC<Props> = ({ component, isSelected, isEditing, onMouseDown, onDoubleClick, onResizeStart }) => {
  const { x, y, width, height, text, fontSize: customFontSize } = component.props;
  const gRef = useRef<SVGGElement>(null);
  const [charPaths, setCharPaths] = useState<CharPath[]>([]);

  const autoFontSize = Math.max(12, Math.min(width, height) * 0.18);
  const fontSize = customFontSize || Math.round(autoFontSize);

  // Generate rough.js rectangle
  useEffect(() => {
    if (!gRef.current) return;
    const existing = gRef.current.querySelector('.rough-rect');
    if (existing) existing.remove();

    const svg = gRef.current.ownerSVGElement;
    if (!svg) return;

    const rc = rough.svg(svg);
    const rect = rc.rectangle(x, y, width, height, {
      roughness: 1.5,
      stroke: 'hsl(0 0% 7%)',
      strokeWidth: 2,
      fill: 'hsl(48 100% 95%)',
      fillStyle: 'solid',
    });
    rect.classList.add('rough-rect');
    // Insert before text paths
    const firstPath = gRef.current.querySelector('.box-char-fill, .box-char');
    if (firstPath) {
      gRef.current.insertBefore(rect, firstPath);
    } else {
      gRef.current.appendChild(rect);
    }
  }, [x, y, width, height]);

  // Generate text paths centered in box
  useEffect(() => {
    if (!text) { setCharPaths([]); return; }
    let cancelled = false;
    // We need to estimate text width to center it
    const estimatedWidth = text.length * fontSize * 0.5;
    const textX = x + width / 2 - estimatedWidth / 2;
    const textY = y + height / 2 + fontSize * 0.35;

    textToSVGPaths(text, textX, textY, fontSize).then((paths) => {
      if (cancelled) return;
      setCharPaths(paths);
    });
    return () => { cancelled = true; };
  }, [text, x, y, width, height, fontSize]);

  const handleSize = 8;

  return (
    <g
      ref={gRef}
      data-component-id={component.id}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
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
            rx="4"
          />
          <rect x={x + width - handleSize/2} y={y + height - handleSize/2} width={handleSize} height={handleSize}
            fill="hsl(210 80% 70%)" stroke="white" strokeWidth="1" rx="2"
            style={{ cursor: 'nwse-resize' }}
            onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, 'se'); }}
          />
          <rect x={x - handleSize/2} y={y + height - handleSize/2} width={handleSize} height={handleSize}
            fill="hsl(210 80% 70%)" stroke="white" strokeWidth="1" rx="2"
            style={{ cursor: 'nesw-resize' }}
            onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, 'sw'); }}
          />
          <rect x={x + width - handleSize/2} y={y - handleSize/2} width={handleSize} height={handleSize}
            fill="hsl(210 80% 70%)" stroke="white" strokeWidth="1" rx="2"
            style={{ cursor: 'nesw-resize' }}
            onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, 'ne'); }}
          />
          <rect x={x - handleSize/2} y={y - handleSize/2} width={handleSize} height={handleSize}
            fill="hsl(210 80% 70%)" stroke="white" strokeWidth="1" rx="2"
            style={{ cursor: 'nwse-resize' }}
            onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, 'nw'); }}
          />
        </>
      )}
      {/* Fill paths (visible after animation) */}
      {charPaths.map((cp) => (
        <path
          key={`fill-${cp.index}`}
          className="box-char-fill"
          d={cp.pathData}
          fill="hsl(0 0% 7%)"
          stroke="none"
        />
      ))}
      {/* Stroke paths (for animation tracing) */}
      {charPaths.map((cp) => (
        <path
          key={`stroke-${cp.index}`}
          className={`box-char box-char-${cp.index}`}
          d={cp.pathData}
          fill="none"
          stroke="hsl(0 0% 7%)"
          strokeWidth="1.5"
        />
      ))}
    </g>
  );
};

export default BoxComponent;
