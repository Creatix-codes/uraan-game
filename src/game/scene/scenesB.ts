import type { Point, SceneContext } from './shared';
import {
  TAU,
  drawBirds,
  drawButterfly,
  drawClouds,
  drawFlower,
  drawGround,
  drawHaze,
  drawPineRow,
  drawRidge,
  drawSky,
  drawSun,
  drawWoodBridge,
  drawDatePalm,
  fillCircle,
  fillPolygon,
  hash,
  mod,
  sceneGradient,
  tiledLandmark,
} from './shared';
import { drawFairyCabin, drawHunzaFort, drawShangrilaHut, drawSwatChalet } from './landmarksB';

/* ------------------------------------------------------------------ */
/* Swat                                                                */
/* ------------------------------------------------------------------ */

export function drawSwatScene(c: SceneContext): void {
  const { ctx, palette: p, w, s, playableH } = c;
  drawSky(c, '#8ddbea', '#e0f3cb');
  drawSun(c, w * 0.22, playableH * 0.15, 37 * s, 0.9);
  drawClouds(c, [
    [0.13, 0.14, 46, 0.66, 3],
    [0.62, 0.11, 53, 0.5, 2.6],
    [0.85, 0.25, 26, 0.36, 4.7],
    [0.38, 0.26, 23, 0.26, 5.4],
  ]);
  drawHaze(c, playableH * 0.44, 105 * s, 0.32);

  // Snowy Hindu Kush wall.
  drawRidge(
    c,
    [
      [0, 0.22], [0.07, 0.68], [0.13, 0.42], [0.19, 0.92], [0.25, 0.5],
      [0.33, 0.8], [0.39, 0.38], [0.46, 0.84], [0.53, 0.45], [0.61, 0.95],
      [0.68, 0.52], [0.76, 0.79], [0.83, 0.34], [0.9, 0.72], [1, 0.32],
    ],
    w * 1.12,
    playableH * 0.56,
    125 * s,
    c.scroll * 0.055,
    '#aec9c1',
  );
  // Pale snow facets on the tallest peaks.
  ctx.save();
  ctx.globalAlpha = 0.65;
  const peakShift = -mod(c.scroll * 0.055, w * 1.12);
  for (let copy = -1; copy < 3; copy += 1) {
    const offset = peakShift + copy * w * 1.12;
    for (let i = 0; i < 5; i += 1) {
      const x = offset + ((i * 0.21 + 0.16) * w * 1.12);
      const peakY = playableH * 0.56 - (90 + (i % 3) * 18) * s;
      fillPolygon(c, [
        [x, peakY],
        [x + 24 * s, peakY + 38 * s],
        [x + 8 * s, peakY + 33 * s],
        [x, peakY + 47 * s],
        [x - 13 * s, peakY + 31 * s],
      ], '#edf5ed');
    }
  }
  ctx.restore();
  drawHaze(c, playableH * 0.56, 70 * s, 0.25);

  drawRidge(
    c,
    [
      [0, 0.18], [0.09, 0.42], [0.18, 0.25], [0.3, 0.47], [0.4, 0.22],
      [0.53, 0.42], [0.66, 0.2], [0.76, 0.44], [0.87, 0.24], [1, 0.38],
    ],
    w * 1.05,
    playableH * 0.68,
    78 * s,
    c.scroll * 0.13,
    p.far,
  );
  drawRidge(
    c,
    [
      [0, 0.15], [0.1, 0.34], [0.2, 0.18], [0.32, 0.38], [0.45, 0.16],
      [0.56, 0.35], [0.68, 0.2], [0.81, 0.36], [0.92, 0.18], [1, 0.3],
    ],
    w * 1.2,
    playableH * 0.735,
    54 * s,
    c.scroll * 0.23,
    p.midLight,
  );
  drawPineRow(c, 0.34, 31 * s, playableH * 0.75, 26, 45, 0.55, 23);

  const riverTop = playableH * 0.745;
  // Hillside chalet tucked into the valley.
  tiledLandmark(c, 0.14, w * 1.9, 0.62, (cx) => {
    drawSwatChalet(c, cx, riverTop + 5 * s, s * 0.7);
  });

  // The Swat River: a broad turquoise ribbon with a wooden bridge.
  const riverGradient = sceneGradient(
    c,
    `swat-river|${playableH.toFixed(1)}|${Math.round(riverTop)}`,
    () => {
      const g = ctx.createLinearGradient(0, riverTop, 0, playableH);
      g.addColorStop(0, '#7ccdc5');
      g.addColorStop(0.42, '#4aa9a6');
      g.addColorStop(1, '#2f8587');
      return g;
    },
  );
  ctx.fillStyle = riverGradient;
  ctx.beginPath();
  ctx.moveTo(-20, riverTop + 8 * s);
  for (let x = -20; x <= w + 20; x += 20 * s) {
    ctx.lineTo(x, riverTop + 7 * s + Math.sin(x * 0.028 + c.scroll * 0.004) * 3 * s);
  }
  ctx.lineTo(w + 20, playableH + 4 * s);
  ctx.lineTo(-20, playableH + 4 * s);
  ctx.closePath();
  ctx.fill();

  // Foaming current.
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.48)';
  ctx.lineWidth = 1.5 * s;
  for (let i = 0; i < 6; i += 1) {
    const y = riverTop + (12 + i * 7) * s;
    const offset = mod(c.scroll * (0.45 + i * 0.05) + (c.reducedMotion ? 0 : c.time * 8 * s), 70 * s);
    ctx.globalAlpha = 0.25 + (i % 3) * 0.08;
    for (let x = -70 * s - offset; x < w + 70 * s; x += 70 * s) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 17 * s, y - 3 * s, x + 36 * s, y);
      ctx.stroke();
    }
  }
  ctx.restore();

  drawWoodBridge(c, w * 0.38, riverTop + 22 * s, 120 * s, riverTop + 24 * s, 0.95);

  // Rocks and a tiny raft in the river.
  fillCircle(c, w * 0.72, riverTop + 25 * s, 8 * s, p.obstacleDark, 'rgba(20,50,45,0.3)', 1);
  fillCircle(c, w * 0.26, riverTop + 31 * s, 5 * s, p.obstacle, 'rgba(20,50,45,0.25)', 1);

  drawPineRow(c, 0.82, 63 * s, playableH + 5 * s, 55, 100, 0.9, 8);
  drawBirds(c, [
    [0.3, 0.21, 3.4, 0.34],
    [0.35, 0.24, 2.4, 0.25],
  ]);

  drawButterfly(c, mod(w * 0.22 + c.time * 14 * s, w), playableH * 0.48, 4.5 * s, 0.8);
  drawButterfly(c, mod(w * 0.7 + c.time * 9 * s, w), playableH * 0.58, 3.6 * s, 0.7);

  drawGround(c, 'riverbank');
}

