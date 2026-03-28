import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { useLottie } from 'lottie-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { WhiteboardComponent } from '@/store/whiteboardStore';
import { getLottieData, getLottieUrl, LOTTIE_PRESETS } from '@/lib/lottiePresets';

export const LOTTIE_PRESET_LIST = Object.entries(LOTTIE_PRESETS)
  .filter(([key]) => key !== 'custom')
  .map(([value, info]) => ({ value, label: info.label, category: info.category }));

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onResizeStart?: (e: React.MouseEvent, handle: string) => void;
}

/** Renders JSON-based Lottie animations */
const LottieJsonInner: React.FC<{ animationData: any; width: number; height: number }> = ({ animationData, width, height }) => {
  const { View, goToAndStop, play, stop, setSpeed } = useLottie({
    animationData,
    loop: true,
    autoplay: false,
    style: { width: '100%', height: '100%' },
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    (el as any).__lottiePlay = play;
    (el as any).__lottieStop = stop;
    (el as any).__lottieGoTo = goToAndStop;
    (el as any).__lottieSetSpeed = setSpeed;
    goToAndStop(0, true);
    return () => { stop(); };
  }, [play, stop, goToAndStop, setSpeed]);

  return (
    <div ref={containerRef} data-lottie-control="true" style={{ width, height, pointerEvents: 'all' }}>
      {View}
    </div>
  );
};

/** Renders .lottie (dotLottie) format animations */
const DotLottieInner: React.FC<{ src: string; width: number; height: number }> = ({ src, width, height }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotLottieRef = useRef<any>(null);

  const dotLottieRefCallback = useCallback((dotLottie: any) => {
    if (!dotLottie) return;
    dotLottieRef.current = dotLottie;
    dotLottie.pause();
    
    const el = containerRef.current;
    if (el) {
      (el as any).__lottiePlay = () => dotLottie.play();
      (el as any).__lottieStop = () => dotLottie.pause();
      (el as any).__lottieGoTo = (frame: number) => { dotLottie.setFrame(frame); };
      (el as any).__lottieSetSpeed = (speed: number) => { dotLottie.setSpeed(speed); };
    }
  }, []);

  return (
    <div ref={containerRef} data-lottie-control="true" style={{ width, height, pointerEvents: 'all' }}>
      <DotLottieReact
        src={src}
        loop
        autoplay={false}
        dotLottieRefCallback={dotLottieRefCallback}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

const LottieCharacterComponent: React.FC<Props> = ({ component, isSelected, onMouseDown, onResizeStart }) => {
  const { x, y, width = 300, height = 300, lottiePreset = 'bouncing', lottieUrl: customUrl } = component.props;
  const [remoteData, setRemoteData] = useState<object | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inline data for inline presets
  const inlineData = useMemo(() => getLottieData(lottiePreset), [lottiePreset]);

  // Fetch remote URL data
  useEffect(() => {
    const url = getLottieUrl(lottiePreset, customUrl);
    if (!url) {
      setRemoteData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setRemoteData(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setRemoteData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [lottiePreset, customUrl]);

  const animationData = inlineData || remoteData;

  const handles = ['se', 'sw', 'ne', 'nw'];
  const handlePositions: Record<string, { cx: number; cy: number }> = {
    nw: { cx: 0, cy: 0 },
    ne: { cx: width, cy: 0 },
    sw: { cx: 0, cy: height },
    se: { cx: width, cy: height },
  };

  return (
    <g data-component-id={component.id}>
      <foreignObject
        x={x}
        y={y}
        width={width}
        height={height}
        onMouseDown={onMouseDown}
        style={{ cursor: 'grab', overflow: 'visible' }}
      >
        {loading ? (
          <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#94a3b8', fontSize: 14, fontFamily: 'sans-serif' }}>Loading...</div>
          </div>
        ) : error ? (
          <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4 }}>
            <div style={{ color: '#ef4444', fontSize: 13, fontFamily: 'sans-serif' }}>Failed to load</div>
            <div style={{ color: '#94a3b8', fontSize: 11, fontFamily: 'sans-serif' }}>{error}</div>
          </div>
        ) : animationData ? (
          <LottieInner animationData={animationData} width={width} height={height} />
        ) : (
          <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#94a3b8', fontSize: 13, fontFamily: 'sans-serif' }}>No animation</div>
          </div>
        )}
      </foreignObject>

      {isSelected && (
        <>
          <rect
            x={x - 2} y={y - 2}
            width={width + 4} height={height + 4}
            fill="none"
            stroke="hsl(217 91% 60%)"
            strokeWidth="2"
            strokeDasharray="6 3"
            rx="4"
          />
          {handles.map((h) => (
            <circle
              key={h}
              cx={x + handlePositions[h].cx}
              cy={y + handlePositions[h].cy}
              r={5}
              fill="white"
              stroke="hsl(217 91% 60%)"
              strokeWidth={2}
              style={{ cursor: h === 'se' || h === 'nw' ? 'nwse-resize' : 'nesw-resize' }}
              onMouseDown={(e) => { e.stopPropagation(); onResizeStart?.(e, h); }}
            />
          ))}
        </>
      )}
    </g>
  );
};

export default LottieCharacterComponent;
