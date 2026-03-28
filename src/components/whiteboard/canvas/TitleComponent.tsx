import React, { useEffect, useRef, useMemo } from 'react';
import { WhiteboardComponent } from '@/store/whiteboardStore';
import { marked } from 'marked';

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  isEditing: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent) => void;
}

const TitleComponent: React.FC<Props> = ({ component, isSelected, onMouseDown, onDoubleClick }) => {
  const { text, x, y, fontSize = 42 } = component.props;
  const isContentType = component.type === 'content';
  const textRef = useRef<SVGTextElement>(null);
  const foreignRef = useRef<HTMLDivElement>(null);
  const [bbox, setBbox] = React.useState({ width: 0, height: 0 });

  // Content type always renders markdown; title only when markdown syntax detected
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

  // Estimate dimensions for markdown rendered content
  const contentWidth = component.props.width || 500;
  const lineCount = isContentType ? Math.max(3, (text || '').split('\n').length) : 1;
  const mdWidth = isContentType ? contentWidth : Math.max(200, (text || '').length * fontSize * 0.55);
  const mdHeight = isContentType ? Math.max(80, lineCount * fontSize * 1.4 + 40) : fontSize * 1.6;

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
      )}

      {hasMarkdown ? (
        <foreignObject x={x} y={y} width={mdWidth} height={mdHeight}>
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
              overflow: 'hidden',
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
