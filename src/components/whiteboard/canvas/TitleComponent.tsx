import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { WhiteboardComponent, useWhiteboardStore } from '@/store/whiteboardStore';
import { marked } from 'marked';

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  isEditing: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent) => void;
  onResizeStart?: (e: React.MouseEvent, handle: string) => void;
}

const TitleComponent: React.FC<Props> = ({ component, isSelected, onMouseDown, onDoubleClick, onResizeStart }) => {
  const { text, x, y, fontSize = 42 } = component.props;
  const isContentType = component.type === 'content';
  const textRef = useRef<SVGTextElement>(null);
  const foreignRef = useRef<HTMLDivElement>(null);
  const [bbox, setBbox] = React.useState({ width: 0, height: 0 });
  const [measuredHeight, setMeasuredHeight] = React.useState(0);
  const updateComponentProps = useWhiteboardStore((s) => s.updateComponentProps);

  const hasMarkdown = useMemo(() => {
    if (isContentType) return true;
    return /[*_#`~\[\]!>|-]/.test(text || '');
  }, [text, isContentType]);

  const renderedHTML = useMemo(() => {
    if (!hasMarkdown) return '';
    if (isContentType) {
      return marked.parse(text || '', { breaks: true, gfm: true }) as string;
    }
    return marked.parseInline(text || '', { breaks: true, gfm: true }) as string;
  }, [text, hasMarkdown, isContentType]);

  useEffect(() => {
    if (!hasMarkdown && textRef.current) {
      const b = textRef.current.getBBox();
      setBbox({ width: b.width, height: b.height });
    }
  }, [text, fontSize, hasMarkdown]);

  // Measure actual rendered content height
  useEffect(() => {
    if (isContentType && foreignRef.current) {
      const measure = () => {
        if (foreignRef.current) {
          const h = foreignRef.current.scrollHeight;
          if (h > 0 && h !== measuredHeight) {
            setMeasuredHeight(h);
          }
        }
      };
      // Measure after render
      requestAnimationFrame(measure);
      // Also measure after a short delay for fonts loading
      const timer = setTimeout(measure, 100);
      return () => clearTimeout(timer);
    }
  }, [isContentType, text, fontSize, component.props.width, renderedHTML]);

  const contentWidth = component.props.width || 500;
  const contentHeight = component.props.height;
  const mdWidth = isContentType ? contentWidth : Math.max(200, (text || '').length * fontSize * 0.55);
  const autoHeight = Math.max(40, measuredHeight || 40);
  const mdHeight = isContentType
    ? (contentHeight ? Math.max(40, contentHeight) : autoHeight)
    : fontSize * 1.6;

  const selWidth = hasMarkdown ? mdWidth : bbox.width;
  const selHeight = hasMarkdown ? mdHeight : bbox.height;

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
            x={x - 10}
            y={hasMarkdown ? y - 5 : y - selHeight - 5}
            width={selWidth + 20}
            height={selHeight + 15}
            fill="none"
            stroke="hsl(210 80% 70%)"
            strokeWidth="2"
            strokeDasharray="6 3"
            rx="4"
          />
          {/* Corner and edge resize handles for content */}
          {isContentType && onResizeStart && (() => {
            const handles: { key: string; cx: number; cy: number; cursor: string }[] = [
              { key: 'nw', cx: x, cy: y, cursor: 'nw-resize' },
              { key: 'ne', cx: x + contentWidth, cy: y, cursor: 'ne-resize' },
              { key: 'sw', cx: x, cy: y + mdHeight, cursor: 'sw-resize' },
              { key: 'se', cx: x + contentWidth, cy: y + mdHeight, cursor: 'se-resize' },
            ];
            return handles.map((h) => (
              <rect
                key={h.key}
                x={h.cx - 5}
                y={h.cy - 5}
                width={10}
                height={10}
                rx={2}
                fill="white"
                stroke="hsl(210 80% 60%)"
                strokeWidth={2}
                style={{ cursor: h.cursor }}
                onMouseDown={(e) => { e.stopPropagation(); onResizeStart!(e, h.key); }}
              />
            ));
          })()}
        </>
      )}

      {hasMarkdown ? (
        <foreignObject x={x} y={y} width={mdWidth} height={Math.max(mdHeight, 30)}>
          <div
            ref={foreignRef}
            className="title-text markdown-rendered"
            style={{
              fontFamily: isContentType ? "'Inter', sans-serif" : "'Patrick Hand', cursive",
              fontSize: isContentType ? `${Math.round(fontSize * 0.45)}px` : `${fontSize}px`,
              color: component.props.color || 'hsl(220 15% 20%)',
              userSelect: 'none',
              lineHeight: 1.5,
              whiteSpace: isContentType ? 'normal' : 'nowrap',
            }}
            data-full-text={text}
            dangerouslySetInnerHTML={{ __html: renderedHTML }}
          />
        </foreignObject>
      ) : (
        <text
          ref={textRef}
          x={x}
          y={y}
          className="title-text"
          fontFamily="'Patrick Hand', cursive"
          fontSize={fontSize}
          fill={component.props.color || 'hsl(220 15% 20%)'}
          data-full-text={text}
          style={{ userSelect: 'none' }}
        >
          {text}
        </text>
      )}
    </g>
  );
};

export default TitleComponent;