/* ------------------------------------------------------------------ */
/* Hunza                                                               */
/* ------------------------------------------------------------------ */

function drawPassuCones(c: SceneContext, cx: number, baseY: number, u: number): void {
  const { ctx, palette: p } = c;
  ctx.save();
  ctx.translate(cx, baseY);
  ctx.scale(u, u);
  const spires: Array<{ x: number; w: number; h: number; tone: string }> = [
    { x: -100, w: 58, h: 148, tone: p.far },
    { x: -38, w: 72, h: 220, tone: p.farLight },
    { x: 30, w: 68, h: 190, tone: p.far },
    { x: 94, w: 48, h: 132, tone: p.farLight },
  ];
  for (const spire of spires) {
    fillPolygon(c, [
      [spire.x - spire.w / 2, 0],
      [spire.x - spire.w * 0.17, -spire.h * 0.45],
      [spire.x, -spire.h],
      [spire.x + spire.w * 0.2, -spire.h * 0.42],
      [spire.x + spire.w / 2, 0],
    ], spire.tone, p.ink, 1.5);
    // Sunlit ridge.
    fillPolygon(c, [
      [spire.x, -spire.h],
      [spire.x + spire.w * 0.2, -spire.h * 0.42],
      [spire.x + 4, -spire.h * 0.28],
      [spire.x + spire.w * 0.1, -spire.h * 0.56],
    ], 'rgba(255,245,225,0.2)');
    // Snow caught in the flutes.
    ctx.strokeStyle = 'rgba(243,248,248,0.75)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(spire.x - spire.w * 0.1, -spire.h * 0.87);
    ctx.quadraticCurveTo(
      spire.x - spire.w * 0.3,
      -spire.h * 0.57,
      spire.x - spire.w * 0.36,
      -spire.h * 0.25,
    );
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.36)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(spire.x + spire.w * 0.12, -spire.h * 0.68);
    ctx.quadraticCurveTo(
      spire.x + spire.w * 0.27,
      -spire.h * 0.45,
      spire.x + spire.w * 0.3,
      -spire.h * 0.16,
    );
    ctx.stroke();
  }
  ctx.restore();
}

