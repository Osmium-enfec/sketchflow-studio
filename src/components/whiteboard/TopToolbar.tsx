import React from 'react';
import { Play, Square, Type, ArrowRight, Highlighter, Trash2 } from 'lucide-react';
import { useWhiteboardStore } from '@/store/whiteboardStore';
import { Button } from '@/components/ui/button';

const TopToolbar: React.FC = () => {
  const { addComponent, isPlaying, setPlaying, selectedId, removeComponent } = useWhiteboardStore();

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
