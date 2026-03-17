import React from 'react';
import { useWhiteboardStore } from '@/store/whiteboardStore';
import { GripVertical } from 'lucide-react';

const BottomPanel: React.FC = () => {
  const { components, reorderComponent, updateComponent } = useWhiteboardStore();
  const sorted = [...components].sort((a, b) => a.order - b.order);

  return (
    <div className="h-32 toolbar-bg border-t shrink-0 flex flex-col">
      <div className="px-4 py-2 border-b">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Timeline Order
        </h3>
      </div>
      <div className="flex-1 overflow-x-auto px-4 py-2">
        <div className="flex gap-3 items-center min-w-max">
          {sorted.map((comp, i) => (
            <div
              key={comp.id}
              className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 min-w-[140px]"
            >
              <GripVertical className="h-3 w-3 text-muted-foreground shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium capitalize">{comp.type}</span>
                <div className="flex items-center gap-1">
                  <label className="text-[10px] text-muted-foreground">Order:</label>
                  <input
                    type="number"
                    value={comp.order}
                    onChange={(e) => reorderComponent(comp.id, parseInt(e.target.value) || 1)}
                    className="w-10 text-xs bg-background border rounded px-1 py-0.5"
                    min={1}
                  />
                  <label className="text-[10px] text-muted-foreground ml-1">Delay:</label>
                  <input
                    type="number"
                    value={comp.delay}
                    onChange={(e) => updateComponent(comp.id, { delay: parseFloat(e.target.value) || 0 })}
                    className="w-10 text-xs bg-background border rounded px-1 py-0.5"
                    min={0}
                    step={0.1}
                  />
                </div>
              </div>
            </div>
          ))}
          {sorted.length === 0 && (
            <span className="text-xs text-muted-foreground">No components yet.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomPanel;