export function drawHunzaScene(c: SceneContext): void {
  const { palette: p, w, s, playableH, ctx } = c;
  drawSky(c, '#67b0d8', '#ffd8ab');
  drawSun(c, w * 0.76, playableH * 0.18, 42 * s, 0.95);
  drawClouds(c, [
    [0.16, 0.13, 43, 0.5, 2.8],
    [0.48, 0.08, 31, 0.34, 3.5],
    [0.86, 0.3, 38, 0.4, 2.2],
    [0.64, 0.36, 25, 0.25, 4.6],
  ]);
  drawHaze(c, playableH * 0.55, 150 * s, 0.3);

  // Passu Cones marching across the horizon.
  tiledLandmark(c, 0.06, w * 1.65, 0.24, (cx) => {
    drawPassuCones(c, cx, playableH * 0.69, s * 0.95);
  });

  drawHaze(c, playableH * 0.67, 45 * s, 0.22);
  drawRidge(
    c,
    [
      [0, 0.15], [0.08, 0.42], [0.16, 0.3], [0.25, 0.56], [0.36, 0.27],
      [0.47, 0.5], [0.58, 0.24], [0.7, 0.45], [0.83, 0.22], [0.94, 0.4], [1, 0.28],
    ],
    w * 1.15,
    playableH * 0.78,
    59 * s,
    c.scroll * 0.21,
    p.near,
  );

  // Baltit fort on a rocky shoulder.
  tiledLandmark(c, 0.16, w * 1.85, 0.35, (cx) => {
    drawHunzaFort(c, cx, playableH * 0.875, s * 0.68);
  });

  // Apricot trees along the terraces.
  const spacing = 82 * s;
  const offset = mod(c.scroll * 0.42, spacing);
  for (let i = -1; i < 7; i += 1) {
    const x = i * spacing + offset;
    const h = (26 + hash(i + 7) * 18) * s;
    ctx.strokeStyle = p.obstacleDark;
    ctx.lineWidth = 2 * s;
    ctx.beginPath();
    ctx.moveTo(x, playableH * 0.93);
    ctx.lineTo(x, playableH * 0.93 - h);
    ctx.stroke();
    fillCircle(c, x, playableH * 0.93 - h, h * 0.43, '#f4cfcc', 'rgba(70,50,45,0.2)', 0.8 * s);
    fillCircle(c, x + 5 * s, playableH * 0.93 - h - 5 * s, h * 0.27, '#fbeee3');
    fillCircle(c, x - h * 0.24, playableH * 0.93 - h + h * 0.15, 2 * s, p.accent);
  }

  drawPineRow(c, 0.85, 76 * s, playableH + 3 * s, 38, 72, 0.75, 14);

  drawBirds(c, [
    [0.23, 0.2, 5.2, 0.45],
    [0.28, 0.24, 3.4, 0.34],
    [0.78, 0.33, 3.2, 0.28],
  ]);

  drawGround(c, 'rock');
}

/* ------------------------------------------------------------------ */
/* Skardu                                                              */
/* ------------------------------------------------------------------ */

