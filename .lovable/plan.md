

## Plan: Integrate Open Peeps Characters

### Problem
The current character options (Doodle Character, Indian Face) are custom-drawn SVGs. The user wants to use **Open Peeps**, a popular hand-drawn illustration library, for more character variety.

### Approach

Since the whiteboard canvas is SVG-based and Open Peeps renders as inline SVG React components, we'll use the `@opeepsfun/open-peeps` npm package which provides an `Effigy` component that composes body, head, face, beard, and accessories.

However, there's a key challenge: the whiteboard renders everything inside an `<svg>` element, and React components like `Effigy` render their own `<svg>`. We'll need to use `<foreignObject>` inside the SVG canvas to embed the Open Peeps HTML/React components.

### Changes

1. **Install `@opeepsfun/open-peeps`** npm package

2. **Add `openPeep` component type** to `whiteboardStore.ts`
   - New type with props: `x`, `y`, `scale`, `variant` (preset character configurations)
   - Define 4-6 preset character variants (e.g., "Explaining Guy", "Pointing Woman", "Waving Person") with pre-configured body/head/face combinations

3. **Create `OpenPeepComponent.tsx`** in `canvas/`
   - Wraps `Effigy` from `@opeepsfun/open-peeps` inside a `<foreignObject>` within the SVG canvas
   - Accepts variant prop to select from preset character configurations
   - Supports drag/select like other components

4. **Update `TopToolbar.tsx`**
   - Add "Open Peep" options to the Characters dropdown with a few preset variants (e.g., "Explaining", "Pointing", "Waving")

5. **Update `Canvas.tsx`**
   - Import and render `OpenPeepComponent` for `openPeep` type components

6. **Update `LeftSidebar.tsx`**
   - Add icon/label for the new open peep type

7. **Update `timelineEngine.ts`**
   - Add `animateOpenPeep`: fade + scale entrance animation (since these aren't stroke-based SVGs, a smooth reveal works best)

### Technical Notes
- `foreignObject` is well-supported in modern browsers and allows embedding HTML (React components) inside SVG
- The Effigy component dynamically imports SVG pieces, keeping bundle size reasonable
- Preset variants avoid exposing complex configuration UI while still offering variety

