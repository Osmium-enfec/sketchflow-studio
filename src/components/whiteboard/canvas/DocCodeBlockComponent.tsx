import React, { useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-yaml';
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

// Detect language from file extension in title
const detectLanguage = (title: string): string => {
  const ext = title.split('.').pop()?.toLowerCase() || '';
  const map: Record<string, string> = {
    py: 'python', js: 'javascript', ts: 'typescript', jsx: 'jsx', tsx: 'tsx',
    css: 'css', html: 'markup', xml: 'markup', svg: 'markup',
    sh: 'bash', bash: 'bash', zsh: 'bash',
    json: 'json', java: 'java', c: 'c', cpp: 'cpp', h: 'c',
    go: 'go', rs: 'rust', rb: 'ruby', sql: 'sql',
    yml: 'yaml', yaml: 'yaml',
  };
  return map[ext] || 'javascript';
};

// Color themes for token types
const getTokenColor = (type: string, isDark: boolean): { color: string; bold: boolean; italic: boolean } => {
  if (isDark) {
    switch (type) {
      case 'keyword': return { color: '#c084fc', bold: true, italic: false };
      case 'builtin': return { color: '#67e8f9', bold: false, italic: false };
      case 'class-name': return { color: '#67e8f9', bold: false, italic: false };
      case 'function': return { color: '#60a5fa', bold: false, italic: false };
      case 'string': case 'template-string': return { color: '#fbbf24', bold: false, italic: false };
      case 'number': return { color: '#f472b6', bold: false, italic: false };
      case 'operator': return { color: '#94a3b8', bold: false, italic: false };
      case 'punctuation': return { color: '#94a3b8', bold: false, italic: false };
      case 'comment': case 'prolog': case 'doctype': case 'cdata':
        return { color: '#64748b', bold: false, italic: true };
      case 'boolean': case 'constant': return { color: '#f472b6', bold: false, italic: false };
      case 'decorator': case 'annotation': return { color: '#fbbf24', bold: false, italic: false };
      case 'attr-name': return { color: '#67e8f9', bold: false, italic: false };
      case 'attr-value': return { color: '#fbbf24', bold: false, italic: false };
      case 'tag': return { color: '#f87171', bold: false, italic: false };
      default: return { color: '#e2e8f0', bold: false, italic: false };
    }
  } else {
    switch (type) {
      case 'keyword': return { color: '#15803d', bold: true, italic: false };
      case 'builtin': return { color: '#0e7490', bold: false, italic: false };
      case 'class-name': return { color: '#1d4ed8', bold: false, italic: false };
      case 'function': return { color: '#7c3aed', bold: false, italic: false };
      case 'string': case 'template-string': return { color: '#b91c1c', bold: false, italic: false };
      case 'number': return { color: '#be185d', bold: false, italic: false };
      case 'operator': return { color: '#64748b', bold: false, italic: false };
      case 'punctuation': return { color: '#64748b', bold: false, italic: false };
      case 'comment': case 'prolog': case 'doctype': case 'cdata':
        return { color: '#94a3b8', bold: false, italic: true };
      case 'boolean': case 'constant': return { color: '#be185d', bold: false, italic: false };
      case 'decorator': case 'annotation': return { color: '#b45309', bold: false, italic: false };
      case 'attr-name': return { color: '#0e7490', bold: false, italic: false };
      case 'attr-value': return { color: '#b91c1c', bold: false, italic: false };
      case 'tag': return { color: '#15803d', bold: false, italic: false };
      default: return { color: '#1e293b', bold: false, italic: false };
    }
  }
};

interface TokenSegment {
  text: string;
  color: string;
  bold: boolean;
  italic: boolean;
}

// Flatten Prism tokens into simple segments
const flattenTokens = (tokens: (string | Prism.Token)[], isDark: boolean): TokenSegment[] => {
  const segments: TokenSegment[] = [];

  const processToken = (token: string | Prism.Token) => {
    if (typeof token === 'string') {
      const style = getTokenColor('plain', isDark);
      segments.push({ text: token, ...style });
    } else {
      const type = typeof token.type === 'string' ? token.type : 'plain';
      const style = getTokenColor(type, isDark);
      if (typeof token.content === 'string') {
        segments.push({ text: token.content, ...style });
      } else if (Array.isArray(token.content)) {
        // For nested tokens, use the parent type's color if children are strings
        token.content.forEach((child) => {
          if (typeof child === 'string') {
            segments.push({ text: child, ...style });
          } else {
            processToken(child);
          }
        });
      }
    }
  };

  tokens.forEach(processToken);
  return segments;
};

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

  const headerBg = isDark ? '#0C4B33' : '#ecfdf5';
  const headerBorder = isDark ? '#0C4B33' : '#d1fae5';
  const bodyBg = isDark ? '#0b2e1f' : '#f8faf9';
  const bodyBorder = isDark ? '#0C4B33' : '#e2e8f0';
  const headerText = isDark ? '#a7f3d0' : '#475569';
  const copyIconColor = isDark ? '#64748b' : '#94a3b8';
  const lineNumColor = isDark ? '#475569' : '#cbd5e1';

  const headerHeight = 36 * scale;
  const titleFontSize = Math.round(13 * scale);
  const codeFontSize = Math.round(13 * scale);
  const codeLineHeight = 20 * scale;
  const lineNumWidth = 32 * scale;
  const codePadLeft = 24 * scale + lineNumWidth;
  const codePadTop = headerHeight + 20 * scale;
  const rx = 8 * scale;
  const copyIconSize = 16 * scale;

  const lang = detectLanguage(codeTitle);
  const codeLines = codeContent.split('\n');

  // Tokenize each line with Prism
  const highlightedLines = useMemo(() => {
    const grammar = Prism.languages[lang];
    if (!grammar) {
      return codeLines.map((line) => [{ text: line, color: isDark ? '#e2e8f0' : '#1e293b', bold: false, italic: false }]);
    }
    return codeLines.map((line) => {
      if (!line.trim()) return [{ text: ' ', color: isDark ? '#e2e8f0' : '#1e293b', bold: false, italic: false }];
      const tokens = Prism.tokenize(line, grammar);
      return flattenTokens(tokens, isDark);
    });
  }, [codeContent, lang, isDark]);

  return (
    <g
      data-component-id={component.id}
      className="doccodeblock-component"
      onMouseDown={onMouseDown}
      style={{ cursor: 'grab' }}
    >
      {/* Body background */}
      <rect x={x} y={y} width={width} height={height} rx={rx} fill={bodyBg} stroke={bodyBorder} strokeWidth={1.5} className="code-body" />

      {/* Header bar */}
      <rect x={x} y={y} width={width} height={headerHeight} rx={rx} fill={headerBg} className="code-header" />
      <rect x={x} y={y + headerHeight - rx} width={width} height={rx} fill={headerBg} />
      <line x1={x} y1={y + headerHeight} x2={x + width} y2={y + headerHeight} stroke={headerBorder} strokeWidth={1} className="code-header-line" />

      {/* File name */}
      <text
        x={x + 24 * scale} y={y + headerHeight / 2 + titleFontSize * 0.35}
        fontFamily="'Courier New', monospace" fontSize={titleFontSize} fill={headerText}
        className="code-title-text" style={{ cursor: 'text' }}
        onDoubleClick={(e) => onDoubleClick(e, 'codeTitle')}
      >
        {codeTitle} ¶
      </text>

      {/* Copy icon */}
      <g className="code-copy-icon" transform={`translate(${x + width - 24 * scale - copyIconSize}, ${y + (headerHeight - copyIconSize) / 2})`}>
        <rect x={2 * scale} y={2 * scale} width={10 * scale} height={12 * scale} rx={1.5 * scale} fill="none" stroke={copyIconColor} strokeWidth={1.3 * scale} />
        <rect x={5 * scale} y={0} width={10 * scale} height={12 * scale} rx={1.5 * scale} fill={headerBg} stroke={copyIconColor} strokeWidth={1.3 * scale} />
      </g>

      {/* Code content with line numbers */}
      <g className="code-content-text" style={{ cursor: 'text' }} onDoubleClick={(e) => onDoubleClick(e as any, 'codeContent')}>
        {highlightedLines.map((segments, lineIdx) => {
          const lineY = y + codePadTop + lineIdx * codeLineHeight;
          if (lineY + codeFontSize > y + height - 10 * scale) return null;

          return (
            <g key={lineIdx} className="code-line">
              {/* Line number */}
              <text
                x={x + 24 * scale + lineNumWidth - 8 * scale}
                y={lineY}
                fontFamily="'Courier New', monospace"
                fontSize={codeFontSize}
                fill={lineNumColor}
                textAnchor="end"
              >
                {lineIdx + 1}
              </text>

              {/* Code tokens */}
              <text
                x={x + codePadLeft}
                y={lineY}
                fontFamily="'Courier New', monospace"
                fontSize={codeFontSize}
              >
                {segments.map((seg, segIdx) => (
                  <tspan
                    key={segIdx}
                    fill={seg.color}
                    fontWeight={seg.bold ? 700 : 400}
                    fontStyle={seg.italic ? 'italic' : 'normal'}
                  >
                    {seg.text}
                  </tspan>
                ))}
              </text>
            </g>
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
