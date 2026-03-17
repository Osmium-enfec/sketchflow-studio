import React, { useRef, useCallback, useEffect } from 'react';
import { useWhiteboardStore } from '@/store/whiteboardStore';
import TitleComponent from './canvas/TitleComponent';
import BoxComponent from './canvas/BoxComponent';
import ArrowComponent from './canvas/ArrowComponent';
import HighlightComponent from './canvas/HighlightComponent';
import { playAnimation } from '@/timeline/timelineEngine';

const CANVAS_W = 1920;
const CANVAS_H = 1080;

const componentRenderers: Record<string, React.FC<any>> = {
  title: TitleComponent,
  box: BoxComponent,
  arrow: ArrowComponent,
  highlight: HighlightComponent,
};

const Canvas: React.FC = () => {
  const { components, selectedId, selectComponent, updateComponentProps } = useWhiteboardStore();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [zoom, setZoom] = React.useState(1);

  const zoomIn = () => setZoom((z) => Math.min(z + 0.15, 3));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.3));
  const zoomReset = () => setZoom(1);

  const getSVGPoint = useCallback((e: React.MouseEvent) => {
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

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging.current) return;
      const pt = getSVGPoint(e);
      const { id, offsetX, offsetY } = dragging.current;
      const comp = components.find((c) => c.id === id);
      if (!comp) return;

      const newX = pt.x - offsetX;
      const newY = pt.y - offsetY;

      if (comp.type === 'arrow') {
        const dx = newX - (comp.props.startX ?? 0);
        const dy = newY - (comp.props.startY ?? 0);
        updateComponentProps(id, {
          startX: newX,
          startY: newY,
          endX: (comp.props.endX ?? 0) + dx,
          endY: (comp.props.endY ?? 0) + dy,
        });
      } else {
        updateComponentProps(id, { x: newX, y: newY });
      }
    },
    [getSVGPoint, components, updateComponentProps]
  );

  const handleMouseUp = useCallback(() => {
    dragging.current = null;
  }, []);

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
    <div className="flex-1 overflow-auto flex items-center justify-center p-6 bg-muted/30">
      <div className="shadow-lg rounded-xl overflow-hidden border" style={{ maxWidth: '100%', aspectRatio: '16/9' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
          className="w-full h-full canvas-bg"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={() => selectComponent(null)}
        >
          {/* Grid dots */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="hsl(0 0% 85%)" />
            </pattern>
          </defs>
          <rect width={CANVAS_W} height={CANVAS_H} fill="url(#grid)" opacity="0.5" />

          {components.map((comp) => {
            const Renderer = componentRenderers[comp.type];
            if (!Renderer) return null;
            return (
              <Renderer
                key={comp.id}
                component={comp}
                isSelected={selectedId === comp.id}
                onMouseDown={(e: React.MouseEvent) => handleMouseDown(e, comp.id, comp.props)}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default Canvas;
