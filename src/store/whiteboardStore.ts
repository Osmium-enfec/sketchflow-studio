import { create } from 'zustand';
import { PAGE_PRESETS, PagePreset } from '@/lib/pagePresets';

export type ComponentType = 'title' | 'content' | 'box' | 'arrow' | 'highlight' | 'character' | 'indianCharacter' | 'device' | 'gradientArrow' | 'curvedArrow' | 'foldedBox' | 'codeBox' | 'openPeep' | 'documentation' | 'noteBox' | 'docCodeBlock' | 'markdown' | 'walkingCharacter';

export type CanvasType = 'whiteboard' | 'doc-white' | 'doc-dark';

export interface WhiteboardComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  order: number;
  delay: number;
}

export interface Page {
  id: string;
  name: string;
  canvasType: CanvasType;
  components: WhiteboardComponent[];
}

interface WhiteboardStore {
  pages: Page[];
  currentPageIndex: number;
  canvasType: CanvasType;
  components: WhiteboardComponent[];
  selectedId: string | null;
  editingId: string | null;
  isPlaying: boolean;

  // Page actions
  addPage: (name?: string) => void;
  removePage: (index: number) => void;
  switchPage: (index: number) => void;
  renamePage: (index: number, name: string) => void;
  loadPresetPages: () => void;

  setCanvasType: (type: CanvasType) => void;
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
let nextPageId = 1;

const defaultProps: Record<ComponentType, (count: number) => Record<string, any>> = {
  title: (n) => ({ text: 'Title ' + n, x: 200, y: 100 + n * 60 }),
  content: (n) => ({ text: '## Hello World\n\nThis is **bold** and *italic* content.\n\n- Item 1\n- Item 2', x: 200, y: 100 + n * 60, fontSize: 32, width: 500 }),
  box: (n) => ({ text: 'Box ' + n, x: 300, y: 200 + n * 40, width: 200, height: 120 }),
  arrow: (n) => ({ startX: 200, startY: 300 + n * 30, endX: 500, endY: 300 + n * 30 }),
  highlight: (n) => ({ x: 150, y: 150 + n * 40, width: 250, height: 18, color: 'hsl(48 100% 67%)' }),
  character: (n) => ({ x: 600 + n * 30, y: 300, scale: 1 }),
  indianCharacter: (n) => ({ x: 650 + n * 30, y: 250, scale: 1 }),
  device: (n) => ({ x: 700 + n * 30, y: 200, scale: 1, variant: 'phone' }),
  gradientArrow: (n) => ({ startX: 400, startY: 150, endX: 400, endY: 550 }),
  curvedArrow: (n) => ({ startX: 300, startY: 200, endX: 400, endY: 280 }),
  foldedBox: (n) => ({ text: 'Note ' + n, x: 500, y: 200 + n * 40, width: 260, height: 160 }),
  codeBox: (n) => ({ x: 400, y: 200 + n * 40, width: 400, height: 260 }),
  openPeep: (n) => ({ x: 500 + n * 30, y: 150, scale: 0.3, variant: 'explaining' }),
  documentation: (n) => ({ x: 300 + n * 30, y: 100, width: 420, height: 594, variant: 'white' }),
  noteBox: (n) => ({ x: 300 + n * 20, y: 200 + n * 20, width: 460, height: 140, noteTitle: 'Note', noteContent: 'Your note content goes here.', variant: 'light' }),
  docCodeBlock: (n) => ({ x: 300 + n * 20, y: 250 + n * 20, width: 520, height: 200, codeTitle: 'polls/views.py', codeContent: 'from django.http import HttpResponse\n\ndef index(request):\n    return HttpResponse("Hello, world.")', variant: 'light' }),
  markdown: (n) => ({ x: 300 + n * 20, y: 200 + n * 20, width: 400, height: 300, markdownContent: '# Hello World\n\nWrite your **markdown** here.\n\n- Item 1\n- Item 2\n\n```\ncode block\n```', variant: 'light' }),
  walkingCharacter: (n) => ({ x: 400 + n * 20, y: 200 + n * 20, width: 250, height: 250, flipped: false, walkDistance: 200, variant: 'femaleWalking' }),
};

function saveCurrentPage(state: WhiteboardStore): Page[] {
  const pages = [...state.pages];
  if (pages[state.currentPageIndex]) {
    pages[state.currentPageIndex] = {
      ...pages[state.currentPageIndex],
      canvasType: state.canvasType,
      components: state.components,
    };
  }
  return pages;
}

export const useWhiteboardStore = create<WhiteboardStore>((set, get) => ({
  pages: [{ id: 'page-0', name: 'Page 1', canvasType: 'whiteboard', components: [] }],
  currentPageIndex: 0,
  canvasType: 'whiteboard' as CanvasType,
  components: [],
  selectedId: null,
  editingId: null,
  isPlaying: false,

  addPage: (name) => {
    const pages = saveCurrentPage(get());
    const pageId = `page-${nextPageId++}`;
    const newPage: Page = {
      id: pageId,
      name: name || `Page ${pages.length + 1}`,
      canvasType: 'whiteboard',
      components: [],
    };
    const newIndex = pages.length;
    set({
      pages: [...pages, newPage],
      currentPageIndex: newIndex,
      canvasType: 'whiteboard',
      components: [],
      selectedId: null,
      editingId: null,
    });
  },

  removePage: (index) => {
    const s = get();
    if (s.pages.length <= 1) return;
    const pages = saveCurrentPage(s);
    pages.splice(index, 1);
    const newIndex = Math.min(s.currentPageIndex, pages.length - 1);
    const target = pages[newIndex];
    set({
      pages,
      currentPageIndex: newIndex,
      canvasType: target.canvasType,
      components: target.components,
      selectedId: null,
      editingId: null,
    });
  },

  switchPage: (index) => {
    const s = get();
    if (index === s.currentPageIndex) return;
    const pages = saveCurrentPage(s);
    const target = pages[index];
    if (!target) return;
    set({
      pages,
      currentPageIndex: index,
      canvasType: target.canvasType,
      components: target.components,
      selectedId: null,
      editingId: null,
    });
  },

  renamePage: (index, name) => {
    set((s) => {
      const pages = [...s.pages];
      pages[index] = { ...pages[index], name };
      return { pages };
    });
  },

  loadPresetPages: () => {
    const pages = saveCurrentPage(get());
    const presetPages: Page[] = PAGE_PRESETS.map((preset, i) => ({
      id: `preset-${nextPageId++}`,
      name: preset.name,
      canvasType: preset.canvasType,
      components: preset.components,
    }));
    const allPages = [...pages, ...presetPages];
    set({ pages: allPages });
  },

  setCanvasType: (type) => set({ canvasType: type }),

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
