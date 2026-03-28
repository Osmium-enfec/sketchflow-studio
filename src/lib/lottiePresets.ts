// Inline Lottie JSON animation data — no external fetch needed

function createBouncingBall() {
  return {
    v: "5.7.1", fr: 30, ip: 0, op: 60, w: 200, h: 200,
    layers: [{
      ty: 4, nm: "ball", sr: 1, ks: {
        o: { a: 0, k: 100 },
        p: { a: 1, k: [
          { t: 0, s: [100, 160], to: [0, -10], ti: [0, 0] },
          { t: 15, s: [100, 60], to: [0, 0], ti: [0, -10] },
          { t: 30, s: [100, 160], to: [0, 10], ti: [0, 0] },
          { t: 45, s: [100, 60], to: [0, 0], ti: [0, -10] },
          { t: 60, s: [100, 160] }
        ]},
        s: { a: 1, k: [
          { t: 0, s: [100, 100] },
          { t: 28, s: [100, 100] },
          { t: 30, s: [120, 80] },
          { t: 34, s: [100, 100] },
          { t: 58, s: [100, 100] },
          { t: 60, s: [120, 80] }
        ]},
        r: { a: 0, k: 0 }, a: { a: 0, k: [0, 0] }
      },
      shapes: [{
        ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [50, 50] }
      }, {
        ty: "fl", c: { a: 0, k: [0.29, 0.56, 0.89, 1] }, o: { a: 0, k: 100 }
      }],
      ip: 0, op: 60, st: 0
    }, {
      ty: 4, nm: "shadow", sr: 1, ks: {
        o: { a: 1, k: [
          { t: 0, s: [40] }, { t: 15, s: [15] }, { t: 30, s: [40] }, { t: 45, s: [15] }, { t: 60, s: [40] }
        ]},
        p: { a: 0, k: [100, 180] },
        s: { a: 1, k: [
          { t: 0, s: [100, 100] }, { t: 15, s: [60, 100] }, { t: 30, s: [100, 100] }, { t: 45, s: [60, 100] }, { t: 60, s: [100, 100] }
        ]},
        r: { a: 0, k: 0 }, a: { a: 0, k: [0, 0] }
      },
      shapes: [{
        ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [60, 12] }
      }, {
        ty: "fl", c: { a: 0, k: [0, 0, 0, 1] }, o: { a: 0, k: 30 }
      }],
      ip: 0, op: 60, st: 0
    }]
  };
}

function createPulse() {
  return {
    v: "5.7.1", fr: 30, ip: 0, op: 60, w: 200, h: 200,
    layers: [0, 1, 2].map((i) => ({
      ty: 4, nm: `ring${i}`, sr: 1, ks: {
        o: { a: 1, k: [
          { t: i * 10, s: [80] }, { t: 30 + i * 10, s: [0] }, { t: 60, s: [0] }
        ]},
        p: { a: 0, k: [100, 100] },
        s: { a: 1, k: [
          { t: i * 10, s: [30, 30] }, { t: 30 + i * 10, s: [150, 150] }, { t: 60, s: [150, 150] }
        ]},
        r: { a: 0, k: 0 }, a: { a: 0, k: [0, 0] }
      },
      shapes: [{
        ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [80, 80] }
      }, {
        ty: "st", c: { a: 0, k: [0.29, 0.56, 0.89, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 3 }
      }],
      ip: 0, op: 60, st: 0
    })).concat([{
      ty: 4, nm: "center", sr: 1, ks: {
        o: { a: 0, k: 100 },
        p: { a: 0, k: [100, 100] },
        s: { a: 1, k: [
          { t: 0, s: [100, 100] }, { t: 15, s: [115, 115] }, { t: 30, s: [100, 100] }, { t: 45, s: [115, 115] }, { t: 60, s: [100, 100] }
        ]},
        r: { a: 0, k: 0 }, a: { a: 0, k: [0, 0] }
      },
      shapes: [{
        ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [30, 30] }
      }, {
        ty: "fl", c: { a: 0, k: [0.29, 0.56, 0.89, 1] }, o: { a: 0, k: 100 }
      }],
      ip: 0, op: 60, st: 0
    }] as any)
  };
}

