// Properly structured Lottie JSON animations

function createBouncingBall(): object {
  return {
    v: "5.7.1",
    fr: 30,
    ip: 0,
    op: 60,
    w: 200,
    h: 200,
    nm: "Bouncing Ball",
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Ball",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: {
            a: 1,
            k: [
              { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 0, s: [100, 150, 0], to: [0, -15, 0], ti: [0, 0, 0] },
              { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 15, s: [100, 60, 0], to: [0, 0, 0], ti: [0, -15, 0] },
              { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 30, s: [100, 150, 0], to: [0, 0, 0], ti: [0, 0, 0] },
              { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 45, s: [100, 60, 0], to: [0, 0, 0], ti: [0, -15, 0] },
              { t: 60, s: [100, 150, 0] }
            ]
          },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 28, s: [100, 100, 100] },
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 30, s: [130, 70, 100] },
              { t: 35, s: [100, 100, 100] }
            ]
          }
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              { ty: "el", d: 1, s: { a: 0, k: [50, 50] }, p: { a: 0, k: [0, 0] }, nm: "Ellipse" },
              { ty: "fl", c: { a: 0, k: [0.29, 0.56, 0.89, 1] }, o: { a: 0, k: 100 }, r: 1, nm: "Fill" },
              { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
            ],
            nm: "Group"
          }
        ],
        ip: 0,
        op: 60,
        st: 0,
        bm: 0
      },
      {
        ddd: 0,
        ind: 2,
        ty: 4,
        nm: "Shadow",
        sr: 1,
        ks: {
          o: {
            a: 1,
            k: [
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [40] },
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 15, s: [15] },
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 30, s: [40] },
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 45, s: [15] },
              { t: 60, s: [40] }
            ]
          },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [100, 175, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [100, 100, 100] },
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 15, s: [60, 100, 100] },
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 30, s: [100, 100, 100] },
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 45, s: [60, 100, 100] },
              { t: 60, s: [100, 100, 100] }
            ]
          }
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              { ty: "el", d: 1, s: { a: 0, k: [60, 10] }, p: { a: 0, k: [0, 0] }, nm: "Shadow Ellipse" },
              { ty: "fl", c: { a: 0, k: [0, 0, 0, 1] }, o: { a: 0, k: 25 }, r: 1, nm: "Fill" },
              { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
            ],
            nm: "Group"
          }
        ],
        ip: 0,
        op: 60,
        st: 0,
        bm: 0
      }
    ]
  };
}

