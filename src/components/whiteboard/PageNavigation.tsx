import React, { useState, useRef, useEffect } from 'react';
import { useWhiteboardStore } from '@/store/whiteboardStore';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';

const PageNavigation: React.FC = () => {
  const { pages, currentPageIndex, switchPage, addPage, removePage, loadPresetPages, renamePage } = useWhiteboardStore();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasLoadedPresets, setHasLoadedPresets] = useState(false);

  const handleLoadPresets = () => {
    if (!hasLoadedPresets) {
      loadPresetPages();
      setHasLoadedPresets(true);
    }
  };

  const handleDoubleClick = (index: number, name: string) => {
    setEditingIndex(index);
    setEditName(name);
  };

  const commitRename = () => {
    if (editingIndex !== null && editName.trim()) {
      renamePage(editingIndex, editName.trim());
    }
    setEditingIndex(null);
  };

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' });

  return (
    <div className="h-10 toolbar-bg border-b flex items-center px-2 gap-1 shrink-0">
      <button onClick={scrollLeft} className="p-1 hover:bg-muted rounded transition-colors shrink-0">
        <ChevronLeft className="h-4 w-4 text-muted-foreground" />
      </button>

      <div ref={scrollRef} className="flex-1 overflow-x-auto flex items-center gap-1 scrollbar-hide">
        {pages.map((page, i) => (
          <button
            key={page.id}
            onClick={() => switchPage(i)}
            onDoubleClick={() => handleDoubleClick(i, page.name)}
            className={`relative flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors shrink-0 ${
              i === currentPageIndex
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            {editingIndex === i ? (
              <input
                autoFocus
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={commitRename}
                onKeyDown={(e) => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setEditingIndex(null); }}
                className="w-24 text-xs bg-transparent border-b border-current outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span>{page.name}</span>
            )}
            {pages.length > 1 && i === currentPageIndex && (
              <X
                className="h-3 w-3 opacity-60 hover:opacity-100 ml-1"
                onClick={(e) => { e.stopPropagation(); removePage(i); }}
              />
            )}
          </button>
        ))}
      </div>

      <button onClick={scrollRight} className="p-1 hover:bg-muted rounded transition-colors shrink-0">
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </button>

      <div className="h-5 w-px bg-border mx-1" />

      <button
        onClick={() => addPage()}
        className="p-1 hover:bg-muted rounded transition-colors shrink-0"
        title="Add blank page"
      >
        <Plus className="h-4 w-4 text-muted-foreground" />
      </button>

      {!hasLoadedPresets && (
        <button
          onClick={handleLoadPresets}
          className="px-2 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-md hover:bg-accent/80 transition-colors shrink-0"
          title="Load tutorial pages"
        >
          📚 Load Pages
        </button>
      )}
    </div>
  );
};

export default PageNavigation;
