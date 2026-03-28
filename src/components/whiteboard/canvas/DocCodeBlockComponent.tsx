import React from 'react';
import { WhiteboardComponent } from '@/store/whiteboardStore';

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent, field: 'codeTitle' | 'codeContent') => void;
  onResizeStart: (e: React.MouseEvent, handle: string) => void;
}

const BASE_WIDTH = 520;
const BASE_HEIGHT = 200;

const DocCodeBlockComponent: React.FC<Props> = ({ component, isSelected, onMouseDown, onDoubleClick, onResizeStart }) => {
  const {
    x, y,
    width = BASE_WIDTH,
    height = BASE_HEIGHT,
    codeTitle = 'polls/views.py',
    codeContent = 'from django.http import HttpResponse\n\ndef index(request):\n    return HttpResponse("Hello, world.")',
    variant = 'light',
  } = component.props;

  const isDark = variant === 'dark';
  const scale = width / BASE_WIDTH;

  // Colors
  const headerBg = isDark ? '#1e293b' : '#ecfdf5';
  const headerBorder = isDark ? '#334155' : '#d1fae5';
  const bodyBg = isDark ? '#0f172a' : '#f8faf9';
  const bodyBorder = isDark ? '#1e293b' : '#e2e8f0';
  const headerText = isDark ? '#94a3b8' : '#475569';
  const copyIconColor = isDark ? '#64748b' : '#94a3b8';

  // Code syntax colors
  const keywordColor = isDark ? '#c084fc' : '#15803d'; // from, import, def, return
  const stringColor = isDark ? '#fbbf24' : '#b91c1c';
  const moduleColor = isDark ? '#60a5fa' : '#1d4ed8';
  const normalColor = isDark ? '#e2e8f0' : '#1e293b';

  const headerHeight = 36 * scale;
  const titleFontSize = Math.round(13 * scale);
  const codeFontSize = Math.round(13 * scale);
  const codeLineHeight = 20 * scale;
  const codePadLeft = 24 * scale;
  const codePadTop = headerHeight + 20 * scale;
  const rx = 8 * scale;

  // Parse code lines
  const codeLines = codeContent.split('\n');

  // Simple syntax highlighting - returns array of {text, color} segments
  const highlightLine = (line: string): { text: string; color: string }[] => {
    const segments: { text: string; color: string }[] = [];
    const keywords = ['from', 'import', 'def', 'return', 'class', 'if', 'else', 'for', 'while', 'in', 'not', 'and', 'or', 'True', 'False', 'None', 'with', 'as', 'try', 'except', 'finally', 'raise', 'pass', 'break', 'continue', 'lambda', 'yield', 'print', 'const', 'let', 'var', 'function', 'export', 'default'];

    // Match strings
    const stringRegex = /(["'])(?:(?=(\\?))\2.)*?\1/g;
    let lastIdx = 0;
    let match;
    const parts: { start: number; end: number; text: string; type: 'string' | 'normal' }[] = [];

    while ((match = stringRegex.exec(line)) !== null) {
      if (match.index > lastIdx) {
        parts.push({ start: lastIdx, end: match.index, text: line.slice(lastIdx, match.index), type: 'normal' });
      }
      parts.push({ start: match.index, end: match.index + match[0].length, text: match[0], type: 'string' });
      lastIdx = match.index + match[0].length;
    }
    if (lastIdx < line.length) {
      parts.push({ start: lastIdx, end: line.length, text: line.slice(lastIdx), type: 'normal' });
    }
    if (parts.length === 0 && line.length > 0) {
      parts.push({ start: 0, end: line.length, text: line, type: 'normal' });
    }

    parts.forEach((part) => {
      if (part.type === 'string') {
        segments.push({ text: part.text, color: stringColor });
      } else {
        // Tokenize normal text for keywords
        const wordRegex = /(\b\w+\b|[^\w\s]+|\s+)/g;
        let wordMatch;
        while ((wordMatch = wordRegex.exec(part.text)) !== null) {
          const word = wordMatch[0];
          if (keywords.includes(word)) {
            segments.push({ text: word, color: keywordColor });
          } else if (/^[A-Z][a-zA-Z]*$/.test(word)) {
            segments.push({ text: word, color: moduleColor });
          } else {
            segments.push({ text: word, color: normalColor });
          }
        }
      }
    });

    return segments.length > 0 ? segments : [{ text: line, color: normalColor }];
  };

  // Copy icon dimensions
  const copyIconSize = 16 * scale;

  return (
    <g
      data-component-id={component.id}
      className="doccodeblock-component"
      onMouseDown={onMouseDown}
      style={{ cursor: 'grab' }}
    >
      {/* Body background */}
      <rect
        x={x} y={y} width={width} height={height} rx={rx}
        fill={bodyBg} stroke={bodyBorder} strokeWidth={1.5}
        className="code-body"
      />

      {/* Header bar */}
      <rect
        x={x} y={y} width={width} height={headerHeight} rx={rx}
        fill={headerBg}
        className="code-header"
      />
      {/* Bottom edge of header (square off rounded corners) */}
      <rect
        x={x} y={y + headerHeight - rx} width={width} height={rx}
        fill={headerBg}
      />
      {/* Header bottom border */}
      <line
        x1={x} y1={y + headerHeight} x2={x + width} y2={y + headerHeight}
        stroke={headerBorder} strokeWidth={1}
        className="code-header-line"
      />

      {/* File name / title */}
      <text
        x={x + codePadLeft} y={y + headerHeight / 2 + titleFontSize * 0.35}
        fontFamily="'Courier New', monospace"
        fontSize={titleFontSize} fill={headerText}
        className="code-title-text" style={{ cursor: 'text' }}
        onDoubleClick={(e) => onDoubleClick(e, 'codeTitle')}
      >
        {codeTitle} ¶
      </text>

      {/* Copy icon */}
      <g className="code-copy-icon" transform={`translate(${x + width - codePadLeft - copyIconSize}, ${y + (headerHeight - copyIconSize) / 2})`}>
        <rect x={2 * scale} y={2 * scale} width={10 * scale} height={12 * scale} rx={1.5 * scale} fill="none" stroke={copyIconColor} strokeWidth={1.3 * scale} />
        <rect x={5 * scale} y={0} width={10 * scale} height={12 * scale} rx={1.5 * scale} fill={headerBg} stroke={copyIconColor} strokeWidth={1.3 * scale} />
      </g>

      {/* Code content */}
      <g className="code-content-text" style={{ cursor: 'text' }} onDoubleClick={(e) => onDoubleClick(e as any, 'codeContent')}>
        {codeLines.map((line, lineIdx) => {
          const lineY = y + codePadTop + lineIdx * codeLineHeight;
          if (lineY + codeFontSize > y + height - 10 * scale) return null;
          const segments = highlightLine(line);

          return (
            <text
              key={lineIdx}
              x={x + codePadLeft}
              y={lineY}
              fontFamily="'Courier New', monospace"
              fontSize={codeFontSize}
              className="code-line"
            >
              {segments.map((seg, segIdx) => (
                <tspan key={segIdx} fill={seg.color} fontWeight={['from', 'import', 'def', 'return', 'class', 'function', 'const', 'let', 'var', 'export'].includes(seg.text.trim()) ? 700 : 400}>
                  {seg.text}
                </tspan>
              ))}
            </text>
          );
        })}
      </g>

      {/* Selection */}
      {isSelected && (
        <>
          <rect x={x - 2} y={y - 2} width={width + 4} height={height + 4} fill="none" stroke="hsl(217 91% 60%)" strokeWidth={2} strokeDasharray="6 3" rx={rx + 2} />
          {['nw', 'ne', 'sw', 'se'].map((handle) => {
            const hx = handle.includes('e') ? x + width : x;
            const hy = handle.includes('s') ? y + height : y;
            return (
              <rect key={handle} x={hx - 5} y={hy - 5} width={10} height={10} rx={2} fill="white" stroke="hsl(217 91% 60%)" strokeWidth={2}
                style={{ cursor: `${handle}-resize` }} onMouseDown={(e) => onResizeStart(e, handle)} />
            );
          })}
        </>
      )}
    </g>
  );
};

export default DocCodeBlockComponent;