function createPulse(): object {
  const rings = [0, 1, 2].map((i) => ({
    ddd: 0,
    ind: i + 1,
    ty: 4,
    nm: `Ring ${i}`,
    sr: 1,
    ks: {
      o: {
        a: 1,
        k: [
          { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: i * 8, s: [80] },
          { t: 30 + i * 8, s: [0] }
        ]
      },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [100, 100, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: {
        a: 1,
        k: [
          { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: i * 8, s: [30, 30, 100] },
          { t: 30 + i * 8, s: [160, 160, 100] }
        ]
      }
    },
    ao: 0,
    shapes: [
      {
        ty: "gr",
        it: [
          { ty: "el", d: 1, s: { a: 0, k: [80, 80] }, p: { a: 0, k: [0, 0] }, nm: "Ring" },
          { ty: "st", c: { a: 0, k: [0.29, 0.56, 0.89, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 3 }, lc: 1, lj: 1, nm: "Stroke" },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
        ],
        nm: "Group"
      }
    ],
    ip: 0,
    op: 60,
    st: 0,
    bm: 0
  }));

  const center = {
    ddd: 0,
    ind: 4,
    ty: 4,
    nm: "Center",
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [100, 100, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: {
        a: 1,
        k: [
          { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [100, 100, 100] },
          { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 15, s: [120, 120, 100] },
          { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 30, s: [100, 100, 100] },
          { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 45, s: [120, 120, 100] },
          { t: 60, s: [100, 100, 100] }
        ]
      }
    },
    ao: 0,
    shapes: [
      {
        ty: "gr",
        it: [
          { ty: "el", d: 1, s: { a: 0, k: [30, 30] }, p: { a: 0, k: [0, 0] }, nm: "Center Dot" },
          { ty: "fl", c: { a: 0, k: [0.29, 0.56, 0.89, 1] }, o: { a: 0, k: 100 }, r: 1, nm: "Fill" },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
        ],
        nm: "Group"
      }
    ],
    ip: 0,
    op: 60,
    st: 0,
    bm: 0
  };

  return {
    v: "5.7.1", fr: 30, ip: 0, op: 60, w: 200, h: 200, nm: "Pulse",
    layers: [...rings, center]
  };
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
          p: { a: 0, k: [100, 100, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] }
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              { ty: "el", d: 1, s: { a: 0, k: [70, 70] }, p: { a: 0, k: [0, 0] }, nm: "Arc" },
              {
                ty: "tm",
                s: { a: 0, k: 0 },
                e: { a: 0, k: 30 },
                o: { a: 0, k: 0 },
                nm: "Trim"
              },
              { ty: "st", c: { a: 0, k: [0.29, 0.56, 0.89, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 6 }, lc: 2, lj: 1, nm: "Stroke" },
              { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
            ],
            nm: "Group"
          }
        ],
        ip: 0, op: 60, st: 0, bm: 0
      },
      {
        ddd: 0, ind: 2, ty: 4, nm: "Track", sr: 1,
        ks: {
          o: { a: 0, k: 20 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [100, 100, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] }
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              { ty: "el", d: 1, s: { a: 0, k: [70, 70] }, p: { a: 0, k: [0, 0] }, nm: "Track" },
              { ty: "st", c: { a: 0, k: [0.29, 0.56, 0.89, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 6 }, lc: 2, lj: 1, nm: "Stroke" },
              { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
            ],
            nm: "Group"
          }
        ],
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
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [100, 100, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [0, 0, 100] },
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 12, s: [110, 110, 100] },
              { t: 18, s: [100, 100, 100] }
            ]
          }
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              { ty: "el", d: 1, s: { a: 0, k: [80, 80] }, p: { a: 0, k: [0, 0] }, nm: "Circle" },
              { ty: "fl", c: { a: 0, k: [0.2, 0.78, 0.35, 1] }, o: { a: 0, k: 100 }, r: 1, nm: "Fill" },
              { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
            ],
            nm: "Group"
          }
        ],
        ip: 0, op: 45, st: 0, bm: 0
      },
      {
        ddd: 0, ind: 2, ty: 4, nm: "Check", sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [100, 100, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] }
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              {
                ty: "sh",
                d: 1,
                ks: {
                  a: 0,
                  k: {
                    i: [[0, 0], [0, 0], [0, 0]],
                    o: [[0, 0], [0, 0], [0, 0]],
                    v: [[-18, 2], [-6, 14], [20, -14]],
                    c: false
                  }
                },
                nm: "Check Path"
              },
              {
                ty: "tm",
                s: { a: 0, k: 0 },
                e: { a: 1, k: [{ i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 14, s: [0] }, { t: 30, s: [100] }] },
                o: { a: 0, k: 0 },
                nm: "Trim"
              },
              { ty: "st", c: { a: 0, k: [1, 1, 1, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 5 }, lc: 2, lj: 2, nm: "Stroke" },
              { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
            ],
            nm: "Group"
          }
        ],
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
        ddd: 0,
        ind: i + 1,
        ty: 4,
        nm: `Bar ${i}`,
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [startX + i * (barWidth + gap), 100, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: delay, s: [100, 40, 100] },
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: delay + 12, s: [100, maxScale, 100] },
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: delay + 24, s: [100, 40, 100] },
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: Math.min(delay + 36, 55), s: [100, maxScale * 0.7, 100] },
              { t: 60, s: [100, 40, 100] }
            ]
          }
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              { ty: "rc", d: 1, s: { a: 0, k: [barWidth, 50] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 4 }, nm: "Bar" },
              { ty: "fl", c: { a: 0, k: [0.29 + i * 0.06, 0.56 - i * 0.04, 0.89, 1] }, o: { a: 0, k: 100 }, r: 1, nm: "Fill" },
              { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
            ],
            nm: "Group"
          }
        ],
        ip: 0, op: 60, st: 0, bm: 0
      };
    })
  };
}

