import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useWhiteboardStore } from '@/store/whiteboardStore';
import TitleComponent from './canvas/TitleComponent';
import BoxComponent from './canvas/BoxComponent';
import ArrowComponent from './canvas/ArrowComponent';
import HighlightComponent from './canvas/HighlightComponent';
import CharacterComponent from './canvas/CharacterComponent';
import IndianCharacterComponent from './canvas/IndianCharacterComponent';
import DeviceComponent from './canvas/DeviceComponent';
import GradientArrowComponent from './canvas/GradientArrowComponent';
import CurvedArrowComponent from './canvas/CurvedArrowComponent';
import FoldedBoxComponent from './canvas/FoldedBoxComponent';
import CodeBoxComponent from './canvas/CodeBoxComponent';
import OpenPeepComponent from './canvas/OpenPeepComponent';
import DocumentationComponent from './canvas/DocumentationComponent';
import NoteBoxComponent from './canvas/NoteBoxComponent';
import DocCodeBlockComponent from './canvas/DocCodeBlockComponent';
import MarkdownComponent from './canvas/MarkdownComponent';
import { NOTE_COLOR_THEMES } from './canvas/NoteBoxComponent';
import { playAnimation } from '@/timeline/timelineEngine';
import { exportPDF, exportMP4 } from '@/lib/canvasExport';
import { toast } from 'sonner';

const NOTE_COLOR_KEYS = Object.keys(NOTE_COLOR_THEMES);
const NOTE_SWATCH_COLORS: Record<string, string> = {
  green: '#16a34a', blue: '#2563eb', yellow: '#ca8a04', red: '#dc2626', purple: '#9333ea',
};

// A4 at 150 DPI ≈ 1240 × 1754
const CANVAS_PRESETS = {
  'whiteboard': { w: 1920, h: 1080, bg: 'hsl(43 100% 98%)', grid: true, gridColor: 'hsl(0 0% 85%)' },
  'doc-white': { w: 1240, h: 1754, bg: '#ffffff', grid: false, gridColor: 'transparent' },
  'doc-dark': { w: 1240, h: 1754, bg: '#1a1a2e', grid: false, gridColor: 'transparent' },
} as const;

const HIGHLIGHT_COLORS = [
  'hsl(48 100% 67%)',   // yellow
  'hsl(120 60% 67%)',   // green
  'hsl(200 80% 67%)',   // blue
  'hsl(340 80% 67%)',   // pink
  'hsl(25 100% 67%)',   // orange
  'hsl(280 60% 67%)',   // purple
];

const TITLE_COLORS = [
  'hsl(220 15% 20%)',   // dark (default)
  'hsl(217 91% 60%)',   // blue
  'hsl(0 80% 58%)',     // red
  'hsl(130 55% 40%)',   // green
  'hsl(280 60% 55%)',   // purple
  'hsl(25 100% 55%)',   // orange
];

