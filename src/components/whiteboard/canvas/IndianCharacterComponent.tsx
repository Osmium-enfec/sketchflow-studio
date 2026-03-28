import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { WhiteboardComponent } from '@/store/whiteboardStore';

interface Props {
  component: WhiteboardComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

const IndianCharacterComponent: React.FC<Props> = ({ component, isSelected, onMouseDown }) => {
  const { x, y, scale = 1 } = component.props;
  const eyeLidsRef = useRef<SVGGElement>(null);
  const browsRef = useRef<SVGGElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const mouthRef = useRef<SVGGElement>(null);

  const w = 200 * scale;
  const h = 240 * scale;

  // Idle blink animation
  useEffect(() => {
    if (!eyeLidsRef.current || !browsRef.current || !headRef.current) return;

    const lids = eyeLidsRef.current;
    const brows = browsRef.current;

    const blinkTl = gsap.timeline({ repeat: -1, repeatDelay: 2.5 + Math.random() * 2 });
    blinkTl
      .to(lids, { scaleY: 0.05, transformOrigin: 'center top', duration: 0.08, ease: 'power2.in' })
      .to(lids, { scaleY: 1, duration: 0.12, ease: 'power2.out' });

    const browTl = gsap.timeline({ repeat: -1, repeatDelay: 3 + Math.random() * 3 });
    browTl
      .to(brows, { y: -1.5, duration: 0.3, ease: 'power2.out' })
      .to(brows, { y: 0, duration: 0.4, ease: 'power2.inOut' });

    return () => {
      blinkTl.kill();
      browTl.kill();
    };
  }, []);

  // Idle float
  useEffect(() => {
    if (!headRef.current) return;
    const floatTween = gsap.to(headRef.current, {
      y: '+=1.5',
      duration: 2.2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
    return () => { floatTween.kill(); };
  }, []);

  return (
    <g
      data-component-id={component.id}
      onMouseDown={onMouseDown}
      style={{ cursor: 'move' }}
      transform={`translate(${x}, ${y}) scale(${scale})`}
    >
      {isSelected && (
        <rect
          x={-5 / scale}
          y={-5 / scale}
          width={(w + 10) / scale}
          height={(h + 10) / scale}
          fill="none"
          stroke="hsl(210 80% 70%)"
          strokeWidth={2 / scale}
          strokeDasharray="6 3"
          rx={4 / scale}
        />
      )}

      <g ref={headRef}>
        <defs>
          <radialGradient id={`skin-grad-${component.id}`} cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#F1C27D" />
            <stop offset="60%" stopColor="#D6A77A" />
            <stop offset="100%" stopColor="#B97C4B" />
          </radialGradient>
          <linearGradient id={`hair-grad-${component.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2C2C2C" />
            <stop offset="100%" stopColor="#1C1C1C" />
          </linearGradient>
          <filter id={`soft-shadow-${component.id}`} x="-10%" y="-10%" width="130%" height="130%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="1" dy="2" />
            <feComposite in2="SourceAlpha" operator="arithmetic" k1="0" k2="0.15" k3="0" k4="0" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Face */}
        <g className="indian-face" filter={`url(#soft-shadow-${component.id})`}>
          <ellipse cx={100} cy={120} rx={72} ry={88}
            fill={`url(#skin-grad-${component.id})`} stroke="#B97C4B" strokeWidth={1.5} />
        </g>

        {/* Ears */}
        <g className="indian-ears">
          <ellipse cx={30} cy={120} rx={12} ry={18} fill="#D6A77A" stroke="#B97C4B" strokeWidth={1} />
          <ellipse cx={170} cy={120} rx={12} ry={18} fill="#D6A77A" stroke="#B97C4B" strokeWidth={1} />
        </g>

        {/* Hair */}
        <g className="indian-hair">
          <path d="M32,75 C32,20 60,5 100,8 C140,5 168,20 168,75 C168,55 155,35 100,32 C45,35 32,55 32,75 Z"
            fill={`url(#hair-grad-${component.id})`} stroke="#1C1C1C" strokeWidth={0.5} />
          <path d="M50,42 C55,18 70,6 100,8 C130,6 145,18 150,42 C145,25 130,15 100,14 C70,15 55,25 50,42 Z"
            fill="#222" opacity={0.6} />
          <path d="M35,68 C33,50 42,30 58,22" fill="none" stroke="#1C1C1C" strokeWidth={2.5} strokeLinecap="round" />
          <path d="M165,68 C167,50 158,30 142,22" fill="none" stroke="#1C1C1C" strokeWidth={2.5} strokeLinecap="round" />
          <path d="M85,12 C90,2 110,2 115,12" fill="none" stroke="#2C2C2C" strokeWidth={2} strokeLinecap="round" />
        </g>

        {/* Eyebrows */}
        <g ref={browsRef} className="indian-eyebrows">
          <path d="M62,88 C68,82 82,82 88,86" fill="none" stroke="#1C1C1C" strokeWidth={2.5} strokeLinecap="round" />
          <path d="M112,86 C118,82 132,82 138,88" fill="none" stroke="#1C1C1C" strokeWidth={2.5} strokeLinecap="round" />
        </g>

        {/* Eyes */}
        <g className="indian-eyes">
          <ellipse cx={75} cy={105} rx={14} ry={11} fill="white" stroke="#B97C4B" strokeWidth={0.5} />
          <ellipse cx={125} cy={105} rx={14} ry={11} fill="white" stroke="#B97C4B" strokeWidth={0.5} />
          <circle cx={77} cy={106} r={6} fill="#3D2B1F" />
          <circle cx={78.5} cy={104} r={2} fill="white" opacity={0.8} />
          <circle cx={127} cy={106} r={6} fill="#3D2B1F" />
          <circle cx={128.5} cy={104} r={2} fill="white" opacity={0.8} />
        </g>

        {/* Eyelids */}
        <g ref={eyeLidsRef} className="indian-eyelids">
          <ellipse cx={75} cy={97} rx={14} ry={5} fill="#D6A77A" stroke="none" />
          <ellipse cx={125} cy={97} rx={14} ry={5} fill="#D6A77A" stroke="none" />
        </g>

        {/* Nose */}
        <g className="indian-nose">
          <path d="M96,118 C94,128 96,140 100,142 C104,140 106,128 104,118"
            fill="none" stroke="#B97C4B" strokeWidth={1.2} strokeLinecap="round" opacity={0.6} />
          <circle cx={95} cy={140} r={2.5} fill="#B97C4B" opacity={0.25} />
          <circle cx={105} cy={140} r={2.5} fill="#B97C4B" opacity={0.25} />
        </g>

        {/* Lips (with ref for animation) */}
        <g ref={mouthRef} className="indian-lips">
          <path d="M82,158 C88,154 95,152 100,153 C105,152 112,154 118,158"
            fill="none" stroke="#C2795A" strokeWidth={2} strokeLinecap="round" />
          <path d="M84,158 C90,168 110,168 116,158"
            fill="#C2795A" opacity={0.35} stroke="#C2795A" strokeWidth={1} strokeLinecap="round" />
        </g>

        {/* Mole */}
        <circle cx={140} cy={138} r={1.8} fill="#8B6243" opacity={0.5} />

        {/* Stubble */}
        <g className="indian-stubble" opacity={0.08}>
          {[...Array(12)].map((_, i) => (
            <circle
              key={i}
              cx={80 + (i % 4) * 14}
              cy={165 + Math.floor(i / 4) * 6}
              r={0.6}
              fill="#1C1C1C"
            />
          ))}
        </g>
      </g>
    </g>
  );
};

export default IndianCharacterComponent;
