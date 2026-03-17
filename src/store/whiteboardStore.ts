import { create } from 'zustand';

export type ComponentType = 'title' | 'box' | 'arrow' | 'highlight' | 'character' | 'device';

export interface WhiteboardComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  order: number;
  delay: number;
}

interface WhiteboardStore {
  components: WhiteboardComponent[];
  selectedId: string | null;
  editingId: string | null;
  isPlaying: boolean;

  addComponent: (type: ComponentType, extraProps?: Record<string, any>) => void;
  updateComponent: (id: string, updates: Partial<WhiteboardComponent>) => void;
  updateComponentProps: (id: string, props: Record<string, any>) => void;
  removeComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  setEditingId: (id: string | null) => void;
  reorderComponent: (id: string, newOrder: number) => void;
  setPlaying: (playing: boolean) => void;
}

let nextId = 1;

const defaultProps: Record<ComponentType, (count: number) => Record<string, any>> = {
  title: (n) => ({ text: 'Title ' + n, x: 200, y: 100 + n * 60 }),
  box: (n) => ({ text: 'Box ' + n, x: 300, y: 200 + n * 40, width: 200, height: 120 }),
  arrow: (n) => ({ startX: 200, startY: 300 + n * 30, endX: 500, endY: 300 + n * 30 }),
  highlight: (n) => ({ x: 150, y: 150 + n * 40, width: 250, height: 18, color: 'hsl(48 100% 67%)' }),
  character: (n) => ({ x: 600 + n * 30, y: 300, scale: 1 }),
  device: (n) => ({ x: 700 + n * 30, y: 200, scale: 1, variant: 'phone' }),
};

export const useWhiteboardStore = create<WhiteboardStore>((set, get) => ({
  components: [],
  selectedId: null,
  editingId: null,
  isPlaying: false,

  addComponent: (type, extraProps) => {
    const id = String(nextId++);
    const count = get().components.length;
    const order = count + 1;
    const props = { ...defaultProps[type](count), ...extraProps };
    set((s) => ({
      components: [
        ...s.components,
        { id, type, props, order, delay: 0 },
      ],
    }));
  },

  updateComponent: (id, updates) =>
    set((s) => ({
      components: s.components.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),

  updateComponentProps: (id, props) =>
    set((s) => ({
      components: s.components.map((c) =>
        c.id === id ? { ...c, props: { ...c.props, ...props } } : c
      ),
    })),

  removeComponent: (id) =>
    set((s) => ({
      components: s.components.filter((c) => c.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
      editingId: s.editingId === id ? null : s.editingId,
    })),

  selectComponent: (id) => set({ selectedId: id }),
  setEditingId: (id) => set({ editingId: id }),

  reorderComponent: (id, newOrder) =>
    set((s) => ({
      components: s.components.map((c) => (c.id === id ? { ...c, order: newOrder } : c)),
    })),

  setPlaying: (playing) => set({ isPlaying: playing }),
}));