function drawSnowMountain(c: SceneContext, cx: number, baseY: number, u: number): void {
  const { palette: p } = c;
  ctxSavePoly(c, [
    [cx - 130 * u, baseY],
    [cx - 75 * u, baseY - 110 * u],
    [cx - 46 * u, baseY - 80 * u],
    [cx - 8 * u, baseY - 168 * u],
    [cx + 30 * u, baseY - 98 * u],
    [cx + 58 * u, baseY - 129 * u],
    [cx + 122 * u, baseY],
  ], '#8d9fae', p.ink, 1.5 * u);
  fillPolygon(c, [
    [cx - 8 * u, baseY - 168 * u],
    [cx - 28 * u, baseY - 122 * u],
    [cx - 12 * u, baseY - 126 * u],
    [cx - 2 * u, baseY - 102 * u],
    [cx + 14 * u, baseY - 128 * u],
    [cx + 30 * u, baseY - 98 * u],
    [cx + 58 * u, baseY - 129 * u],
    [cx + 68 * u, baseY - 108 * u],
    [cx + 122 * u, baseY],
    [cx - 46 * u, baseY],
  ], 'rgba(247,250,247,0.9)');
  fillPolygon(c, [
    [cx - 8 * u, baseY - 168 * u],
    [cx - 2 * u, baseY - 102 * u],
    [cx + 14 * u, baseY - 128 * u],
    [cx + 30 * u, baseY - 98 * u],
    [cx + 58 * u, baseY - 129 * u],
    [cx + 68 * u, baseY - 108 * u],
    [cx + 122 * u, baseY],
    [cx + 2 * u, baseY],
  ], 'rgba(108,133,151,0.18)');
}

function ctxSavePoly(
  c: SceneContext,
  points: readonly Point[],
  fill: string,
  stroke?: string,
  lineWidth = 1,
): void {
  fillPolygon(c, points, fill, stroke, lineWidth);
}

export function drawSkarduScene(c: SceneContext): void {
  const { ctx, palette: p, w, s, playableH } = c;
  drawSky(c, '#89cee4', '#f8dbb6');
  drawSun(c, w * 0.74, playableH * 0.15, 36 * s, 0.9);
  drawClouds(c, [
    [0.12, 0.18, 40, 0.4, 2.6],
    [0.4, 0.1, 50, 0.45, 3.2],
    [0.73, 0.29, 27, 0.28, 4.6],
  ]);
  drawHaze(c, playableH * 0.47, 95 * s, 0.3);

  drawSnowMountain(c, w * 0.22, playableH * 0.58, s * 1.08);
  drawSnowMountain(c, w * 0.8, playableH * 0.58, s * 0.9);
  drawSnowMountain(c, w * 0.52, playableH * 0.58, s * 0.65);

  const lakeTop = playableH * 0.56;
  const lakeGradient = sceneGradient(
    c,
    `skardu-lake|${playableH.toFixed(1)}|${Math.round(lakeTop)}`,
    () => {
      const g = ctx.createLinearGradient(0, lakeTop, 0, playableH);
      g.addColorStop(0, '#74c1c8');
      g.addColorStop(0.5, '#45a3a8');
      g.addColorStop(1, '#2e7e88');
      return g;
    },
  );
  ctx.fillStyle = lakeGradient;
  ctx.fillRect(0, lakeTop, w, playableH - lakeTop + 2);

  // Cool reflections under the peaks.
  ctx.save();
  ctx.globalAlpha = 0.18;
  for (let i = 0; i < 4; i += 1) {
    const x = w * (0.08 + i * 0.25) - mod(c.scroll * 0.05, 30 * s);
    fillPolygon(c, [
      [x - 27 * s, lakeTop + 5 * s],
      [x + 30 * s, lakeTop + 5 * s],
      [x + 16 * s, lakeTop + 58 * s],
      [x - 8 * s, lakeTop + 45 * s],
    ], i % 2 ? '#eaf4f1' : '#d3e3e6');
  }
  ctx.restore();

  // Bright ripple strokes.
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.42)';
  ctx.lineWidth = 1.4 * s;
  for (let i = 0; i < 5; i += 1) {
    const y = lakeTop + (22 + i * 15) * s;
    const step = 56 * s;
    const offset = mod(c.scroll * (0.3 + i * 0.06) + (c.reducedMotion ? 0 : c.time * 7 * s), step);
    ctx.globalAlpha = 0.2 + (i % 2) * 0.14;
    for (let x = -step - offset; x < w + step; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 14 * s, y - 2.5 * s, x + 30 * s, y);
      ctx.stroke();
    }
  }
  ctx.restore();

  // A small wooden jetty island.
  const hutBase = playableH * 0.795;
  for (let copy = -1; copy < 3; copy += 1) {
    const cx = -mod(c.scroll * 0.11, w * 2) + copy * w * 2 + w * 0.5;
    ctx.beginPath();
    ctx.ellipse(cx, hutBase + 9 * s, 86 * s, 13 * s, 0, 0, TAU);
    ctx.fillStyle = p.groundTop;
    ctx.globalAlpha = 0.55;
    ctx.fill();
    ctx.globalAlpha = 1;
    drawShangrilaHut(c, cx, hutBase, s * 0.78);
  }

  // Little fishing boat.
  const boatX = mod(w * 0.25 + c.time * 3 * s, w + 80 * s) - 40 * s;
  fillPolygon(c, [
    [boatX - 16 * s, playableH * 0.9],
    [boatX + 16 * s, playableH * 0.9],
    [boatX + 9 * s, playableH * 0.915],
    [boatX - 10 * s, playableH * 0.915],
  ], '#a56c4d', p.ink, 1);
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 1.1 * s;
  ctx.beginPath();
  ctx.moveTo(boatX, playableH * 0.9);
  ctx.lineTo(boatX, playableH * 0.874);
  ctx.stroke();

  drawBirds(c, [
    [0.3, 0.22, 3.4, 0.35],
    [0.66, 0.2, 2.8, 0.28],
  ]);

  drawGround(c, 'beach');
}

