import React from 'react';
import { WhiteboardComponent } from '@/store/whiteboardStore';

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent, field: 'noteTitle' | 'noteContent') => void;
  onResizeStart: (e: React.MouseEvent, handle: string) => void;
}

const NoteBoxComponent: React.FC<Props> = ({ component, isSelected, onMouseDown, onDoubleClick, onResizeStart }) => {
  const {
    x, y,
    width = 460,
    height = 140,
    noteTitle = 'Note',
    noteContent = 'Your note content goes here.',
  } = component.props;

  const bgColor = '#f0fdf4';
  const borderColor = '#bbf7d0';
  const leftBarColor = '#16a34a';
  const titleColor = '#14532d';
  const contentColor = '#166534';
  const iconColor = '#15803d';

  // Word wrap helper: split text into lines that fit within maxWidth
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

  const contentLines = wrapText(noteContent, 13, width - 80);
  const lineHeight = 18;

  return (
    <g
      data-component-id={component.id}
      className="notebox-component"
      onMouseDown={onMouseDown}
      style={{ cursor: 'grab' }}
    >
      {/* Main background */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        fill={bgColor}
        stroke={borderColor}
        strokeWidth={1.5}
        className="note-bg"
      />

      {/* Left accent bar */}
      <rect
        x={x}
        y={y}
        width={5}
        height={height}
        rx={2}
        fill={leftBarColor}
        className="note-left-bar"
      />
      {/* Fix top-left corner overlap */}
      <rect
        x={x}
        y={y}
        width={8}
        height={height}
        fill={bgColor}
        clipPath={`inset(0 3px 0 0)`}
      />
      <rect
        x={x}
        y={y}
        width={5}
        height={height}
        fill={leftBarColor}
        className="note-left-bar-overlay"
      />

      {/* Note icon - document/page icon */}
      <g className="note-icon" transform={`translate(${x + 20}, ${y + 16})`}>
        {/* Page body */}
        <rect x={0} y={0} width={18} height={22} rx={2} fill="none" stroke={iconColor} strokeWidth={1.8} />
        {/* Folded corner */}
        <path d={`M12,0 L18,6 L12,6 Z`} fill={iconColor} opacity={0.2} stroke={iconColor} strokeWidth={0.8} />
        {/* Text lines on page */}
        <line x1={4} y1={10} x2={13} y2={10} stroke={iconColor} strokeWidth={1.2} strokeLinecap="round" />
        <line x1={4} y1={14} x2={11} y2={14} stroke={iconColor} strokeWidth={1.2} strokeLinecap="round" />
        <line x1={4} y1={18} x2={9} y2={18} stroke={iconColor} strokeWidth={1.2} strokeLinecap="round" />
      </g>

      {/* Title text - editable */}
      <text
        x={x + 48}
        y={y + 32}
        fontFamily="'Patrick Hand', cursive"
        fontSize={16}
        fontWeight={700}
        fill={titleColor}
        className="note-title-text"
        style={{ cursor: 'text' }}
        onDoubleClick={(e) => onDoubleClick(e, 'noteTitle')}
      >
        {noteTitle}
      </text>

      {/* Content text - editable, with word wrap */}
      <text
        x={x + 24}
        y={y + 58}
        fontFamily="'Patrick Hand', cursive"
        fontSize={13}
        fill={contentColor}
        className="note-content-text"
        style={{ cursor: 'text' }}
        onDoubleClick={(e) => onDoubleClick(e, 'noteContent')}
      >
        {contentLines.map((line, i) => (
          <tspan key={i} x={x + 24} dy={i === 0 ? 0 : lineHeight}>
            {line}
          </tspan>
        ))}
      </text>

      {/* Selection outline & resize handles */}
      {isSelected && (
        <>
          <rect
            x={x - 2}
            y={y - 2}
            width={width + 4}
            height={height + 4}
            fill="none"
            stroke="hsl(217 91% 60%)"
            strokeWidth={2}
            strokeDasharray="6 3"
            rx={10}
          />
          {['nw', 'ne', 'sw', 'se'].map((handle) => {
            const hx = handle.includes('e') ? x + width : x;
            const hy = handle.includes('s') ? y + height : y;
            return (
              <rect
                key={handle}
                x={hx - 5}
                y={hy - 5}
                width={10}
                height={10}
                rx={2}
                fill="white"
                stroke="hsl(217 91% 60%)"
                strokeWidth={2}
                style={{ cursor: `${handle}-resize` }}
                onMouseDown={(e) => onResizeStart(e, handle)}
              />
            );
          })}
        </>
      )}
    </g>
  );
};

export default NoteBoxComponent;
