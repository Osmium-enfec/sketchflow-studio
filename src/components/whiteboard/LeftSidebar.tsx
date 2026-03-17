import React from 'react';
import { Type, Square, ArrowRight, Highlighter, User, Smile, Smartphone, ArrowDown, CornerDownRight, FileText, Monitor } from 'lucide-react';
import { useWhiteboardStore, ComponentType } from '@/store/whiteboardStore';

const iconMap: Record<ComponentType, React.FC<{ className?: string }>> = {
  title: Type,
  box: Square,
  arrow: ArrowRight,
  highlight: Highlighter,
  character: User,
  device: Smartphone,
  gradientArrow: ArrowDown,
  curvedArrow: CornerDownRight,
  foldedBox: FileText,
  codeBox: Monitor,
};

const labelMap: Record<ComponentType, string> = {
  title: 'Title',
  box: 'Box',
  arrow: 'Arrow',
  highlight: 'Highlight',
  character: 'Character',
  device: 'Device',
  gradientArrow: 'Gradient Arrow',
  curvedArrow: 'Curved Arrow',
  foldedBox: 'Folded Box',
  codeBox: 'Code Box',
};

const LeftSidebar: React.FC = () => {
  const { components, selectedId, selectComponent } = useWhiteboardStore();

  return (
    <div className="w-56 sidebar-panel-bg border-r flex flex-col shrink-0">
      <div className="p-3 border-b">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Components</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {components.length === 0 && (
          <p className="text-xs text-muted-foreground p-2">Add components from the toolbar above.</p>
        )}
        {components.map((comp) => {
          const Icon = iconMap[comp.type];
          return (
            <button
              key={comp.id}
              onClick={() => selectComponent(comp.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                selectedId === comp.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{labelMap[comp.type]}: {comp.props.text || `#${comp.id}`}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LeftSidebar;
