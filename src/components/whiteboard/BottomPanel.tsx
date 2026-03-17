import React from 'react';
import { useWhiteboardStore } from '@/store/whiteboardStore';
import { GripVertical, Trash2 } from 'lucide-react';

const BottomPanel: React.FC = () => {
  const { components, selectedId, selectComponent, reorderComponent, updateComponent, updateComponentProps, removeComponent } = useWhiteboardStore();
  const sorted = [...components].sort((a, b) => a.order - b.order);

  return (
    <div className="h-36 toolbar-bg border-t shrink-0 flex flex-col">
      <div className="px-4 py-2 border-b">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Timeline Order
        </h3>
      </div>
      <div className="flex-1 overflow-x-auto px-4 py-2">
        <div className="flex gap-3 items-start min-w-max">
          {sorted.map((comp) => {
            const isSelected = selectedId === comp.id;
            const showFontSize = comp.type === 'title' || comp.type === 'box';
            return (
              <div
                key={comp.id}
                onClick={() => selectComponent(comp.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 min-w-[160px] cursor-pointer transition-colors ${
                  isSelected ? 'bg-primary/10 border border-primary/30' : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                <GripVertical className="h-3 w-3 text-muted-foreground shrink-0" />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium capitalize">{comp.type}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeComponent(comp.id); }}
                      className="ml-auto p-0.5 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    <label className="text-[10px] text-muted-foreground">Order:</label>
                    <input
                      type="number"
                      value={comp.order}
                      onChange={(e) => reorderComponent(comp.id, parseInt(e.target.value) || 1)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-10 text-xs bg-background border rounded px-1 py-0.5"
                      min={1}
                    />
                    <label className="text-[10px] text-muted-foreground ml-1">Delay:</label>
                    <input
                      type="number"
                      value={comp.delay}
                      onChange={(e) => updateComponent(comp.id, { delay: parseFloat(e.target.value) || 0 })}
                      onClick={(e) => e.stopPropagation()}
                      className="w-10 text-xs bg-background border rounded px-1 py-0.5"
                      min={0}
                      step={0.1}
                    />
                  </div>
                  {showFontSize && (
                    <div className="flex items-center gap-1">
                      <label className="text-[10px] text-muted-foreground">Font:</label>
                      <input
                        type="number"
                        value={comp.props.fontSize || (comp.type === 'title' ? 42 : '')}
                        onChange={(e) => updateComponentProps(comp.id, { fontSize: parseInt(e.target.value) || undefined })}
                        onClick={(e) => e.stopPropagation()}
                        className="w-12 text-xs bg-background border rounded px-1 py-0.5"
                        min={10}
                        max={200}
                        placeholder="auto"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {sorted.length === 0 && (
            <span className="text-xs text-muted-foreground">No components yet.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomPanel;
