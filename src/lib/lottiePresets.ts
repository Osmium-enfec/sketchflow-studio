// Lottie presets: inline JSON for effects + remote URLs for character animations

// ─── Inline effect presets ───

function createBouncingBall(): object {
  return {
    v: "5.7.1", fr: 30, ip: 0, op: 60, w: 200, h: 200, nm: "Bouncing Ball",
    layers: [
      {
        ddd: 0, ind: 1, ty: 4, nm: "Ball", sr: 1,
        ks: {
          o: { a: 0, k: 100 }, r: { a: 0, k: 0 },
          p: { a: 1, k: [
            { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 0, s: [100, 150, 0], to: [0, -15, 0], ti: [0, 0, 0] },
            { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 15, s: [100, 60, 0], to: [0, 0, 0], ti: [0, -15, 0] },
            { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 30, s: [100, 150, 0], to: [0, 0, 0], ti: [0, 0, 0] },
            { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 45, s: [100, 60, 0], to: [0, 0, 0], ti: [0, -15, 0] },
            { t: 60, s: [100, 150, 0] }
          ]},
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 1, k: [
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 28, s: [100, 100, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 30, s: [130, 70, 100] },
            { t: 35, s: [100, 100, 100] }
          ]}
        },
        ao: 0,
        shapes: [{ ty: "gr", it: [
          { ty: "el", d: 1, s: { a: 0, k: [50, 50] }, p: { a: 0, k: [0, 0] }, nm: "Ellipse" },
          { ty: "fl", c: { a: 0, k: [0.29, 0.56, 0.89, 1] }, o: { a: 0, k: 100 }, r: 1, nm: "Fill" },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
        ], nm: "Group" }],
        ip: 0, op: 60, st: 0, bm: 0
      },
      {
        ddd: 0, ind: 2, ty: 4, nm: "Shadow", sr: 1,
        ks: {
          o: { a: 1, k: [
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [40] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 15, s: [15] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 30, s: [40] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 45, s: [15] },
            { t: 60, s: [40] }
          ]},
          r: { a: 0, k: 0 },
          p: { a: 0, k: [100, 175, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 1, k: [
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [100, 100, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 15, s: [60, 100, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 30, s: [100, 100, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 45, s: [60, 100, 100] },
            { t: 60, s: [100, 100, 100] }
          ]}
        },
        ao: 0,
        shapes: [{ ty: "gr", it: [
          { ty: "el", d: 1, s: { a: 0, k: [60, 10] }, p: { a: 0, k: [0, 0] }, nm: "Shadow Ellipse" },
          { ty: "fl", c: { a: 0, k: [0, 0, 0, 1] }, o: { a: 0, k: 25 }, r: 1, nm: "Fill" },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
        ], nm: "Group" }],
        ip: 0, op: 60, st: 0, bm: 0
      }
    ]
  };
}

function createPulse(): object {
  const rings = [0, 1, 2].map((i) => ({
    ddd: 0, ind: i + 1, ty: 4, nm: `Ring ${i}`, sr: 1,
    ks: {
      o: { a: 1, k: [
        { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: i * 8, s: [80] },
        { t: 30 + i * 8, s: [0] }
      ]},
      r: { a: 0, k: 0 },
      p: { a: 0, k: [100, 100, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 1, k: [
        { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: i * 8, s: [30, 30, 100] },
        { t: 30 + i * 8, s: [160, 160, 100] }
      ]}
    },
    ao: 0,
    shapes: [{ ty: "gr", it: [
      { ty: "el", d: 1, s: { a: 0, k: [80, 80] }, p: { a: 0, k: [0, 0] }, nm: "Ring" },
      { ty: "st", c: { a: 0, k: [0.29, 0.56, 0.89, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 3 }, lc: 1, lj: 1, nm: "Stroke" },
      { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
    ], nm: "Group" }],
    ip: 0, op: 60, st: 0, bm: 0
  }));

  const center = {
    ddd: 0, ind: 4, ty: 4, nm: "Center", sr: 1,
    ks: {
      o: { a: 0, k: 100 }, r: { a: 0, k: 0 },
      p: { a: 0, k: [100, 100, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 1, k: [
        { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [100, 100, 100] },
        { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 15, s: [120, 120, 100] },
        { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 30, s: [100, 100, 100] },
        { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 45, s: [120, 120, 100] },
        { t: 60, s: [100, 100, 100] }
      ]}
    },
    ao: 0,
    shapes: [{ ty: "gr", it: [
      { ty: "el", d: 1, s: { a: 0, k: [30, 30] }, p: { a: 0, k: [0, 0] }, nm: "Center Dot" },
      { ty: "fl", c: { a: 0, k: [0.29, 0.56, 0.89, 1] }, o: { a: 0, k: 100 }, r: 1, nm: "Fill" },
      { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
    ], nm: "Group" }],
    ip: 0, op: 60, st: 0, bm: 0
  };

  return { v: "5.7.1", fr: 30, ip: 0, op: 60, w: 200, h: 200, nm: "Pulse", layers: [...rings, center] };
}

function createSpinner(): object {
  return {
    v: "5.7.1", fr: 30, ip: 0, op: 60, w: 200, h: 200, nm: "Spinner",
    layers: [
      {
        ddd: 0, ind: 1, ty: 4, nm: "Spinner", sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 1, k: [{ i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [0] }, { t: 60, s: [360] }] },
          p: { a: 0, k: [100, 100, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] }
        },
        ao: 0,
        shapes: [{ ty: "gr", it: [
          { ty: "el", d: 1, s: { a: 0, k: [70, 70] }, p: { a: 0, k: [0, 0] }, nm: "Arc" },
          { ty: "tm", s: { a: 0, k: 0 }, e: { a: 0, k: 30 }, o: { a: 0, k: 0 }, nm: "Trim" },
          { ty: "st", c: { a: 0, k: [0.29, 0.56, 0.89, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 6 }, lc: 2, lj: 1, nm: "Stroke" },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
        ], nm: "Group" }],
        ip: 0, op: 60, st: 0, bm: 0
      },
      {
        ddd: 0, ind: 2, ty: 4, nm: "Track", sr: 1,
        ks: { o: { a: 0, k: 20 }, r: { a: 0, k: 0 }, p: { a: 0, k: [100, 100, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] } },
        ao: 0,
        shapes: [{ ty: "gr", it: [
          { ty: "el", d: 1, s: { a: 0, k: [70, 70] }, p: { a: 0, k: [0, 0] }, nm: "Track" },
          { ty: "st", c: { a: 0, k: [0.29, 0.56, 0.89, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 6 }, lc: 2, lj: 1, nm: "Stroke" },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
        ], nm: "Group" }],
        ip: 0, op: 60, st: 0, bm: 0
      }
    ]
  };
}

function createCheckmark(): object {
  return {
    v: "5.7.1", fr: 30, ip: 0, op: 45, w: 200, h: 200, nm: "Checkmark",
    layers: [
      {
        ddd: 0, ind: 1, ty: 4, nm: "Circle", sr: 1,
        ks: {
          o: { a: 0, k: 100 }, r: { a: 0, k: 0 },
          p: { a: 0, k: [100, 100, 0] }, a: { a: 0, k: [0, 0, 0] },
          s: { a: 1, k: [
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [0, 0, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 12, s: [110, 110, 100] },
            { t: 18, s: [100, 100, 100] }
          ]}
        },
        ao: 0,
        shapes: [{ ty: "gr", it: [
          { ty: "el", d: 1, s: { a: 0, k: [80, 80] }, p: { a: 0, k: [0, 0] }, nm: "Circle" },
          { ty: "fl", c: { a: 0, k: [0.2, 0.78, 0.35, 1] }, o: { a: 0, k: 100 }, r: 1, nm: "Fill" },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
        ], nm: "Group" }],
        ip: 0, op: 45, st: 0, bm: 0
      },
      {
        ddd: 0, ind: 2, ty: 4, nm: "Check", sr: 1,
        ks: {
          o: { a: 0, k: 100 }, r: { a: 0, k: 0 },
          p: { a: 0, k: [100, 100, 0] }, a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] }
        },
        ao: 0,
        shapes: [{ ty: "gr", it: [
          { ty: "sh", d: 1, ks: { a: 0, k: { i: [[0,0],[0,0],[0,0]], o: [[0,0],[0,0],[0,0]], v: [[-18,2],[-6,14],[20,-14]], c: false } }, nm: "Check Path" },
          { ty: "tm", s: { a: 0, k: 0 }, e: { a: 1, k: [{ i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 14, s: [0] }, { t: 30, s: [100] }] }, o: { a: 0, k: 0 }, nm: "Trim" },
          { ty: "st", c: { a: 0, k: [1,1,1,1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 5 }, lc: 2, lj: 2, nm: "Stroke" },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
        ], nm: "Group" }],
        ip: 0, op: 45, st: 0, bm: 0
      }
    ]
  };
}

function createWaveform(): object {
  const bars = 5;
  const barWidth = 14;
  const gap = 10;
  const totalW = bars * barWidth + (bars - 1) * gap;
  const startX = (200 - totalW) / 2 + barWidth / 2;

  return {
    v: "5.7.1", fr: 30, ip: 0, op: 60, w: 200, h: 200, nm: "Waveform",
    layers: Array.from({ length: bars }, (_, i) => {
      const delay = i * 4;
      const maxScale = 150 + Math.sin(i * 1.2) * 80;
      return {
        ddd: 0, ind: i + 1, ty: 4, nm: `Bar ${i}`, sr: 1,
        ks: {
          o: { a: 0, k: 100 }, r: { a: 0, k: 0 },
          p: { a: 0, k: [startX + i * (barWidth + gap), 100, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 1, k: [
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: delay, s: [100, 40, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: delay + 12, s: [100, maxScale, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: delay + 24, s: [100, 40, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: Math.min(delay + 36, 55), s: [100, maxScale * 0.7, 100] },
            { t: 60, s: [100, 40, 100] }
          ]}
        },
        ao: 0,
        shapes: [{ ty: "gr", it: [
          { ty: "rc", d: 1, s: { a: 0, k: [barWidth, 50] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 4 }, nm: "Bar" },
          { ty: "fl", c: { a: 0, k: [0.29 + i * 0.06, 0.56 - i * 0.04, 0.89, 1] }, o: { a: 0, k: 100 }, r: 1, nm: "Fill" },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
        ], nm: "Group" }],
        ip: 0, op: 60, st: 0, bm: 0
      };
    })
  };
}

// ─── Preset registry ───

export interface LottiePresetInfo {
  label: string;
  category: 'character' | 'effect';
  source: 'inline' | 'url';
  url?: string;
}

const inlineFactories: Record<string, () => object> = {
  bouncing: createBouncingBall,
  pulse: createPulse,
  spinner: createSpinner,
  checkmark: createCheckmark,
  waveform: createWaveform,
};

// Character animation URLs from LottieFiles CDN (free, CORS-enabled)
export const LOTTIE_PRESETS: Record<string, LottiePresetInfo> = {
  // Characters (remote)
  walking: {
    label: 'Walking',
    category: 'character',
    source: 'url',
    url: 'https://lottie.host/a748cfc6-d769-459e-a197-bff765fa262a/xgroR1pXjk.lottie',
  },
  sayHello: {
    label: 'Say Hello',
    category: 'character',
    source: 'url',
    url: 'https://assets3.lottiefiles.com/packages/lf20_1pxqjqps.json',
  },
  working: {
    label: 'Working',
    category: 'character',
    source: 'url',
    url: 'https://assets10.lottiefiles.com/packages/lf20_kyu7xb1v.json',
  },
  // Effects (inline)
  bouncing: { label: 'Bouncing Ball', category: 'effect', source: 'inline' },
  pulse: { label: 'Pulse', category: 'effect', source: 'inline' },
  spinner: { label: 'Spinner', category: 'effect', source: 'inline' },
  checkmark: { label: 'Checkmark', category: 'effect', source: 'inline' },
  waveform: { label: 'Waveform', category: 'effect', source: 'inline' },
  // Custom URL
  custom: { label: 'Custom URL', category: 'character', source: 'url' },
};

/**
 * Get Lottie data for inline presets. Returns null for URL-based presets.
 */
export function getLottieData(preset: string): object | null {
  const factory = inlineFactories[preset];
  return factory ? factory() : null;
}

/**
 * Get the URL for a URL-based preset, or the custom URL
 */
export function getLottieUrl(preset: string, customUrl?: string): string | null {
  if (preset === 'custom' && customUrl) return customUrl;
  const info = LOTTIE_PRESETS[preset];
  return info?.url || null;
}
