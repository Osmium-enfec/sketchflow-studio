import { WhiteboardComponent, CanvasType } from '@/store/whiteboardStore';

export interface PagePreset {
  name: string;
  canvasType: CanvasType;
  components: WhiteboardComponent[];
}

let uid = 1000;
const id = () => String(uid++);

export const PAGE_PRESETS: PagePreset[] = [
  // ---- Page 5: Instagram Hook ----
  {
    name: '📱 Instagram Hook',
    canvasType: 'whiteboard',
    components: [
      { id: id(), type: 'title', props: { text: 'Imagine you\'re building...', x: 120, y: 60, fontSize: 52, color: 'hsl(220 15% 20%)' }, order: 1, delay: 0 },
      { id: id(), type: 'title', props: { text: 'Instagram', x: 700, y: 60, fontSize: 64, color: 'hsl(340 80% 55%)' }, order: 2, delay: 0.3 },
      { id: id(), type: 'highlight', props: { x: 690, y: 115, width: 370, height: 14, color: 'hsl(340 80% 67%)' }, order: 3, delay: 0 },
      // Phone mockup
      { id: id(), type: 'device', props: { x: 760, y: 180, scale: 1.3, variant: 'phone' }, order: 4, delay: 0.2 },
      // User icons / social elements
      { id: id(), type: 'box', props: { text: '👤 Users', x: 120, y: 220, width: 180, height: 100, fontSize: 24 }, order: 5, delay: 0.3 },
      { id: id(), type: 'box', props: { text: '❤️ Likes', x: 120, y: 360, width: 180, height: 100, fontSize: 24 }, order: 6, delay: 0.3 },
      { id: id(), type: 'box', props: { text: '💬 Comments', x: 120, y: 500, width: 180, height: 100, fontSize: 24 }, order: 7, delay: 0.3 },
      // Arrows from boxes to phone
      { id: id(), type: 'curvedArrow', props: { startX: 300, startY: 270, endX: 760, endY: 350 }, order: 8, delay: 0.2 },
      { id: id(), type: 'curvedArrow', props: { startX: 300, startY: 410, endX: 760, endY: 450 }, order: 9, delay: 0.2 },
      { id: id(), type: 'curvedArrow', props: { startX: 300, startY: 550, endX: 760, endY: 550 }, order: 10, delay: 0.2 },
      // Character
      { id: id(), type: 'openPeep', props: { x: 1500, y: 250, scale: 0.4, variant: 'explaining' }, order: 11, delay: 0.5 },
    ],
  },

  // ---- Page 6: Data Explosion ----
  {
    name: '💥 Data Explosion',
    canvasType: 'whiteboard',
    components: [
      { id: id(), type: 'title', props: { text: 'Millions of...', x: 200, y: 60, fontSize: 48, color: 'hsl(220 15% 20%)' }, order: 1, delay: 0 },
      // Overflowing data boxes
      { id: id(), type: 'box', props: { text: 'usernames', x: 100, y: 200, width: 220, height: 110, fontSize: 26 }, order: 2, delay: 0.2 },
      { id: id(), type: 'box', props: { text: 'usernames', x: 130, y: 220, width: 220, height: 110, fontSize: 26 }, order: 3, delay: 0.1 },
      { id: id(), type: 'box', props: { text: 'usernames', x: 160, y: 240, width: 220, height: 110, fontSize: 26 }, order: 4, delay: 0.1 },
      { id: id(), type: 'box', props: { text: 'likes', x: 500, y: 200, width: 220, height: 110, fontSize: 26 }, order: 5, delay: 0.2 },
      { id: id(), type: 'box', props: { text: 'likes', x: 530, y: 220, width: 220, height: 110, fontSize: 26 }, order: 6, delay: 0.1 },
      { id: id(), type: 'box', props: { text: 'likes', x: 560, y: 240, width: 220, height: 110, fontSize: 26 }, order: 7, delay: 0.1 },
      { id: id(), type: 'box', props: { text: 'messages', x: 900, y: 200, width: 220, height: 110, fontSize: 26 }, order: 8, delay: 0.2 },
      { id: id(), type: 'box', props: { text: 'messages', x: 930, y: 220, width: 220, height: 110, fontSize: 26 }, order: 9, delay: 0.1 },
      { id: id(), type: 'box', props: { text: 'messages', x: 960, y: 240, width: 220, height: 110, fontSize: 26 }, order: 10, delay: 0.1 },
      // Labels
      { id: id(), type: 'title', props: { text: 'usernames', x: 160, y: 420, fontSize: 32, color: 'hsl(217 91% 60%)' }, order: 11, delay: 0.3 },
      { id: id(), type: 'title', props: { text: 'likes', x: 560, y: 420, fontSize: 32, color: 'hsl(0 80% 58%)' }, order: 12, delay: 0.3 },
      { id: id(), type: 'title', props: { text: 'messages', x: 930, y: 420, fontSize: 32, color: 'hsl(130 55% 40%)' }, order: 13, delay: 0.3 },
      // Highlights
      { id: id(), type: 'highlight', props: { x: 140, y: 455, width: 210, height: 12, color: 'hsl(217 91% 75%)' }, order: 14, delay: 0 },
      { id: id(), type: 'highlight', props: { x: 540, y: 455, width: 120, height: 12, color: 'hsl(0 80% 75%)' }, order: 15, delay: 0 },
      { id: id(), type: 'highlight', props: { x: 900, y: 455, width: 220, height: 12, color: 'hsl(130 55% 70%)' }, order: 16, delay: 0 },
      // Gradient arrow showing overflow
      { id: id(), type: 'gradientArrow', props: { startX: 600, startY: 520, endX: 600, endY: 750 }, order: 17, delay: 0.4 },
      { id: id(), type: 'title', props: { text: 'How to store all this? 🤔', x: 420, y: 780, fontSize: 36, color: 'hsl(280 60% 55%)' }, order: 18, delay: 0.5 },
    ],
  },

  // ---- Page 7: Variables Intro ----
  {
    name: '📦 Variables Intro',
    canvasType: 'whiteboard',
    components: [
      { id: id(), type: 'title', props: { text: 'That\'s where variables come in.', x: 200, y: 80, fontSize: 48, color: 'hsl(220 15% 20%)' }, order: 1, delay: 0 },
      { id: id(), type: 'highlight', props: { x: 190, y: 125, width: 750, height: 14, color: 'hsl(48 100% 67%)' }, order: 2, delay: 0 },
      // Big box labeled "x"
      { id: id(), type: 'foldedBox', props: { text: 'x', x: 350, y: 250, width: 300, height: 250 }, order: 3, delay: 0.3 },
      { id: id(), type: 'title', props: { text: 'x', x: 200, y: 340, fontSize: 72, color: 'hsl(217 91% 60%)' }, order: 4, delay: 0.4 },
      // Arrow pointing from x to the box
      { id: id(), type: 'arrow', props: { startX: 260, startY: 370, endX: 350, endY: 370 }, order: 5, delay: 0.3 },
      // Data inside the box
      { id: id(), type: 'title', props: { text: '"data"', x: 420, y: 350, fontSize: 42, color: 'hsl(130 55% 40%)' }, order: 6, delay: 0.5 },
      // Description
      { id: id(), type: 'content', props: { text: 'A **variable** is a named container\nthat holds your data.', x: 800, y: 300, fontSize: 28, width: 400 }, order: 7, delay: 0.6 },
      // Character
      { id: id(), type: 'openPeep', props: { x: 1400, y: 350, scale: 0.35, variant: 'pointing' }, order: 8, delay: 0.5 },
    ],
  },

  // ---- Page 8: Basic Example ----
  {
    name: '💻 Basic Example',
    canvasType: 'whiteboard',
    components: [
      { id: id(), type: 'title', props: { text: 'x = 10', x: 400, y: 80, fontSize: 64, color: 'hsl(220 15% 20%)' }, order: 1, delay: 0 },
      { id: id(), type: 'highlight', props: { x: 390, y: 138, width: 250, height: 14, color: 'hsl(48 100% 67%)' }, order: 2, delay: 0 },
      // Code box
      { id: id(), type: 'codeBox', props: { x: 200, y: 220, width: 500, height: 200 }, order: 3, delay: 0.3 },
      // Code text inside
      { id: id(), type: 'title', props: { text: 'x = 10', x: 340, y: 340, fontSize: 48, color: 'hsl(130 55% 60%)' }, order: 4, delay: 0.5 },
      // Visual box representation
      { id: id(), type: 'foldedBox', props: { text: '10', x: 900, y: 250, width: 200, height: 180 }, order: 5, delay: 0.4 },
      { id: id(), type: 'title', props: { text: 'x', x: 960, y: 200, fontSize: 42, color: 'hsl(217 91% 60%)' }, order: 6, delay: 0.5 },
      // Arrow from code to box
      { id: id(), type: 'arrow', props: { startX: 700, startY: 340, endX: 900, endY: 340 }, order: 7, delay: 0.4 },
      // Character
      { id: id(), type: 'openPeep', props: { x: 1300, y: 200, scale: 0.4, variant: 'explaining' }, order: 8, delay: 0.6 },
    ],
  },

  // ---- Page 9: Explanation Breakdown ----
  {
    name: '🔍 Explanation',
    canvasType: 'whiteboard',
    components: [
      { id: id(), type: 'title', props: { text: 'Breaking it down', x: 350, y: 60, fontSize: 48, color: 'hsl(220 15% 20%)' }, order: 1, delay: 0 },
      // Left side: Variable name
      { id: id(), type: 'title', props: { text: 'x', x: 280, y: 250, fontSize: 96, color: 'hsl(217 91% 60%)' }, order: 2, delay: 0.2 },
      { id: id(), type: 'highlight', props: { x: 200, y: 350, width: 200, height: 14, color: 'hsl(217 91% 75%)' }, order: 3, delay: 0.1 },
      { id: id(), type: 'title', props: { text: '← variable', x: 200, y: 390, fontSize: 32, color: 'hsl(220 15% 40%)' }, order: 4, delay: 0.3 },
      { id: id(), type: 'box', props: { text: 'Name / Label', x: 160, y: 450, width: 260, height: 80, fontSize: 22 }, order: 5, delay: 0.3 },
      // Center divider
      { id: id(), type: 'gradientArrow', props: { startX: 560, startY: 200, endX: 560, endY: 600 }, order: 6, delay: 0.3 },
      { id: id(), type: 'title', props: { text: '=', x: 530, y: 300, fontSize: 72, color: 'hsl(0 0% 50%)' }, order: 7, delay: 0.2 },
      // Right side: Value
      { id: id(), type: 'title', props: { text: '10', x: 800, y: 250, fontSize: 96, color: 'hsl(130 55% 40%)' }, order: 8, delay: 0.2 },
      { id: id(), type: 'highlight', props: { x: 750, y: 350, width: 180, height: 14, color: 'hsl(130 55% 70%)' }, order: 9, delay: 0.1 },
      { id: id(), type: 'title', props: { text: 'value →', x: 770, y: 390, fontSize: 32, color: 'hsl(220 15% 40%)' }, order: 10, delay: 0.3 },
      { id: id(), type: 'box', props: { text: 'Stored Data', x: 720, y: 450, width: 260, height: 80, fontSize: 22 }, order: 11, delay: 0.3 },
      // Character
      { id: id(), type: 'openPeep', props: { x: 1300, y: 250, scale: 0.35, variant: 'coffee' }, order: 12, delay: 0.6 },
    ],
  },

  // ---- Page 10: Analogy ----
  {
    name: '📦 Box Analogy',
    canvasType: 'whiteboard',
    components: [
      { id: id(), type: 'title', props: { text: 'Think of it like a box...', x: 280, y: 60, fontSize: 48, color: 'hsl(220 15% 20%)' }, order: 1, delay: 0 },
      { id: id(), type: 'highlight', props: { x: 270, y: 108, width: 650, height: 14, color: 'hsl(48 100% 67%)' }, order: 2, delay: 0 },
      // Big physical box
      { id: id(), type: 'foldedBox', props: { text: '🎁', x: 380, y: 200, width: 350, height: 300 }, order: 3, delay: 0.3 },
      // Label on outside
      { id: id(), type: 'box', props: { text: '🏷️ Label', x: 200, y: 280, width: 150, height: 70, fontSize: 20 }, order: 4, delay: 0.4 },
      { id: id(), type: 'arrow', props: { startX: 350, startY: 315, endX: 380, endY: 315 }, order: 5, delay: 0.3 },
      // Item inside  
      { id: id(), type: 'title', props: { text: 'item inside', x: 440, y: 380, fontSize: 32, color: 'hsl(130 55% 40%)' }, order: 6, delay: 0.5 },
      // Explanation
      { id: id(), type: 'content', props: { text: '**Label** = variable name\n**Item inside** = the value\n**Box** = memory slot', x: 850, y: 250, fontSize: 26, width: 380 }, order: 7, delay: 0.5 },
      // Character pointing
      { id: id(), type: 'openPeep', props: { x: 1350, y: 350, scale: 0.35, variant: 'pointing' }, order: 8, delay: 0.6 },
    ],
  },

  // ---- Page 11: More Examples ----
  {
    name: '✏️ More Examples',
    canvasType: 'whiteboard',
    components: [
      { id: id(), type: 'title', props: { text: 'More Examples', x: 400, y: 60, fontSize: 48, color: 'hsl(220 15% 20%)' }, order: 1, delay: 0 },
      // Box 1: name → Virat
      { id: id(), type: 'foldedBox', props: { text: 'Virat', x: 200, y: 220, width: 280, height: 200 }, order: 2, delay: 0.2 },
      { id: id(), type: 'title', props: { text: 'name', x: 270, y: 180, fontSize: 36, color: 'hsl(217 91% 60%)' }, order: 3, delay: 0.3 },
      { id: id(), type: 'highlight', props: { x: 260, y: 210, width: 120, height: 10, color: 'hsl(217 91% 75%)' }, order: 4, delay: 0 },
      // Code representation
      { id: id(), type: 'title', props: { text: 'name = "Virat"', x: 200, y: 470, fontSize: 28, color: 'hsl(130 55% 40%)' }, order: 5, delay: 0.4 },
      // Box 2: age → 25
      { id: id(), type: 'foldedBox', props: { text: '25', x: 650, y: 220, width: 280, height: 200 }, order: 6, delay: 0.2 },
      { id: id(), type: 'title', props: { text: 'age', x: 740, y: 180, fontSize: 36, color: 'hsl(0 80% 58%)' }, order: 7, delay: 0.3 },
      { id: id(), type: 'highlight', props: { x: 730, y: 210, width: 80, height: 10, color: 'hsl(0 80% 75%)' }, order: 8, delay: 0 },
      // Code representation
      { id: id(), type: 'title', props: { text: 'age = 25', x: 680, y: 470, fontSize: 28, color: 'hsl(130 55% 40%)' }, order: 9, delay: 0.4 },
      // Arrow between
      { id: id(), type: 'arrow', props: { startX: 480, startY: 320, endX: 650, endY: 320 }, order: 10, delay: 0.3 },
      // Character
      { id: id(), type: 'walkingCharacter', props: { x: 1100, y: 250, width: 250, height: 250, flipped: true, walkDistance: 150, variant: 'happyBoy' }, order: 11, delay: 0.5 },
    ],
  },

  // ---- Page 12: Data Types Hint ----
  {
    name: '🔤 Data Types',
    canvasType: 'whiteboard',
    components: [
      { id: id(), type: 'title', props: { text: 'Now we\'re storing text and numbers', x: 200, y: 60, fontSize: 44, color: 'hsl(220 15% 20%)' }, order: 1, delay: 0 },
      { id: id(), type: 'highlight', props: { x: 190, y: 105, width: 800, height: 14, color: 'hsl(48 100% 67%)' }, order: 2, delay: 0 },
      // String type
      { id: id(), type: 'box', props: { text: 'string', x: 200, y: 220, width: 200, height: 80, fontSize: 28 }, order: 3, delay: 0.2 },
      { id: id(), type: 'arrow', props: { startX: 400, startY: 260, endX: 520, endY: 260 }, order: 4, delay: 0.3 },
      { id: id(), type: 'foldedBox', props: { text: '"Virat"', x: 520, y: 200, width: 250, height: 120 }, order: 5, delay: 0.3 },
      { id: id(), type: 'highlight', props: { x: 520, y: 325, width: 250, height: 12, color: 'hsl(217 91% 75%)' }, order: 6, delay: 0 },
      // Number type
      { id: id(), type: 'box', props: { text: 'number', x: 200, y: 430, width: 200, height: 80, fontSize: 28 }, order: 7, delay: 0.2 },
      { id: id(), type: 'arrow', props: { startX: 400, startY: 470, endX: 520, endY: 470 }, order: 8, delay: 0.3 },
      { id: id(), type: 'foldedBox', props: { text: '25', x: 520, y: 410, width: 250, height: 120 }, order: 9, delay: 0.3 },
      { id: id(), type: 'highlight', props: { x: 520, y: 535, width: 250, height: 12, color: 'hsl(130 55% 70%)' }, order: 10, delay: 0 },
      // Explanation
      { id: id(), type: 'content', props: { text: '**string** → text wrapped in quotes\n**number** → plain digits, no quotes', x: 900, y: 300, fontSize: 24, width: 400 }, order: 11, delay: 0.5 },
      // Character
      { id: id(), type: 'openPeep', props: { x: 1350, y: 200, scale: 0.35, variant: 'blazer' }, order: 12, delay: 0.6 },
    ],
  },

  // ---- Page 13: Closing Statement ----
  {
    name: '🏗️ Closing',
    canvasType: 'whiteboard',
    components: [
      { id: id(), type: 'title', props: { text: 'Foundation of every program', x: 280, y: 60, fontSize: 48, color: 'hsl(220 15% 20%)' }, order: 1, delay: 0 },
      { id: id(), type: 'highlight', props: { x: 270, y: 108, width: 720, height: 14, color: 'hsl(48 100% 67%)' }, order: 2, delay: 0 },
      // Pyramid - base (widest)
      { id: id(), type: 'box', props: { text: '📦 Variables', x: 250, y: 550, width: 600, height: 100, fontSize: 32 }, order: 3, delay: 0.3 },
      // Mid layer
      { id: id(), type: 'box', props: { text: '⚙️ Logic & Functions', x: 330, y: 420, width: 440, height: 100, fontSize: 26 }, order: 4, delay: 0.4 },
      // Upper layer
      { id: id(), type: 'box', props: { text: '🧩 Modules', x: 400, y: 290, width: 300, height: 100, fontSize: 24 }, order: 5, delay: 0.5 },
      // Top
      { id: id(), type: 'foldedBox', props: { text: '🚀 Apps', x: 460, y: 170, width: 180, height: 90 }, order: 6, delay: 0.6 },
      // Gradient arrow showing the build-up
      { id: id(), type: 'gradientArrow', props: { startX: 160, startY: 620, endX: 160, endY: 200 }, order: 7, delay: 0.4 },
      { id: id(), type: 'title', props: { text: 'Build up ↑', x: 80, y: 400, fontSize: 24, color: 'hsl(280 60% 55%)' }, order: 8, delay: 0.5 },
      // Character celebrating
      { id: id(), type: 'walkingCharacter', props: { x: 1100, y: 300, width: 250, height: 250, flipped: true, walkDistance: 100, variant: 'happyBoy' }, order: 9, delay: 0.7 },
      // Closing text
      { id: id(), type: 'content', props: { text: 'Everything starts with **variables**.\nMaster them, and you master programming.', x: 900, y: 550, fontSize: 24, width: 420 }, order: 10, delay: 0.8 },
    ],
  },
];
