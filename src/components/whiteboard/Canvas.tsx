import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useWhiteboardStore } from '@/store/whiteboardStore';
import TitleComponent from './canvas/TitleComponent';
import BoxComponent from './canvas/BoxComponent';
import ArrowComponent from './canvas/ArrowComponent';
import HighlightComponent from './canvas/HighlightComponent';
import CharacterComponent from './canvas/CharacterComponent';
import DeviceComponent from './canvas/DeviceComponent';
import GradientArrowComponent from './canvas/GradientArrowComponent';
import CurvedArrowComponent from './canvas/CurvedArrowComponent';
import FoldedBoxComponent from './canvas/FoldedBoxComponent';
import { playAnimation } from '@/timeline/timelineEngine';

const CANVAS_W = 1920;
const CANVAS_H = 1080;

const HIGHLIGHT_COLORS = [
  'hsl(48 100% 67%)',   // yellow
  'hsl(120 60% 67%)',   // green
  'hsl(200 80% 67%)',   // blue
  'hsl(340 80% 67%)',   // pink
  'hsl(25 100% 67%)',   // orange
  'hsl(280 60% 67%)',   // purple
];

const Canvas: React.FC = () => {
  const { components, selectedId, editingId, selectComponent, setEditingId, updateComponentProps } = useWhiteboardStore();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const resizing = useRef<{ id: string; handle: string; startPt: { x: number; y: number }; startProps: Record<string, any> } | null>(null);
  const endpointDragging = useRef<{ id: string; endpoint: 'start' | 'end' } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [editText, setEditText] = useState('');
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
      if (!comp || (comp.type !== 'title' && comp.type !== 'box' && comp.type !== 'foldedBox')) return;
      setEditingId(id);
      setEditText(comp.props.text || '');
      
      const svg = svgRef.current!;
      const rect = svg.getBoundingClientRect();
      const scaleX = rect.width / CANVAS_W;
      const scaleY = rect.height / CANVAS_H;
      
      if (comp.type === 'box' || comp.type === 'foldedBox') {
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
      updateComponentProps(editingId, { text: editText });
    }
    setEditingId(null);
    setEditPos(null);
  }, [editingId, editText, updateComponentProps, setEditingId]);

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

        if (comp.type === 'box') {
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

      if (comp.type === 'arrow') {
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
    const handler = () => {
      if (svgRef.current) {
        playAnimation(svgRef.current, useWhiteboardStore.getState().components);
      }
    };
    window.addEventListener('whiteboard-play', handler);
    return () => window.removeEventListener('whiteboard-play', handler);
  }, []);

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

      {/* Highlight color picker when highlight selected */}
      {selectedComp?.type === 'highlight' && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-card border rounded-lg shadow-sm p-2">
          <span className="text-xs text-muted-foreground font-medium">Color:</span>
          {HIGHLIGHT_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => updateComponentProps(selectedComp.id, { color })}
              className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
              style={{
                backgroundColor: color,
                borderColor: selectedComp.props.color === color ? 'hsl(0 0% 7%)' : 'transparent',
              }}
            />
          ))}
        </div>
      )}

      {/* Inline text editor overlay */}
      {editingId && editPos && (
        <div
          className="fixed z-50"
          style={{ left: editPos.x, top: editPos.y }}
        >
          <input
            autoFocus
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') { setEditingId(null); setEditPos(null); } }}
            className="px-2 py-1 border-2 border-primary rounded bg-background text-foreground font-['Patrick_Hand'] text-lg outline-none"
            style={{ width: Math.max(200, editPos.width) }}
          />
        </div>
      )}

      <div ref={containerRef} className="w-full h-full overflow-auto flex items-center justify-center p-4">
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
            style={{ backgroundColor: 'hsl(43 100% 98%)' }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={() => { selectComponent(null); if (editingId) commitEdit(); }}
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="hsl(0 0% 85%)" />
              </pattern>
            </defs>
            <rect width={CANVAS_W} height={CANVAS_H} fill="url(#grid)" opacity="0.5" />

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
              return null;
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
