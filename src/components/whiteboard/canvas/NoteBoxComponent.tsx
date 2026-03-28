import React from 'react';
import { WhiteboardComponent } from '@/store/whiteboardStore';

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent, field: 'noteTitle' | 'noteContent') => void;
  onResizeStart: (e: React.MouseEvent, handle: string) => void;
}

const BASE_WIDTH = 460;
const BASE_HEIGHT = 140;

const NoteBoxComponent: React.FC<Props> = ({ component, isSelected, onMouseDown, onDoubleClick, onResizeStart }) => {
  const {
    x, y,
    width = BASE_WIDTH,
    height = BASE_HEIGHT,
    noteTitle = 'Note',
    noteContent = 'Your note content goes here.',
    variant = 'light',
  } = component.props;

  const isDark = variant === 'dark';
  const scale = width / BASE_WIDTH;

  const bgColor = isDark ? '#1a2e1a' : '#f0fdf4';
  const borderColor = isDark ? '#2d4a2d' : '#bbf7d0';
  const leftBarColor = isDark ? '#22c55e' : '#16a34a';
  const titleColor = isDark ? '#bbf7d0' : '#14532d';
  const contentColor = isDark ? '#86efac' : '#166534';
  const iconColor = isDark ? '#4ade80' : '#15803d';

  const titleFontSize = Math.round(16 * scale);
  const contentFontSize = Math.round(13 * scale);
  const iconScale = scale;
  const barWidth = Math.max(4, 5 * scale);
  const padLeft = 24 * scale;
  const padIcon = 20 * scale;
  const iconAreaWidth = 28 * scale;
  const titleX = x + padIcon + iconAreaWidth;
  const titleY = y + 32 * scale;
  const contentY = y + 58 * scale;
  const lineHeight = 18 * scale;

  const wrapText = (text: string, fontSize: number, maxWidth: number): string[] => {
    const avgCharWidth = fontSize * 0.48;
    const charsPerLine = Math.floor(maxWidth / avgCharWidth);
    if (charsPerLine <= 0) return [text];
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (testLine.length > charsPerLine && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const contentLines = wrapText(noteContent, contentFontSize, width - padLeft * 2 - 20);

  return (
    <g
      data-component-id={component.id}
      className="notebox-component"
      onMouseDown={onMouseDown}
      style={{ cursor: 'grab' }}
    >
      {/* Main background */}
      <rect x={x} y={y} width={width} height={height} rx={8 * scale} fill={bgColor} stroke={borderColor} strokeWidth={1.5} className="note-bg" />

      {/* Left accent bar */}
      <rect x={x} y={y} width={barWidth} height={height} fill={leftBarColor} className="note-left-bar" />
      <rect x={x} y={y} width={barWidth + 3} height={height} fill={bgColor} clipPath="inset(0 3px 0 0)" />
      <rect x={x} y={y} width={barWidth} height={height} fill={leftBarColor} className="note-left-bar-overlay" />

      {/* Note icon */}
      <g className="note-icon" transform={`translate(${x + padIcon}, ${y + 16 * scale}) scale(${iconScale})`}>
        <rect x={0} y={0} width={18} height={22} rx={2} fill="none" stroke={iconColor} strokeWidth={1.8} />
        <path d="M12,0 L18,6 L12,6 Z" fill={iconColor} opacity={0.2} stroke={iconColor} strokeWidth={0.8} />
        <line x1={4} y1={10} x2={13} y2={10} stroke={iconColor} strokeWidth={1.2} strokeLinecap="round" />
        <line x1={4} y1={14} x2={11} y2={14} stroke={iconColor} strokeWidth={1.2} strokeLinecap="round" />
        <line x1={4} y1={18} x2={9} y2={18} stroke={iconColor} strokeWidth={1.2} strokeLinecap="round" />
      </g>

      {/* Title */}
      <text
        x={titleX} y={titleY}
        fontFamily="'Patrick Hand', cursive"
        fontSize={titleFontSize} fontWeight={700} fill={titleColor}
        className="note-title-text" style={{ cursor: 'text' }}
        onDoubleClick={(e) => onDoubleClick(e, 'noteTitle')}
      >
        {noteTitle}
      </text>

      {/* Content */}
      <text
        x={x + padLeft} y={contentY}
        fontFamily="'Patrick Hand', cursive"
        fontSize={contentFontSize} fill={contentColor}
        className="note-content-text" style={{ cursor: 'text' }}
        onDoubleClick={(e) => onDoubleClick(e, 'noteContent')}
      >
        {contentLines.map((line, i) => (
          <tspan key={i} x={x + padLeft} dy={i === 0 ? 0 : lineHeight}>{line}</tspan>
        ))}
      </text>

      {/* Selection */}
      {isSelected && (
        <>
          <rect x={x - 2} y={y - 2} width={width + 4} height={height + 4} fill="none" stroke="hsl(217 91% 60%)" strokeWidth={2} strokeDasharray="6 3" rx={10} />
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

export default NoteBoxComponent;