function makeStickLimb(name: string, anchorY: number, posX: number, posY: number, rotKeys: any[], color: number[]): any {
  return {
    ddd: 0, ind: 0, ty: 4, nm: name, sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 1, k: rotKeys },
      p: { a: 0, k: [posX, posY, 0] },
      a: { a: 0, k: [0, anchorY, 0] },
      s: { a: 0, k: [100, 100, 100] }
    },
    ao: 0,
    shapes: [{
      ty: "gr",
      it: [
        {
          ty: "sh", d: 1,
          ks: { a: 0, k: { i: [[0,0],[0,0]], o: [[0,0],[0,0]], v: [[0, -anchorY], [0, anchorY]], c: false } },
          nm: "Line"
        },
        { ty: "st", c: { a: 0, k: color }, o: { a: 0, k: 100 }, w: { a: 0, k: 5 }, lc: 2, lj: 2, nm: "Stroke" },
        { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
      ],
      nm: "Group"
    }],
    ip: 0, op: 60, st: 0, bm: 0
  };
}

function easeKf(t: number, s: number[]): any {
  return { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t, s };
}

function createWalking(): object {
  const col = [0.2, 0.2, 0.25, 1];
  const skinCol = [0.85, 0.7, 0.55, 1];

  // Head
  const head = {
    ddd: 0, ind: 1, ty: 4, nm: "Head", sr: 1,
    ks: {
      o: { a: 0, k: 100 }, r: { a: 0, k: 0 },
      p: { a: 0, k: [100, 45, 0] }, a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] }
    },
    ao: 0,
    shapes: [{
      ty: "gr",
      it: [
        { ty: "el", d: 1, s: { a: 0, k: [28, 28] }, p: { a: 0, k: [0, 0] }, nm: "Head" },
        { ty: "fl", c: { a: 0, k: skinCol }, o: { a: 0, k: 100 }, r: 1, nm: "Fill" },
        { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
      ], nm: "Group"
    }],
    ip: 0, op: 60, st: 0, bm: 0
  };

  // Body (torso line)
  const body = {
    ddd: 0, ind: 2, ty: 4, nm: "Body", sr: 1,
    ks: {
      o: { a: 0, k: 100 }, r: { a: 0, k: 0 },
      p: { a: 0, k: [100, 60, 0] }, a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] }
    },
    ao: 0,
    shapes: [{
      ty: "gr",
      it: [
        { ty: "sh", d: 1, ks: { a: 0, k: { i: [[0,0],[0,0]], o: [[0,0],[0,0]], v: [[0, 0], [0, 50]], c: false } }, nm: "Torso" },
        { ty: "st", c: { a: 0, k: col }, o: { a: 0, k: 100 }, w: { a: 0, k: 5 }, lc: 2, lj: 2, nm: "Stroke" },
        { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
      ], nm: "Group"
    }],
    ip: 0, op: 60, st: 0, bm: 0
  };

  // Walk cycle: legs and arms swing opposite
  const legSwing = 30;
  const armSwing = 25;

  const leftLeg = makeStickLimb("Left Leg", -20, 100, 110, [
    easeKf(0, [-legSwing]), easeKf(15, [legSwing]), easeKf(30, [-legSwing]), easeKf(45, [legSwing]), { t: 60, s: [-legSwing] }
  ], col);
  leftLeg.ind = 3;

  const rightLeg = makeStickLimb("Right Leg", -20, 100, 110, [
    easeKf(0, [legSwing]), easeKf(15, [-legSwing]), easeKf(30, [legSwing]), easeKf(45, [-legSwing]), { t: 60, s: [legSwing] }
  ], col);
  rightLeg.ind = 4;

  const leftArm = makeStickLimb("Left Arm", -18, 100, 68, [
    easeKf(0, [armSwing]), easeKf(15, [-armSwing]), easeKf(30, [armSwing]), easeKf(45, [-armSwing]), { t: 60, s: [armSwing] }
  ], col);
  leftArm.ind = 5;

  const rightArm = makeStickLimb("Right Arm", -18, 100, 68, [
    easeKf(0, [-armSwing]), easeKf(15, [armSwing]), easeKf(30, [-armSwing]), easeKf(45, [armSwing]), { t: 60, s: [-armSwing] }
  ], col);
  rightArm.ind = 6;

  return {
    v: "5.7.1", fr: 30, ip: 0, op: 60, w: 200, h: 200, nm: "Walking",
    layers: [head, body, leftLeg, rightLeg, leftArm, rightArm]
  };
}