const Canvas: React.FC = () => {
  const { components, selectedId, editingId, selectComponent, setEditingId, updateComponentProps, canvasType } = useWhiteboardStore();
  const preset = CANVAS_PRESETS[canvasType];
  const CANVAS_W = preset.w;
  const CANVAS_H = preset.h;
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const resizing = useRef<{ id: string; handle: string; startPt: { x: number; y: number }; startProps: Record<string, any> } | null>(null);
  const endpointDragging = useRef<{ id: string; endpoint: 'start' | 'end' } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [editText, setEditText] = useState('');
  const [editField, setEditField] = useState<string>('text'); // which prop field is being edited
  const [editPos, setEditPos] = useState<{ x: number; y: number; width: number } | null>(null);

  const zoomIn = () => setZoom((z) => Math.min(z + 0.15, 3));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.3));
  const zoomReset = () => setZoom(1);

  const getSVGPoint = useCallback((e: React.MouseEvent | MouseEvent) => {
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, id: string, compProps: any) => {
      e.stopPropagation();
      selectComponent(id);
      const pt = getSVGPoint(e);
      const cx = compProps.x ?? compProps.startX ?? 0;
      const cy = compProps.y ?? compProps.startY ?? 0;
      dragging.current = { id, offsetX: pt.x - cx, offsetY: pt.y - cy };
    },
    [getSVGPoint, selectComponent]
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      const comp = components.find((c) => c.id === id);
      if (!comp || (comp.type !== 'title' && comp.type !== 'box' && comp.type !== 'foldedBox' && comp.type !== 'codeBox' && comp.type !== 'documentation' && comp.type !== 'noteBox' && comp.type !== 'markdown')) return;
      setEditingId(id);
      setEditField('text');
      setEditText(comp.props.text || '');
      
      const svg = svgRef.current!;
      const rect = svg.getBoundingClientRect();
      const scaleX = rect.width / CANVAS_W;
      const scaleY = rect.height / CANVAS_H;
      
        if (comp.type === 'box' || comp.type === 'foldedBox' || comp.type === 'codeBox') {
        setEditPos({
          x: comp.props.x * scaleX + rect.left,
          y: comp.props.y * scaleY + rect.top,
          width: comp.props.width * scaleX,
        });
      } else {
        setEditPos({
          x: comp.props.x * scaleX + rect.left - 10,
          y: (comp.props.y - 45) * scaleY + rect.top,
          width: Math.max(200, comp.props.text.length * 28 * scaleX),
        });
      }
    },
    [components, setEditingId]
  );

  const commitEdit = useCallback(() => {
    if (editingId && editText.trim()) {
      updateComponentProps(editingId, { [editField]: editText });
    }
    setEditingId(null);
    setEditPos(null);
    setEditField('text');
  }, [editingId, editText, editField, updateComponentProps, setEditingId]);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, id: string, handle: string) => {
      e.stopPropagation();
      const pt = getSVGPoint(e);
      const comp = components.find((c) => c.id === id);
      if (!comp) return;
      resizing.current = { id, handle, startPt: pt, startProps: { ...comp.props } };
    },
    [getSVGPoint, components]
  );

  const handleEndpointDrag = useCallback(
    (e: React.MouseEvent, id: string, endpoint: 'start' | 'end') => {
      e.stopPropagation();
      endpointDragging.current = { id, endpoint };
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const pt = getSVGPoint(e);

      // Endpoint dragging for arrows
      if (endpointDragging.current) {
        const { id, endpoint } = endpointDragging.current;
        if (endpoint === 'start') {
          updateComponentProps(id, { startX: pt.x, startY: pt.y });
        } else {
          updateComponentProps(id, { endX: pt.x, endY: pt.y });
        }
        return;
      }

      // Resizing
      if (resizing.current) {
        const { id, handle, startPt, startProps } = resizing.current;
        const dx = pt.x - startPt.x;
        const dy = pt.y - startPt.y;
        const comp = components.find((c) => c.id === id);
        if (!comp) return;

        if (comp.type === 'box' || comp.type === 'foldedBox' || comp.type === 'codeBox' || comp.type === 'documentation' || comp.type === 'noteBox' || comp.type === 'docCodeBlock' || comp.type === 'markdown') {
          let newProps: any = {};
          if (handle === 'se') {
            newProps = { width: Math.max(60, startProps.width + dx), height: Math.max(40, startProps.height + dy) };
          } else if (handle === 'sw') {
            newProps = { x: startProps.x + dx, width: Math.max(60, startProps.width - dx), height: Math.max(40, startProps.height + dy) };
          } else if (handle === 'ne') {
            newProps = { y: startProps.y + dy, width: Math.max(60, startProps.width + dx), height: Math.max(40, startProps.height - dy) };
          } else if (handle === 'nw') {
            newProps = { x: startProps.x + dx, y: startProps.y + dy, width: Math.max(60, startProps.width - dx), height: Math.max(40, startProps.height - dy) };
          }
          updateComponentProps(id, newProps);
        } else if (comp.type === 'highlight') {
          if (handle === 'e') {
            updateComponentProps(id, { width: Math.max(30, startProps.width + dx) });
          } else if (handle === 's') {
            updateComponentProps(id, { height: Math.max(8, (startProps.height || 18) + dy) });
          }
        }
        return;
      }

      // Regular dragging
      if (!dragging.current) return;
      const { id, offsetX, offsetY } = dragging.current;
      const comp = components.find((c) => c.id === id);
      if (!comp) return;

      const newX = pt.x - offsetX;
      const newY = pt.y - offsetY;

      if (comp.type === 'arrow' || comp.type === 'gradientArrow' || comp.type === 'curvedArrow') {
        const ddx = newX - (comp.props.startX ?? 0);
        const ddy = newY - (comp.props.startY ?? 0);
        updateComponentProps(id, {
          startX: newX,
          startY: newY,
          endX: (comp.props.endX ?? 0) + ddx,
          endY: (comp.props.endY ?? 0) + ddy,
        });
      } else {
        updateComponentProps(id, { x: newX, y: newY });
      }
    },
    [getSVGPoint, components, updateComponentProps]
  );

  const handleMouseUp = useCallback(() => {
    dragging.current = null;
    resizing.current = null;
    endpointDragging.current = null;
  }, []);

  // Selected component for properties panel
  const selectedComp = components.find((c) => c.id === selectedId);

  useEffect(() => {
    const handlePlay = () => {
      if (svgRef.current) {
        playAnimation(svgRef.current, useWhiteboardStore.getState().components);
      }
    };
    const handlePDF = () => {
      if (svgRef.current) {
        toast.promise(exportPDF(svgRef.current, CANVAS_W, CANVAS_H), {
          loading: 'Generating PDF...',
          success: 'PDF downloaded!',
          error: 'Failed to export PDF',
        });
      }
    };
    const handleMP4 = () => {
      if (svgRef.current) {
        toast.promise(
          exportMP4(svgRef.current, CANVAS_W, CANVAS_H, () => {
            if (svgRef.current) {
              playAnimation(svgRef.current, useWhiteboardStore.getState().components);
            }
          }),
          {
            loading: 'Recording animation... (will download when complete)',
            success: 'Recording downloaded!',
            error: 'Failed to record animation',
          }
        );
      }
    };
    window.addEventListener('whiteboard-play', handlePlay);
    window.addEventListener('whiteboard-export-pdf', handlePDF);
    window.addEventListener('whiteboard-export-mp4', handleMP4);
    return () => {
      window.removeEventListener('whiteboard-play', handlePlay);
      window.removeEventListener('whiteboard-export-pdf', handlePDF);
      window.removeEventListener('whiteboard-export-mp4', handleMP4);
    };
  }, [CANVAS_W, CANVAS_H]);

  return (
    <div className="flex-1 relative overflow-hidden bg-muted/30">
      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-card border rounded-lg shadow-sm p-1">
        <button onClick={zoomOut} className="px-2 py-1 text-sm font-medium hover:bg-muted rounded transition-colors">−</button>
        <button onClick={zoomReset} className="px-2 py-1 text-xs text-muted-foreground hover:bg-muted rounded transition-colors min-w-[3rem] text-center">
          {Math.round(zoom * 100)}%
        </button>
        <button onClick={zoomIn} className="px-2 py-1 text-sm font-medium hover:bg-muted rounded transition-colors">+</button>
      </div>

      {/* Color picker for highlight or title */}
      {selectedComp && (selectedComp.type === 'highlight' || selectedComp.type === 'title') && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-card border rounded-lg shadow-sm p-2">
          <span className="text-xs text-muted-foreground font-medium">Color:</span>
          {(selectedComp.type === 'title' ? TITLE_COLORS : HIGHLIGHT_COLORS).map((color) => (
            <button
              key={color}
              onClick={() => updateComponentProps(selectedComp.id, { color })}
              className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
              style={{
                backgroundColor: color,
                borderColor: (selectedComp.props.color || (selectedComp.type === 'title' ? TITLE_COLORS[0] : HIGHLIGHT_COLORS[0])) === color ? 'hsl(0 0% 7%)' : 'transparent',
              }}
            />
          ))}
        </div>
      )}

      {/* Color picker for noteBox */}
      {selectedComp && selectedComp.type === 'noteBox' && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-card border rounded-lg shadow-sm p-2">
          <span className="text-xs text-muted-foreground font-medium">Color:</span>
          {NOTE_COLOR_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => updateComponentProps(selectedComp.id, { noteColor: key })}
              className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
              style={{
                backgroundColor: NOTE_SWATCH_COLORS[key],
                borderColor: (selectedComp.props.noteColor || 'green') === key ? 'hsl(0 0% 7%)' : 'transparent',
              }}
            />
          ))}
        </div>
      )}

      {/* Inline text editor overlay (skip for docCodeBlock which has its own inline editor) */}
      {editingId && editPos && (() => { const ec = components.find(c => c.id === editingId); return ec?.type !== 'docCodeBlock'; })() && (
        <div
          className="fixed z-50"
          style={{ left: editPos.x, top: editPos.y }}
        >
          {(() => {
            const editComp = components.find(c => c.id === editingId);
            const isDarkComp = editComp?.props?.variant === 'dark';
            const isCodeField = editField === 'codeContent';
            const isCodeOrNote = editComp?.type === 'docCodeBlock' || editComp?.type === 'noteBox';
            const bgColor = isCodeOrNote && isDarkComp ? '#0b2e1f' : isCodeOrNote ? '#f8faf9' : undefined;
            const textColor = isCodeOrNote && isDarkComp ? '#e2e8f0' : isCodeOrNote ? '#1e293b' : undefined;
            const borderColor = isCodeOrNote && isDarkComp ? '#0C4B33' : undefined;

            return isCodeField ? (
              <textarea
                autoFocus
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => { if (e.key === 'Escape') { setEditingId(null); setEditPos(null); } }}
                className="px-2 py-1 border-2 rounded font-mono text-sm outline-none resize"
                style={{
                  width: Math.max(300, editPos.width),
                  minHeight: 120,
                  backgroundColor: bgColor || 'hsl(var(--background))',
                  color: textColor || 'hsl(var(--foreground))',
                  borderColor: borderColor || 'hsl(var(--primary))',
                }}
                rows={8}
              />
            ) : (
              <input
                autoFocus
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') { setEditingId(null); setEditPos(null); } }}
                className="px-2 py-1 border-2 rounded font-mono text-sm outline-none"
                style={{
                  width: Math.max(200, editPos.width),
                  backgroundColor: bgColor || 'hsl(var(--background))',
                  color: textColor || 'hsl(var(--foreground))',
                  borderColor: borderColor || 'hsl(var(--primary))',
                }}
              />
            );
          })()}
        </div>
      )}

      <div ref={containerRef} className="w-full h-full overflow-auto p-4">
        <div className="min-w-full min-h-full flex items-start justify-center">
        <div
          className="shadow-lg rounded-xl overflow-hidden border shrink-0"
          style={{
            width: `${CANVAS_W * zoom}px`,
            height: `${CANVAS_H * zoom}px`,
          }}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
            className="w-full h-full"
            style={{ backgroundColor: preset.bg }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={(e) => { if (e.target === e.currentTarget) { selectComponent(null); if (editingId) commitEdit(); } }}
          >
            {preset.grid && (
              <>
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill={preset.gridColor} />
                  </pattern>
                </defs>
                <rect width={CANVAS_W} height={CANVAS_H} fill="url(#grid)" opacity="0.5" />
              </>
            )}

            {components.map((comp) => {
              if (comp.type === 'title') {
                return (
                  <TitleComponent
                    key={comp.id}
                    component={comp}
                    isSelected={selectedId === comp.id}
                    isEditing={editingId === comp.id}
                    onMouseDown={(e) => handleMouseDown(e, comp.id, comp.props)}
                    onDoubleClick={(e) => handleDoubleClick(e, comp.id)}
                  />
                );
              }
              if (comp.type === 'box') {
                return (
                  <BoxComponent
                    key={comp.id}
                    component={comp}
                    isSelected={selectedId === comp.id}
                    isEditing={editingId === comp.id}
                    onMouseDown={(e) => handleMouseDown(e, comp.id, comp.props)}
                    onDoubleClick={(e) => handleDoubleClick(e, comp.id)}
                    onResizeStart={(e, handle) => handleResizeStart(e, comp.id, handle)}
                  />
                );
              }
              if (comp.type === 'arrow') {
                return (
                  <ArrowComponent
                    key={comp.id}
                    component={comp}
                    isSelected={selectedId === comp.id}
                    onMouseDown={(e) => handleMouseDown(e, comp.id, comp.props)}
                    onEndpointDrag={(e, endpoint) => handleEndpointDrag(e, comp.id, endpoint)}
                  />
                );
              }
              if (comp.type === 'highlight') {
                return (
                  <HighlightComponent
                    key={comp.id}
                    component={comp}
                    isSelected={selectedId === comp.id}
                    onMouseDown={(e) => handleMouseDown(e, comp.id, comp.props)}
                    onResizeStart={(e, handle) => handleResizeStart(e, comp.id, handle)}
                  />
                );
              }
              if (comp.type === 'character') {
                return (
                  <CharacterComponent
                    key={comp.id}
                    component={comp}
                    isSelected={selectedId === comp.id}
                    onMouseDown={(e) => handleMouseDown(e, comp.id, comp.props)}
                  />
                );
              }
              if (comp.type === 'indianCharacter') {
                return (
                  <IndianCharacterComponent
                    key={comp.id}
                    component={comp}
                    isSelected={selectedId === comp.id}
                    onMouseDown={(e) => handleMouseDown(e, comp.id, comp.props)}
                  />
                );
              }
              if (comp.type === 'device') {
                return (
                  <DeviceComponent
                    key={comp.id}
                    component={comp}
                    isSelected={selectedId === comp.id}
                    onMouseDown={(e) => handleMouseDown(e, comp.id, comp.props)}
                  />
                );
              }
              if (comp.type === 'gradientArrow') {
                return (
                  <GradientArrowComponent
                    key={comp.id}
                    component={comp}
                    isSelected={selectedId === comp.id}
                    onMouseDown={(e) => handleMouseDown(e, comp.id, comp.props)}
                    onEndpointDrag={(e, endpoint) => handleEndpointDrag(e, comp.id, endpoint)}
                  />
                );
              }
              if (comp.type === 'curvedArrow') {
                return (
                  <CurvedArrowComponent
                    key={comp.id}
                    component={comp}
                    isSelected={selectedId === comp.id}
                    onMouseDown={(e) => handleMouseDown(e, comp.id, comp.props)}
                    onEndpointDrag={(e, endpoint) => handleEndpointDrag(e, comp.id, endpoint)}
                  />
                );
              }
              if (comp.type === 'foldedBox') {
                return (
                  <FoldedBoxComponent
                    key={comp.id}
                    component={comp}
                    isSelected={selectedId === comp.id}
                    isEditing={editingId === comp.id}
                    onMouseDown={(e) => handleMouseDown(e, comp.id, comp.props)}
                    onDoubleClick={(e) => handleDoubleClick(e, comp.id)}
                    onResizeStart={(e, handle) => handleResizeStart(e, comp.id, handle)}
                  />
                );
              }
              if (comp.type === 'codeBox') {
                return (
                  <CodeBoxComponent
                    key={comp.id}
                    component={comp}
                    isSelected={selectedId === comp.id}
                    onMouseDown={(e) => handleMouseDown(e, comp.id, comp.props)}
                    onResizeStart={(e, handle) => handleResizeStart(e, comp.id, handle)}
                  />
                );
              }
              if (comp.type === 'openPeep') {
                return (
                  <OpenPeepComponent
                    key={comp.id}
                    component={comp}
                    isSelected={selectedId === comp.id}
                    onMouseDown={(e) => handleMouseDown(e, comp.id, comp.props)}
                  />
                );
              }
              if (comp.type === 'documentation') {
                return (
                  <DocumentationComponent
                    key={comp.id}
                    component={comp}
                    isSelected={selectedId === comp.id}
                    onMouseDown={(e) => handleMouseDown(e, comp.id, comp.props)}
                    onResizeStart={(e, handle) => handleResizeStart(e, comp.id, handle)}
                  />
                );
              }
              if (comp.type === 'noteBox') {
                return (
                  <NoteBoxComponent
                    key={comp.id}
                    component={comp}
                    isSelected={selectedId === comp.id}
                    onMouseDown={(e) => handleMouseDown(e, comp.id, comp.props)}
                    onDoubleClick={(e, field) => {
                      e.stopPropagation();
                      setEditingId(comp.id);
                      setEditField(field);
                      setEditText(comp.props[field] || '');
                      const svg = svgRef.current!;
                      const rect = svg.getBoundingClientRect();
                      const scaleX = rect.width / CANVAS_W;
                      const scaleY = rect.height / CANVAS_H;
                      const yOffset = field === 'noteTitle' ? 14 : 42;
                      setEditPos({
                        x: comp.props.x * scaleX + rect.left + (field === 'noteTitle' ? 48 : 24) * scaleX,
                        y: (comp.props.y + yOffset) * scaleY + rect.top,
                        width: (comp.props.width || 460) * scaleX - 60,
                      });
                    }}
                    onResizeStart={(e, handle) => handleResizeStart(e, comp.id, handle)}
                  />
                );
              }
              if (comp.type === 'docCodeBlock') {
                const isEditingThis = editingId === comp.id;
                return (
                  <DocCodeBlockComponent
                    key={comp.id}
                    component={comp}
                    isSelected={selectedId === comp.id}
                    onMouseDown={(e) => handleMouseDown(e, comp.id, comp.props)}
                    onDoubleClick={(e, field) => {
                      e.stopPropagation();
                      setEditingId(comp.id);
                      setEditField(field);
                      setEditText(comp.props[field] || '');
                    }}
                    onResizeStart={(e, handle) => handleResizeStart(e, comp.id, handle)}
                    editingField={isEditingThis ? editField as 'codeTitle' | 'codeContent' : null}
                    editText={isEditingThis ? editText : undefined}
                    onEditChange={(text) => setEditText(text)}
                    onEditCommit={commitEdit}
                  />
                );
              }
              if (comp.type === 'markdown') {
                const isEditingThis = editingId === comp.id;
                return (
                  <MarkdownComponent
                    key={comp.id}
                    component={comp}
                    isSelected={selectedId === comp.id}
                    isEditing={isEditingThis}
                    editText={isEditingThis ? editText : undefined}
                    onMouseDown={(e) => handleMouseDown(e, comp.id, comp.props)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setEditingId(comp.id);
                      setEditField('markdownContent');
                      setEditText(comp.props.markdownContent || '');
                    }}
                    onResizeStart={(e, handle) => handleResizeStart(e, comp.id, handle)}
                    onEditChange={(text) => setEditText(text)}
                    onEditCommit={() => {
                      if (editingId && editText !== undefined) {
                        updateComponentProps(editingId, { markdownContent: editText });
                      }
                      setEditingId(null);
                      setEditPos(null);
                      setEditField('text');
                    }}
                  />
                );
              }
              return null;
            })}
          </svg>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