/* ------------------------------------------------------------------ */
/* Fairy Meadows                                                       */
/* ------------------------------------------------------------------ */

function drawNangaParbat(c: SceneContext, cx: number, baseY: number, u: number): void {
  const { ctx, palette: p } = c;
  ctxSavePoly(c, [
    [cx - 230 * u, baseY],
    [cx - 152 * u, baseY - 102 * u],
    [cx - 115 * u, baseY - 88 * u],
    [cx - 68 * u, baseY - 185 * u],
    [cx - 32 * u, baseY - 160 * u],
    [cx, baseY - 255 * u],
    [cx + 26 * u, baseY - 176 * u],
    [cx + 63 * u, baseY - 202 * u],
    [cx + 104 * u, baseY - 106 * u],
    [cx + 142 * u, baseY - 132 * u],
    [cx + 226 * u, baseY],
  ], '#b8c9d6', p.ink, 1.6 * u);

  // Snow and shade facets.
  fillPolygon(c, [
    [cx, baseY - 255 * u],
    [cx - 32 * u, baseY - 160 * u],
    [cx - 68 * u, baseY - 185 * u],
    [cx - 115 * u, baseY - 88 * u],
    [cx - 190 * u, baseY],
    [cx - 5 * u, baseY],
  ], '#eef4f4');
  fillPolygon(c, [
    [cx, baseY - 255 * u],
    [cx + 26 * u, baseY - 176 * u],
    [cx + 63 * u, baseY - 202 * u],
    [cx + 104 * u, baseY - 106 * u],
    [cx + 226 * u, baseY],
    [cx + 5 * u, baseY],
  ], '#d5e2e8');
  fillPolygon(c, [
    [cx, baseY - 255 * u],
    [cx + 26 * u, baseY - 176 * u],
    [cx + 63 * u, baseY - 202 * u],
    [cx + 104 * u, baseY - 106 * u],
    [cx + 12 * u, baseY - 47 * u],
    [cx + 5 * u, baseY],
    [cx - 10 * u, baseY - 40 * u],
    [cx - 32 * u, baseY - 160 * u],
  ], 'rgba(118,144,162,0.28)');
  // Glacier blue shadows.
  ctx.strokeStyle = 'rgba(122,155,176,0.5)';
  ctx.lineWidth = 1.4 * u;
  ctx.beginPath();
  ctx.moveTo(cx - 6 * u, baseY - 230 * u);
  ctx.lineTo(cx - 25 * u, baseY - 150 * u);
  ctx.lineTo(cx - 40 * u, baseY - 90 * u);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 8 * u, baseY - 210 * u);
  ctx.lineTo(cx + 40 * u, baseY - 140 * u);
  ctx.lineTo(cx + 72 * u, baseY - 60 * u);
  ctx.stroke();
}