function createRunning(): object {
  const col = [0.15, 0.15, 0.2, 1];
  const skinCol = [0.85, 0.7, 0.55, 1];

  const head = {
    ddd: 0, ind: 1, ty: 4, nm: "Head", sr: 1,
    ks: {
      o: { a: 0, k: 100 }, r: { a: 0, k: 0 },
      p: {
        a: 1,
        k: [
          easeKf(0, [105, 40, 0]), easeKf(8, [105, 35, 0]), easeKf(15, [105, 40, 0]),
          easeKf(23, [105, 35, 0]), easeKf(30, [105, 40, 0]), easeKf(38, [105, 35, 0]),
          easeKf(45, [105, 40, 0]), easeKf(53, [105, 35, 0]), { t: 60, s: [105, 40, 0] }
        ]
      },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] }
    },
    ao: 0,
    shapes: [{
      ty: "gr",
      it: [
        { ty: "el", d: 1, s: { a: 0, k: [26, 26] }, p: { a: 0, k: [0, 0] }, nm: "Head" },
        { ty: "fl", c: { a: 0, k: skinCol }, o: { a: 0, k: 100 }, r: 1, nm: "Fill" },
        { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
      ], nm: "Group"
    }],
    ip: 0, op: 60, st: 0, bm: 0
  };

  // Torso tilted forward
  const body = {
    ddd: 0, ind: 2, ty: 4, nm: "Body", sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 10 }, // lean forward
      p: { a: 0, k: [105, 55, 0] }, a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] }
    },
    ao: 0,
    shapes: [{
      ty: "gr",
      it: [
        { ty: "sh", d: 1, ks: { a: 0, k: { i: [[0,0],[0,0]], o: [[0,0],[0,0]], v: [[0, 0], [0, 48]], c: false } }, nm: "Torso" },
        { ty: "st", c: { a: 0, k: col }, o: { a: 0, k: 100 }, w: { a: 0, k: 5 }, lc: 2, lj: 2, nm: "Stroke" },
        { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
      ], nm: "Group"
    }],
    ip: 0, op: 60, st: 0, bm: 0
  };

  const legSwing = 45;
  const armSwing = 40;

  const leftLeg = makeStickLimb("Left Leg", -22, 108, 103, [
    easeKf(0, [-legSwing]), easeKf(8, [legSwing]), easeKf(15, [-legSwing]),
    easeKf(23, [legSwing]), easeKf(30, [-legSwing]), easeKf(38, [legSwing]),
    easeKf(45, [-legSwing]), easeKf(53, [legSwing]), { t: 60, s: [-legSwing] }
  ], col);
  leftLeg.ind = 3;

  const rightLeg = makeStickLimb("Right Leg", -22, 108, 103, [
    easeKf(0, [legSwing]), easeKf(8, [-legSwing]), easeKf(15, [legSwing]),
    easeKf(23, [-legSwing]), easeKf(30, [legSwing]), easeKf(38, [-legSwing]),
    easeKf(45, [legSwing]), easeKf(53, [-legSwing]), { t: 60, s: [legSwing] }
  ], col);
  rightLeg.ind = 4;

  const leftArm = makeStickLimb("Left Arm", -16, 105, 62, [
    easeKf(0, [armSwing]), easeKf(8, [-armSwing]), easeKf(15, [armSwing]),
    easeKf(23, [-armSwing]), easeKf(30, [armSwing]), easeKf(38, [-armSwing]),
    easeKf(45, [armSwing]), easeKf(53, [-armSwing]), { t: 60, s: [armSwing] }
  ], col);
  leftArm.ind = 5;

  const rightArm = makeStickLimb("Right Arm", -16, 105, 62, [
    easeKf(0, [-armSwing]), easeKf(8, [armSwing]), easeKf(15, [-armSwing]),
    easeKf(23, [armSwing]), easeKf(30, [-armSwing]), easeKf(38, [armSwing]),
    easeKf(45, [-armSwing]), easeKf(53, [armSwing]), { t: 60, s: [-armSwing] }
  ], col);
  rightArm.ind = 6;

  return {
    v: "5.7.1", fr: 30, ip: 0, op: 60, w: 200, h: 200, nm: "Running",
    layers: [head, body, leftLeg, rightLeg, leftArm, rightArm]
  };
}

const presetFactories: Record<string, () => object> = {
  bouncing: createBouncingBall,
  pulse: createPulse,
  spinner: createSpinner,
  checkmark: createCheckmark,
  waveform: createWaveform,
  walking: createWalking,
  running: createRunning,
};

export function getLottieData(preset: string): object {
  const factory = presetFactories[preset] || presetFactories.bouncing;
  return factory();
}
