import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Type, ArrowRight, Highlighter, Trash2, User, Smartphone, ArrowDown, CornerDownRight, FileText, Monitor } from 'lucide-react';
import { useWhiteboardStore } from '@/store/whiteboardStore';
import { Button } from '@/components/ui/button';

const TopToolbar: React.FC = () => {
  const { addComponent, isPlaying, setPlaying, selectedId, removeComponent } = useWhiteboardStore();
  const [androidOpen, setAndroidOpen] = useState(false);
  const [arrowsOpen, setArrowsOpen] = useState(false);
  const [boxesOpen, setBoxesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const arrowsRef = useRef<HTMLDivElement>(null);
  const boxesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setAndroidOpen(false);
      if (arrowsRef.current && !arrowsRef.current.contains(e.target as Node)) setArrowsOpen(false);
      if (boxesRef.current && !boxesRef.current.contains(e.target as Node)) setBoxesOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ChevronIcon = ({ open }: { open: boolean }) => (
    <svg className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 5l3 3 3-3" />
    </svg>
  );

  return (
    <div className="h-14 toolbar-bg border-b flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-lg tracking-tight mr-4">✏️ WhiteBoard</span>
        <div className="h-6 w-px bg-border" />
        <Button variant="ghost" size="sm" onClick={() => addComponent('title')} className="gap-1.5">
          <Type className="h-4 w-4" /> Title
        </Button>

        {/* Boxes dropdown */}
        <div className="relative" ref={boxesRef}>
          <Button variant="ghost" size="sm" onClick={() => { setBoxesOpen(!boxesOpen); setArrowsOpen(false); setAndroidOpen(false); }} className="gap-1.5">
            <Square className="h-4 w-4" /> Box <ChevronIcon open={boxesOpen} />
          </Button>
          {boxesOpen && (
            <div className="absolute top-full left-0 mt-1 bg-card border rounded-lg shadow-lg z-50 min-w-[160px] py-1">
              <button onClick={() => { addComponent('box'); setBoxesOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <Square className="h-4 w-4 text-muted-foreground" /> Sketch Box
              </button>
              <button onClick={() => { addComponent('foldedBox'); setBoxesOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <FileText className="h-4 w-4 text-muted-foreground" /> Folded Box
              </button>
            </div>
          )}
        </div>

        {/* Arrows dropdown */}
        <div className="relative" ref={arrowsRef}>
          <Button variant="ghost" size="sm" onClick={() => { setArrowsOpen(!arrowsOpen); setBoxesOpen(false); setAndroidOpen(false); }} className="gap-1.5">
            <ArrowRight className="h-4 w-4" /> Arrow <ChevronIcon open={arrowsOpen} />
          </Button>
          {arrowsOpen && (
            <div className="absolute top-full left-0 mt-1 bg-card border rounded-lg shadow-lg z-50 min-w-[180px] py-1">
              <button onClick={() => { addComponent('arrow'); setArrowsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <ArrowRight className="h-4 w-4 text-muted-foreground" /> Simple Arrow
              </button>
              <button onClick={() => { addComponent('gradientArrow'); setArrowsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <ArrowDown className="h-4 w-4 text-muted-foreground" /> Gradient Arrow
              </button>
              <button onClick={() => { addComponent('curvedArrow'); setArrowsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <CornerDownRight className="h-4 w-4 text-muted-foreground" /> Curved Arrow
              </button>
            </div>
          )}
        </div>

        <Button variant="ghost" size="sm" onClick={() => addComponent('highlight')} className="gap-1.5">
          <Highlighter className="h-4 w-4" /> Highlight
        </Button>
        <Button variant="ghost" size="sm" onClick={() => addComponent('character')} className="gap-1.5">
          <User className="h-4 w-4" /> Character
        </Button>

        {/* Android dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Button variant="ghost" size="sm" onClick={() => { setAndroidOpen(!androidOpen); setArrowsOpen(false); setBoxesOpen(false); }} className="gap-1.5">
            <Smartphone className="h-4 w-4" /> Android <ChevronIcon open={androidOpen} />
          </Button>
          {androidOpen && (
            <div className="absolute top-full left-0 mt-1 bg-card border rounded-lg shadow-lg z-50 min-w-[160px] py-1">
              <button onClick={() => { addComponent('device', { variant: 'phone' }); setAndroidOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <Smartphone className="h-4 w-4 text-muted-foreground" /> Phone
              </button>
              <button onClick={() => { addComponent('device', { variant: 'tablet' }); setAndroidOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                <Smartphone className="h-4 w-4 text-muted-foreground" /> Tablet
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {selectedId && (
          <Button variant="ghost" size="sm" onClick={() => removeComponent(selectedId)} className="gap-1.5 text-destructive">
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        )}
        <Button
          size="sm"
          onClick={() => {
            const event = new CustomEvent('whiteboard-play');
            window.dispatchEvent(event);
          }}
          className="gap-1.5"
        >
          <Play className="h-4 w-4" /> Play
        </Button>
      </div>
    </div>
  );
};

export default TopToolbar;
