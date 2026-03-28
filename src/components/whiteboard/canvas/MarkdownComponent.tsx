import React, { useEffect, useRef, useState, useCallback } from 'react';
import { WhiteboardComponent } from '@/store/whiteboardStore';
import { marked } from 'marked';

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  isEditing: boolean;
  editText?: string;
  onMouseDown: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent) => void;
  onResizeStart: (e: React.MouseEvent, handle: string) => void;
  onEditChange?: (text: string) => void;
  onEditCommit?: () => void;
}

const MarkdownComponent: React.FC<Props> = ({
  component, isSelected, isEditing, editText, onMouseDown, onDoubleClick, onResizeStart, onEditChange, onEditCommit,
}) => {
  const { x, y, width = 400, height = 300, markdownContent = '# Hello World\n\nWrite your **markdown** here.\n\n- Item 1\n- Item 2\n\n```\ncode block\n```', variant = 'light' } = component.props;
  const foreignRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDark = variant === 'dark';
  const bgColor = isDark ? '#1e1e2e' : '#ffffff';
  const textColor = isDark ? '#cdd6f4' : '#1e293b';
  const borderColor = isDark ? '#45475a' : '#e2e8f0';
  const headerColor = isDark ? '#313244' : '#f1f5f9';

  const renderedHTML = React.useMemo(() => {
    const content = isEditing ? (editText ?? markdownContent) : markdownContent;
    return marked.parse(content, { breaks: true, gfm: true }) as string;
  }, [isEditing, editText, markdownContent]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && onEditCommit) {
      onEditCommit();
    }
  }, [onEditCommit]);

  const handles = ['nw', 'ne', 'sw', 'se'];
  const handlePositions: Record<string, { cx: number; cy: number }> = {
    nw: { cx: x, cy: y },
    ne: { cx: x + width, cy: y },
    sw: { cx: x, cy: y + height },
    se: { cx: x + width, cy: y + height },
  };

  return (
    <g
      data-component-id={component.id}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      style={{ cursor: 'move' }}
    >
      {/* Background */}
      <rect x={x} y={y} width={width} height={height} rx={8} fill={bgColor} stroke={borderColor} strokeWidth={1.5} />

      {/* Content area */}
      <foreignObject x={x + 1} y={y + 1} width={width - 2} height={height - 2}>
        <div
          ref={foreignRef}
          style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={editText ?? markdownContent}
              onChange={(e) => onEditChange?.(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => onEditCommit?.()}
              style={{
                width: '100%',
                height: '100%',
                padding: '12px',
                backgroundColor: bgColor,
                color: textColor,
                border: 'none',
                outline: 'none',
                resize: 'none',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: '13px',
                lineHeight: '1.6',
              }}
            />
          ) : (
            <div
              style={{
                padding: '12px',
                color: textColor,
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                lineHeight: '1.6',
                overflow: 'hidden',
              }}
              className={`markdown-rendered${isDark ? ' markdown-dark' : ''}`}
              dangerouslySetInnerHTML={{ __html: renderedHTML }}
            />
          )}
        </div>
      </foreignObject>

      {/* Selection border */}
      {isSelected && (
        <>
          <rect x={x - 2} y={y - 2} width={width + 4} height={height + 4} fill="none" stroke="hsl(210 80% 70%)" strokeWidth={2} strokeDasharray="6 3" rx={10} />
          {handles.map((h) => (
            <rect
              key={h}
              x={handlePositions[h].cx - 5}
              y={handlePositions[h].cy - 5}
              width={10}
              height={10}
              rx={2}
              fill="white"
              stroke="hsl(210 80% 60%)"
              strokeWidth={2}
              style={{ cursor: `${h}-resize` }}
              onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, h); }}
            />
          ))}
        </>
      )}
    </g>
  );
};

export default MarkdownComponent;