function createSpinner() {
  return {
    v: "5.7.1", fr: 30, ip: 0, op: 60, w: 200, h: 200,
    layers: [{
      ty: 4, nm: "spinner", sr: 1, ks: {
        o: { a: 0, k: 100 },
        p: { a: 0, k: [100, 100] },
        s: { a: 0, k: [100, 100] },
        r: { a: 1, k: [{ t: 0, s: [0] }, { t: 60, s: [360] }] },
        a: { a: 0, k: [0, 0] }
      },
      shapes: [{
        ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [70, 70] }
      }, {
        ty: "st", c: { a: 0, k: [0.29, 0.56, 0.89, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 6 },
        d: [{ n: "d", nm: "dash", v: { a: 0, k: 40 } }, { n: "g", nm: "gap", v: { a: 0, k: 80 } }]
      }],
      ip: 0, op: 60, st: 0
    }]
  };
}

function createCheckmark() {
  return {
    v: "5.7.1", fr: 30, ip: 0, op: 45, w: 200, h: 200,
    layers: [{
      ty: 4, nm: "circle", sr: 1, ks: {
        o: { a: 0, k: 100 }, p: { a: 0, k: [100, 100] },
        s: { a: 1, k: [{ t: 0, s: [0, 0] }, { t: 15, s: [105, 105] }, { t: 20, s: [100, 100] }] },
        r: { a: 0, k: 0 }, a: { a: 0, k: [0, 0] }
      },
      shapes: [{
        ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [80, 80] }
      }, {
        ty: "fl", c: { a: 0, k: [0.2, 0.78, 0.35, 1] }, o: { a: 0, k: 100 }
      }],
      ip: 0, op: 45, st: 0
    }, {
      ty: 4, nm: "check", sr: 1, ks: {
        o: { a: 0, k: 100 }, p: { a: 0, k: [100, 100] },
        s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, a: { a: 0, k: [0, 0] }
      },
      shapes: [{
        ty: "sh", ks: { a: 0, k: {
          c: false, v: [[-18, 2], [-6, 14], [20, -14]],
          i: [[0, 0], [0, 0], [0, 0]], o: [[0, 0], [0, 0], [0, 0]]
        }}
      }, {
        ty: "tm",
        s: { a: 0, k: 0 },
        e: { a: 1, k: [{ t: 15, s: [0] }, { t: 30, s: [100] }] },
        o: { a: 0, k: 0 }
      }, {
        ty: "st", c: { a: 0, k: [1, 1, 1, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 5 },
        lc: 2, lj: 2
      }],
      ip: 0, op: 45, st: 0
    }]
  };
}

function createWaveform() {
  const bars = 5;
  const barWidth = 12;
  const gap = 8;
  const totalW = bars * barWidth + (bars - 1) * gap;
  const startX = (200 - totalW) / 2;

  return {
    v: "5.7.1", fr: 30, ip: 0, op: 60, w: 200, h: 200,
    layers: Array.from({ length: bars }, (_, i) => {
      const delay = i * 5;
      const maxH = 40 + Math.sin(i * 1.2) * 25;
      return {
        ty: 4, nm: `bar${i}`, sr: 1, ks: {
          o: { a: 0, k: 100 },
          p: { a: 0, k: [startX + i * (barWidth + gap) + barWidth / 2, 100] },
          s: { a: 1, k: [
            { t: delay, s: [100, 30] },
            { t: delay + 15, s: [100, maxH * 2.5] },
            { t: delay + 30, s: [100, 30] },
            { t: Math.min(delay + 45, 59), s: [100, maxH * 2] },
            { t: 60, s: [100, 30] }
          ]},
          r: { a: 0, k: 0 }, a: { a: 0, k: [0, 0] }
        },
        shapes: [{
          ty: "rc", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [barWidth, 60] }, r: { a: 0, k: 4 }
        }, {
          ty: "fl",
          c: { a: 0, k: [0.29 + i * 0.05, 0.56 - i * 0.03, 0.89, 1] },
          o: { a: 0, k: 100 }
        }],
        ip: 0, op: 60, st: 0
      };
    })
  };
}

const presetFactories: Record<string, () => any> = {
  bouncing: createBouncingBall,
  pulse: createPulse,
  spinner: createSpinner,
  checkmark: createCheckmark,
  waveform: createWaveform,
};

export function getLottieData(preset: string): any {
  const factory = presetFactories[preset] || presetFactories.bouncing;
  return factory();
}
