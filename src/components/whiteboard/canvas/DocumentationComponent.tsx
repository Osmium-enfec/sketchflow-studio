import React from 'react';
import { WhiteboardComponent } from '@/store/whiteboardStore';

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onResizeStart: (e: React.MouseEvent, handle: string) => void;
}

// A4 ratio: 210mm x 297mm ≈ 0.707 aspect ratio
const A4_WIDTH = 420;
const A4_HEIGHT = 594;

const DocumentationComponent: React.FC<Props> = ({ component, isSelected, onMouseDown, onResizeStart }) => {
  const { x, y, width = A4_WIDTH, height = A4_HEIGHT, variant = 'white' } = component.props;
  const isDark = variant === 'black';

  const bgColor = isDark ? '#1a1a2e' : '#ffffff';
  const borderColor = isDark ? '#333355' : '#d4d4d8';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#64748b' : '#94a3b8';
  const lineColor = isDark ? '#2d2d4a' : '#e2e8f0';
  const accentColor = isDark ? '#818cf8' : '#6366f1';

  // Sketch-style slight randomness for hand-drawn feel
  const jitter = (v: number, amount = 1.5) => v + (Math.sin(v * 7.3) * amount);

  return (
    <g
      data-component-id={component.id}
      className="documentation-component"
      onMouseDown={onMouseDown}
      style={{ cursor: 'grab' }}
    >
      {/* Shadow */}
      <rect
        x={x + 4}
        y={y + 4}
        width={width}
        height={height}
        rx={4}
        fill="rgba(0,0,0,0.08)"
        className="doc-shadow"
      />

      {/* Page background */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={3}
        fill={bgColor}
        stroke={borderColor}
        strokeWidth={1.5}
        className="doc-page"
      />

      {/* Header area */}
      <rect
        x={x}
        y={y}
        width={width}
        height={48}
        rx={3}
        fill={isDark ? '#16163a' : '#f8fafc'}
        className="doc-header"
      />
      <line
        x1={x}
        y1={y + 48}
        x2={x + width}
        y2={y + 48}
        stroke={lineColor}
        strokeWidth={1}
        className="doc-header-line"
      />

      {/* Doc icon - small page icon */}
      <g className="doc-icon" transform={`translate(${x + 16}, ${y + 12})`}>
        <rect width={16} height={20} rx={2} fill="none" stroke={accentColor} strokeWidth={1.5} />
        <line x1={4} y1={7} x2={12} y2={7} stroke={accentColor} strokeWidth={1} />
        <line x1={4} y1={11} x2={10} y2={11} stroke={accentColor} strokeWidth={1} />
        <line x1={4} y1={15} x2={8} y2={15} stroke={accentColor} strokeWidth={1} />
      </g>

      {/* Title text */}
      <text
        x={x + 42}
        y={y + 30}
        fontFamily="'Patrick Hand', cursive"
        fontSize={16}
        fontWeight={700}
        fill={textColor}
        className="doc-title-text"
      >
        Documentation
      </text>

      {/* Content lines - simulating text */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={`heading-${i}`} className="doc-content-line">
          {i === 0 && (
            <>
              {/* Section heading */}
              <rect
                x={x + 24}
                y={y + 72}
                width={width * 0.5}
                height={10}
                rx={2}
                fill={accentColor}
                opacity={0.15}
                className="doc-heading-bg"
              />
              <line
                x1={x + 24}
                y1={y + 86}
                x2={jitter(x + 24 + width * 0.5)}
                y2={y + 86}
                stroke={accentColor}
                strokeWidth={2}
                strokeLinecap="round"
                className="doc-heading-underline"
              />
            </>
          )}
        </g>
      ))}

      {/* Body text lines */}
      {Array.from({ length: 12 }).map((_, i) => {
        const lineY = y + 100 + i * 22;
        const lineWidth = width * (0.6 + Math.sin(i * 2.7) * 0.2);
        if (lineY + 10 > y + height - 40) return null;
        return (
          <rect
            key={`line-${i}`}
            x={x + 24}
            y={lineY}
            width={lineWidth}
            height={6}
            rx={3}
            fill={mutedColor}
            opacity={0.3}
            className="doc-text-line"
          />
        );
      })}

      {/* Code block area */}
      <rect
        x={x + 24}
        y={y + height * 0.6}
        width={width - 48}
        height={60}
        rx={6}
        fill={isDark ? '#0f0f23' : '#f1f5f9'}
        stroke={isDark ? '#2d2d4a' : '#cbd5e1'}
        strokeWidth={1}
        className="doc-code-block"
      />
      {[0, 1, 2].map((i) => (
        <rect
          key={`code-${i}`}
          x={x + 36}
          y={y + height * 0.6 + 12 + i * 16}
          width={(width - 72) * (0.5 + Math.sin(i * 4.1) * 0.25)}
          height={5}
          rx={2.5}
          fill={isDark ? '#818cf8' : '#6366f1'}
          opacity={0.25}
          className="doc-code-line"
        />
      ))}

      {/* Footer */}
      <line
        x1={x + 24}
        y1={y + height - 32}
        x2={x + width - 24}
        y2={y + height - 32}
        stroke={lineColor}
        strokeWidth={0.5}
        className="doc-footer-line"
      />
      <text
        x={x + width / 2}
        y={y + height - 14}
        fontFamily="'Patrick Hand', cursive"
        fontSize={10}
        fill={mutedColor}
        textAnchor="middle"
        className="doc-footer-text"
      >
        Page 1
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
            rx={5}
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

export default DocumentationComponent;
