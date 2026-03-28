

# Add More Lottie Character Animations

## Summary
Extend the walking character system to support multiple Lottie animation variants (male walking, running, dancing, etc.) using the same pattern as the female walking character. Each variant will be a separate JSON asset file, selectable from a dropdown in the property panel.

## How It Works

The current `walkingCharacter` component is hardcoded to one JSON file. We'll make it **variant-aware** so users can switch between different character animations.

## What We Need

1. **Source Lottie JSON files** — We need to find and download free Lottie JSON files for:
   - Male Walking
   - Running (male/female)
   - Dancing
   - Waving/Greeting

   These will be sourced from LottieFiles (free tier) and saved locally in `src/assets/`.

2. **Create a variant registry** (`src/lib/characterLottieVariants.ts`)
   - Maps variant keys to their JSON imports and display labels
   - Example: `{ key: 'femaleWalking', label: 'Female Walking', data: femaleWalkingData }`

3. **Update `WalkingCharacterComponent.tsx`**
   - Accept a `variant` prop (default: `'femaleWalking'`)
   - Dynamically load the correct JSON based on variant
   - Rename internally to be more generic (handles walking, running, etc.)

4. **Update the property panel in `Canvas.tsx`**
   - Add a variant selector dropdown alongside the existing flip/distance controls
   - Show animation-specific controls (e.g., hide "walk distance" for dancing)

5. **Update `TopToolbar.tsx`**
   - Expand the Walking submenu to show all available character animation variants

6. **Update `whiteboardStore.ts`**
   - Add `variant` to walkingCharacter default props

7. **Update `timelineEngine.ts`**
   - Adjust animation behavior per variant (walking translates, dancing stays in place)

## Important Constraint
We need actual Lottie JSON files. I'll search LottieFiles for free, high-quality character animations and download them as local assets — same approach as the female walking character.

## Files to Create/Modify
- **New:** `src/assets/male-walking.json` (+ other animation JSONs)
- **New:** `src/lib/characterLottieVariants.ts`
- **Edit:** `WalkingCharacterComponent.tsx` — variant support
- **Edit:** `Canvas.tsx` — variant dropdown in property panel
- **Edit:** `TopToolbar.tsx` — expanded character menu
- **Edit:** `whiteboardStore.ts` — variant in default props
- **Edit:** `timelineEngine.ts` — variant-aware animation logic

