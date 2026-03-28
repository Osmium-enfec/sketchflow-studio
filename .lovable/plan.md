

# Character Animations — Approach & Plan

## The Challenge
Your characters are static SVG illustrations. Adding walking, talking, smiling requires either **skeletal animation** of existing SVG parts or **pre-built animated assets**.

## Approach Options

### Option A: GSAP Skeletal Animation on Existing SVGs (Recommended)
Animate individual SVG groups (mouth, arms, legs, eyes) using GSAP timelines. Since your characters are already split into named groups (`indian-lips`, `indian-eyes`, `peep-body`, etc.), we can define animation presets that manipulate these parts.

**What we can do:**
- **Smiling** — morph mouth path from neutral → smile curve
- **Talking** — loop mouth open/close with slight head bob
- **Blinking** — already implemented on Indian character, extend to others
- **Waving** — rotate arm group back and forth
- **Nodding** — subtle Y translation on head group
- **Breathing** — scale torso slightly on a loop

**Pros:** No new dependencies, works with existing SVGs, lightweight
**Cons:** Complex animations (walking with legs) require well-structured SVG parts; limited to what the SVG anatomy allows

### Option B: Lottie Animations (for richer pre-made animations)
Use `lottie-react` to embed pre-built character animations (walk cycles, gestures) from LottieFiles.

**Pros:** Professional quality, huge free library, smooth complex animations
**Cons:** Characters won't match your current art style, adds ~50KB dependency, animations are pre-baked (less customizable)

### Option C: Hybrid (Best of both)
- Use **GSAP for simple expressions** (smile, talk, blink, nod, wave) on your existing Open Peeps and Indian characters
- Add a new **Lottie character component** for complex full-body animations (walking, dancing) that users can drop onto the canvas

## Recommended Plan: Hybrid Approach

### Step 1: Define animation presets per character type
Add an `animation` prop to character components: `'idle' | 'talking' | 'smiling' | 'waving' | 'nodding'`

### Step 2: Implement GSAP animation functions
Create `src/lib/characterAnimations.ts` with reusable GSAP timelines:
- `createTalkingAnimation(mouthEl)` — mouth open/close loop
- `createSmilingAnimation(mouthEl)` — morph to smile
- `createWavingAnimation(armEl)` — arm rotation
- `createNoddingAnimation(headEl)` — head bob

### Step 3: Wire animations into existing components
- Indian Character: already has refs for eyes/brows/head — add mouth, body refs
- Open Peeps: add ref-based targeting for body parts
- Apply selected animation preset via `useEffect`

### Step 4: Add animation selector in the property panel
When a character is selected, show animation dropdown in the floating toolbar (same pattern as variant selection)

### Step 5 (Optional): Add Lottie component
New `LottieCharacterComponent` for importing walk cycles and complex animations from LottieFiles JSON.

### Files to create/modify
- **New:** `src/lib/characterAnimations.ts` — animation timeline factories
- **Edit:** `IndianCharacterComponent.tsx` — add animation prop support
- **Edit:** `OpenPeepComponent.tsx` — add refs and animation support
- **Edit:** `Canvas.tsx` — animation selector in property panel
- **Edit:** `whiteboardStore.ts` — add `animation` to component props
- **Optional new:** `LottieCharacterComponent.tsx` + `lottie-react` dependency

