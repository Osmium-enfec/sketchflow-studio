# Whiteboard Animation Builder - MVP Prompt

## 🧠 CORE PRODUCT PHILOSOPHY
- Users should NOT control animations manually
- Each component has predefined animation behavior
- Users only: Add components, Edit content, Set order (sequence), Optionally add delay

## 🖥️ APP STRUCTURE
| Top Toolbar |
| Left Sidebar (Components) | Canvas (Main Editor) |
| Bottom Panel (Order Timeline) |

## 🎨 UI DESIGN SYSTEM
- Background: #FAFAFA → Canvas: Off-white (#FFFDF7)
- Primary: Black (#111) → Accent: Soft pastel (yellow, green, blue)
- Headings: Sans-serif (Inter / Poppins)
- Canvas Text: Handwritten-style ("Patrick Hand" Google Font)
- Rounded corners (8px–16px), soft shadows, whitespace

## 📦 COMPONENTS TO BUILD (MVP)
1. **Title** - Large handwritten text, stroke animation + highlight swipe
2. **Box** - Sketch-style rectangle (rough.js), border draws, fill fades, text fades
3. **Arrow** - Hand-drawn arrow, draw from start → end
4. **Highlight** - Marker-style stroke, swipe left → right

## ⚙️ DATA MODEL
```json
{
  "components": [{
    "id": "1", "type": "title",
    "props": { "text": "Languages", "x": 100, "y": 100 },
    "order": 1, "delay": 0
  }]
}
```

## ⏱️ TIMELINE ENGINE
- Sort by order → Calculate startTime = currentTime + delay → currentTime += duration

## 🎞️ ANIMATION ENGINE
- GSAP for animations
- Each component implements getAnimationTimeline()
- Master timeline adds all component timelines

## 🧱 TECH STACK
- React + SVG + GSAP + rough.js + Zustand

## 📦 BUILD STEPS
1. Setup project + layout
2. Canvas system
3. Add components
4. Implement animations
5. Timeline system
6. Play functionality