export function drawFairyMeadowsScene(c: SceneContext): void {
  const { palette: p, w, s, playableH } = c;
  drawSky(c, '#82c7e6', '#fde4ba');
  drawSun(c, w * 0.79, playableH * 0.15, 39 * s, 0.9);
  drawClouds(c, [
    [0.12, 0.15, 46, 0.58, 2.7],
    [0.4, 0.08, 56, 0.46, 2.1],
    [0.7, 0.27, 30, 0.4, 4.2],
    [0.9, 0.34, 23, 0.28, 3.4],
  ]);
  drawHaze(c, playableH * 0.34, 95 * s, 0.2);

  tiledLandmark(c, 0.045, w * 2.15, 0.5, (cx) => {
    drawNangaParbat(c, cx, playableH * 0.64, s * 0.92);
  });

  drawHaze(c, playableH * 0.62, 55 * s, 0.25);
  drawRidge(
    c,
    [
      [0, 0.12], [0.09, 0.31], [0.19, 0.18], [0.3, 0.36], [0.41, 0.14],
      [0.54, 0.3], [0.65, 0.17], [0.77, 0.36], [0.88, 0.16], [1, 0.29],
    ],
    w * 1.22,
    playableH * 0.72,
    49 * s,
    c.scroll * 0.18,
    p.midLight,
  );
  drawPineRow(c, 0.27, 34 * s, playableH * 0.74, 25, 45, 0.5, 17);
  drawRidge(
    c,
    [
      [0, 0.1], [0.13, 0.25], [0.25, 0.13], [0.38, 0.28], [0.5, 0.12],
      [0.64, 0.25], [0.78, 0.14], [0.9, 0.27], [1, 0.12],
    ],
    w * 1.1,
    playableH * 0.83,
    39 * s,
    c.scroll * 0.35,
    p.mid,
  );

  tiledLandmark(c, 0.2, w * 1.8, 0.28, (cx) => {
    drawFairyCabin(c, cx, playableH * 0.865, s * 0.62);
  });

  // Wildflower meadow edge.
  const spacing = 58 * s;
  const offset = mod(c.scroll * 0.86, spacing);
  for (let i = -1; i < 8; i += 1) {
    const x = i * spacing + offset;
    const bloom = i % 3 === 0 ? '#f2a7a4' : i % 3 === 1 ? p.accent : '#f7f1d8';
    drawFlower(c, x, playableH - 7 * s, (3.2 + hash(i + 2) * 1.8) * s, bloom, p.accent, 0.9);
  }

  drawPineRow(c, 0.9, 85 * s, playableH + 4 * s, 40, 85, 0.9, 21);
  drawBirds(c, [
    [0.2, 0.24, 5.5, 0.38],
    [0.25, 0.28, 3.2, 0.28],
    [0.7, 0.18, 4, 0.26],
  ]);
  drawButterfly(c, mod(w * 0.3 + c.time * 13 * s, w), playableH * 0.55, 4 * s, 0.8);
  drawButterfly(c, mod(w * 0.62 + c.time * 10 * s, w), playableH * 0.49, 3.3 * s, 0.7);

  drawGround(c, 'meadow');
}

/* ------------------------------------------------------------------ */
/* Peshawar                                                            */
/* ------------------------------------------------------------------ */

export function drawPeshawarScene(c: SceneContext): void {
  const { palette: p, w, s, playableH } = c;
  drawSky(c, '#eec27e', '#dd8f5c');
  drawSun(c, w * 0.3, playableH * 0.16, 40 * s, 0.95);
  drawClouds(c, [
    [0.15, 0.12, 44, 0.6, 3],
    [0.5, 0.08, 34, 0.45, 2.8],
    [0.8, 0.2, 28, 0.35, 4.5],
  ]);
  drawHaze(c, playableH * 0.5, 110 * s, 0.35);
  drawRidge(
    c,
    [
      [0, 0.25], [0.1, 0.5], [0.2, 0.3], [0.35, 0.55], [0.5, 0.25],
      [0.65, 0.5], [0.8, 0.3], [0.9, 0.55], [1, 0.3],
    ],
    w * 1.1,
    playableH * 0.62,
    70 * s,
    c.scroll * 0.08,
    p.far,
  );
  drawGround(c, 'clay');
  drawBirds(c, [
    [0.25, 0.2, 4, 0.5],
    [0.6, 0.16, 3, 0.4],
  ]);
  drawDatePalm(c, w * 0.85 - mod(c.scroll * 0.3, 90 * s), playableH * 0.83, 100 * s, 0.5);
}
