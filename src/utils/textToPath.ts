import opentype from 'opentype.js';

export interface CharPath {
  char: string;
  pathData: string;
  advanceWidth: number;
  index: number;
}

let fontPromise: Promise<opentype.Font> | null = null;

function loadFont(): Promise<opentype.Font> {
  if (!fontPromise) {
    fontPromise = opentype.load('/fonts/PatrickHand-Regular.ttf');
  }
  return fontPromise;
}

export async function textToSVGPaths(
  text: string,
  x: number,
  y: number,
  fontSize: number
): Promise<CharPath[]> {
  const font = await loadFont();
  const scale = fontSize / font.unitsPerEm;
  const results: CharPath[] = [];
  let cursorX = x;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const glyph = font.charToGlyph(char);
    const path = glyph.getPath(cursorX, y, fontSize);
    const pathData = path.toPathData(2);
    const advance = (glyph.advanceWidth || 0) * scale;

    if (char !== ' ' && pathData) {
      results.push({ char, pathData, advanceWidth: advance, index: i });
    }

    cursorX += advance;
  }

  return results;
}

export function getTextWidth(text: string, fontSize: number, font: opentype.Font): number {
  const scale = fontSize / font.unitsPerEm;
  let width = 0;
  for (let i = 0; i < text.length; i++) {
    const glyph = font.charToGlyph(text[i]);
    width += (glyph.advanceWidth || 0) * scale;
  }
  return width;
}

export { loadFont };
