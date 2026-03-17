import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Type, ArrowRight, Highlighter, Trash2, User, Smartphone } from 'lucide-react';
import { useWhiteboardStore } from '@/store/whiteboardStore';
import { Button } from '@/components/ui/button';

const TopToolbar: React.FC = () => {
  const { addComponent, isPlaying, setPlaying, selectedId, removeComponent } = useWhiteboardStore();
  const [androidOpen, setAndroidOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAndroidOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="h-14 toolbar-bg border-b flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-lg tracking-tight mr-4">✏️ WhiteBoard</span>
        <div className="h-6 w-px bg-border" />
        <Button variant="ghost" size="sm" onClick={() => addComponent('title')} className="gap-1.5">
          <Type className="h-4 w-4" /> Title
        </Button>
        <Button variant="ghost" size="sm" onClick={() => addComponent('box')} className="gap-1.5">
          <Square className="h-4 w-4" /> Box
        </Button>
        <Button variant="ghost" size="sm" onClick={() => addComponent('arrow')} className="gap-1.5">
          <ArrowRight className="h-4 w-4" /> Arrow
        </Button>
        <Button variant="ghost" size="sm" onClick={() => addComponent('highlight')} className="gap-1.5">
          <Highlighter className="h-4 w-4" /> Highlight
        </Button>
        <Button variant="ghost" size="sm" onClick={() => addComponent('character')} className="gap-1.5">
          <User className="h-4 w-4" /> Character
        </Button>

        {/* Android dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAndroidOpen(!androidOpen)}
            className="gap-1.5"
          >
            <Smartphone className="h-4 w-4" /> Android
            <svg className={`h-3 w-3 transition-transform ${androidOpen ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 5l3 3 3-3" />
            </svg>
          </Button>
          {androidOpen && (
            <div className="absolute top-full left-0 mt-1 bg-card border rounded-lg shadow-lg z-50 min-w-[160px] py-1">
              <button
                onClick={() => {
                  addComponent('device', { variant: 'phone' });
                  setAndroidOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors"
              >
                <svg className="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="5" y="2" width="14" height="20" rx="3" />
                  <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2" />
                </svg>
                Phone
              </button>
              <button
                onClick={() => {
                  addComponent('device', { variant: 'tablet' });
                  setAndroidOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors"
              >
                <svg className="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2" />
                </svg>
                Tablet
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
