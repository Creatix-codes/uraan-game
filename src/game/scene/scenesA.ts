import type { SceneContext } from './shared';
import {
  TAU,
  drawBirds,
  drawClouds,
  drawDatePalm,
  drawFlower,
  drawGround,
  drawHaze,
  drawPineRow,
  drawRidge,
  drawSky,
  drawSun,
  fillCircle,
  fillPolygon,
  hash,
  mod,
  sceneGradient,
  tiledLandmark,
} from './shared';
import {
  drawBadshahi,
  drawFaisalMosque,
  drawMazar,
  drawMohenjoRuins,
} from './landmarksA';

/* ------------------------------------------------------------------ */
/* Lahore                                                              */
/* ------------------------------------------------------------------ */

function drawLahoreFortWall(c: SceneContext): void {
  const { ctx, palette: p } = c;
  const baseY = c.playableH + 6 * c.s;
  const wallHeight = 48 * c.s;
  const topY = baseY - wallHeight;
  const tile = c.w * 1.5;
  const shift = -mod(c.scroll * 0.32, tile);
  const copies = Math.ceil(c.w / tile) + 2;

  ctx.save();
  ctx.globalAlpha = 0.92;
  for (let i = -1; i < copies; i += 1) {
    const x = shift + i * tile;
    ctx.fillStyle = p.near;
    ctx.fillRect(x, topY, tile + 1, wallHeight);
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 1.4 * c.s;
    ctx.strokeRect(x, topY, tile + 1, wallHeight);

    // Crenellations.
    ctx.fillStyle = p.mid;
    for (let bx = x + 4 * c.s; bx < x + tile - 6 * c.s; bx += 19 * c.s) {
      ctx.fillRect(bx, topY - 8 * c.s, 11 * c.s, 8 * c.s);
      ctx.strokeRect(bx, topY - 8 * c.s, 11 * c.s, 8 * c.s);
    }

    // A small gatehouse with a cupola appears once in each wall tile.
    const gateX = x + tile * 0.62;
    ctx.fillStyle = p.mid;
    ctx.fillRect(gateX - 27 * c.s, topY - 24 * c.s, 54 * c.s, 26 * c.s);
    ctx.strokeStyle = p.ink;
    ctx.strokeRect(gateX - 27 * c.s, topY - 24 * c.s, 54 * c.s, 26 * c.s);
    ctx.beginPath();
    ctx.arc(gateX, topY - 24 * c.s, 21 * c.s, Math.PI, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = p.mid;
    ctx.fill();
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 1.2 * c.s;
    ctx.stroke();
    ctx.fillStyle = p.midLight;
    for (let merlon = -16; merlon <= 16; merlon += 8) {
      ctx.fillRect(gateX + merlon * c.s, topY - 46 * c.s, 5 * c.s, 6 * c.s);
    }
    ctx.fillStyle = p.ink;
    ctx.beginPath();
    ctx.moveTo(gateX - 12 * c.s, baseY);
    ctx.lineTo(gateX - 12 * c.s, topY + 15 * c.s);
    ctx.quadraticCurveTo(gateX, topY - 5 * c.s, gateX + 12 * c.s, topY + 15 * c.s);
    ctx.lineTo(gateX + 12 * c.s, baseY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 1.2 * c.s;
    ctx.stroke();
    drawFlower(c, x + tile * 0.28, topY + 18 * c.s, 3.2 * c.s, p.accentSoft, p.accent, 0.5);
  }
  ctx.restore();
}

function drawCypressRow(c: SceneContext): void {
  const { ctx, palette: p } = c;
  const spacing = 88 * c.s;
  const offset = mod(c.scroll * 0.85, spacing);
  for (let i = -1; i < 7; i += 1) {
    const x = i * spacing + offset;
    const height = (65 + hash(i + 2) * 40) * c.s;
    ctx.save();
    ctx.globalAlpha = 0.88;
    ctx.fillStyle = p.obstacleDark;
    ctx.beginPath();
    ctx.moveTo(x, c.playableH + 8 * c.s);
    ctx.quadraticCurveTo(x - 12 * c.s, c.playableH - height * 0.45, x, c.playableH - height);
    ctx.quadraticCurveTo(x + 12 * c.s, c.playableH - height * 0.45, x, c.playableH + 8 * c.s);
    ctx.fill();
    ctx.fillStyle = p.mid;
    ctx.globalAlpha = 0.42;
    ctx.beginPath();
    ctx.ellipse(x - 2 * c.s, c.playableH - height * 0.45, 4 * c.s, height * 0.32, 0.15, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
}

export function drawLahoreScene(c: SceneContext): void {
  const { palette: p, w, s, playableH, ctx } = c;
  drawSky(c, '#f7b677', '#ef6f6d');
  drawSun(c, w * 0.2, playableH * 0.17, 43 * s);
  drawClouds(c, [
    [0.1, 0.14, 44, 0.52, 3.2],
    [0.24, 0.27, 26, 0.35, 5],
    [0.66, 0.1, 58, 0.58, 2.3],
    [0.87, 0.22, 27, 0.34, 4.4],
    [0.48, 0.31, 20, 0.22, 6],
  ]);

  drawHaze(c, playableH * 0.54, 130 * s, 0.35);
  drawRidge(
    c,
    [
      [0, 0.18], [0.08, 0.42], [0.15, 0.26], [0.22, 0.48], [0.33, 0.2],
      [0.41, 0.33], [0.5, 0.17], [0.61, 0.4], [0.7, 0.23], [0.8, 0.42],
      [0.89, 0.19], [1, 0.18],
    ],
    w * 0.9,
    playableH * 0.69,
    64 * s,
    c.scroll * 0.07,
    p.farLight,
  );
  drawHaze(c, playableH * 0.65, 75 * s, 0.22);

  tiledLandmark(c, 0.15, w * 1.85, 0.23, (cx) => {
    drawBadshahi(c, cx, playableH * 0.842, s * 0.94);
  });

  drawLahoreFortWall(c);
  drawCypressRow(c);

  // Drifting marigold petals — small flecks of truck-art colour.
  if (!c.reducedMotion && !c.lowFx) {
    for (let i = 0; i < 9; i += 1) {
      const x = mod(i * 41 * s + c.time * (5 + (i % 3) * 2) * s, w + 20 * s);
      const y = mod(i * 57 * s + c.time * (8 + i) * s, playableH * 0.75);
      ctx.globalAlpha = 0.5;
      fillCircle(c, x, y, 1.7 * s, i % 2 ? p.accent : p.accentSoft);
    }
    ctx.globalAlpha = 1;
  }

  drawBirds(c, [
    [0.2, 0.24, 4, 0.55],
    [0.24, 0.28, 3.2, 0.45],
    [0.76, 0.19, 3.8, 0.48],
  ]);
  drawGround(c, 'terracotta');
}

/* ------------------------------------------------------------------ */
/* Karachi                                                             */
/* ------------------------------------------------------------------ */

function drawArabianSea(c: SceneContext): void {
  const { ctx, palette: p } = c;
  const horizon = c.playableH * 0.56;
  const seaHeight = c.playableH - horizon;
  const gradient = sceneGradient(
    c,
    `sea|${p.far}|${p.midLight}|${p.mid}|${Math.round(horizon)}`,
    () => {
      const g = ctx.createLinearGradient(0, horizon, 0, c.playableH);
      g.addColorStop(0, p.far);
      g.addColorStop(0.55, p.midLight);
      g.addColorStop(1, p.mid);
      return g;
    },
  );
  ctx.fillStyle = gradient;
  ctx.fillRect(0, horizon, c.w, seaHeight + 2);

  // Sun reflection.
  const reflection = sceneGradient(
    c,
    `sea-reflect|${p.glow}|${Math.round(horizon)}`,
    () => {
      const g = ctx.createLinearGradient(0, horizon, 0, c.playableH);
      g.addColorStop(0, p.glow);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      return g;
    },
  );
  ctx.save();
  ctx.globalAlpha = 0.34;
  ctx.fillStyle = reflection;
  ctx.beginPath();
  ctx.moveTo(c.w * 0.78 - 4 * c.s, horizon);
  ctx.lineTo(c.w * 0.78 + 4 * c.s, horizon);
  ctx.lineTo(c.w * 0.78 + 30 * c.s, c.playableH);
  ctx.lineTo(c.w * 0.78 - 30 * c.s, c.playableH);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Rolling wave bands at different depths.
  ctx.save();
  for (let layer = 0; layer < 4; layer += 1) {
    const yBase = horizon + (layer + 1) * (seaHeight / 5.6);
    const amplitude = (2 + layer * 1.4) * c.s;
    const step = (24 + layer * 9) * c.s;
    const speed = 0.2 + layer * 0.08;
    const offset = mod(c.scroll * speed + (c.reducedMotion ? 0 : c.time * (5 + layer * 2) * c.s), step);
    ctx.strokeStyle = `rgba(255,255,255,${0.16 + layer * 0.07})`;
    ctx.lineWidth = (1.4 + layer * 0.4) * c.s;
    ctx.beginPath();
    for (let x = -step - offset; x <= c.w + step; x += step) {
      ctx.moveTo(x, yBase + Math.sin((x + layer * 7) * 0.03) * amplitude);
      ctx.quadraticCurveTo(x + step * 0.45, yBase - amplitude * 1.7, x + step * 0.9, yBase);
    }
    ctx.stroke();
  }
  ctx.restore();

  // A little dhow sails past on the horizon.
  const sailX = mod(c.w * 0.28 - c.scroll * 0.045 - c.time * 2.4 * c.s, c.w + 100 * c.s) - 30 * c.s;
  const sailY = horizon - 2 * c.s;
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 1.2 * c.s;
  ctx.beginPath();
  ctx.moveTo(sailX - 13 * c.s, sailY);
  ctx.lineTo(sailX + 13 * c.s, sailY);
  ctx.lineTo(sailX + 8 * c.s, sailY + 4 * c.s);
  ctx.lineTo(sailX - 8 * c.s, sailY + 4 * c.s);
  ctx.closePath();
  ctx.fillStyle = p.cloud;
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(sailX, sailY);
  ctx.lineTo(sailX, sailY - 19 * c.s);
  ctx.stroke();
  fillPolygon(c, [
    [sailX, sailY - 18 * c.s],
    [sailX + 11 * c.s, sailY - 3 * c.s],
    [sailX, sailY - 3 * c.s],
  ], p.accentSoft, p.ink, 0.8 * c.s);

  // Cargo ship far out at sea.
  const shipX = mod(c.w * 0.8 - c.scroll * 0.025, c.w + 170 * c.s) - 55 * c.s;
  ctx.save();
  ctx.globalAlpha = 0.65;
  ctx.fillStyle = p.ink;
  ctx.fillRect(shipX, horizon - 8 * c.s, 62 * c.s, 9 * c.s);
  ctx.fillStyle = p.obstacleDark;
  ctx.fillRect(shipX + 8 * c.s, horizon - 19 * c.s, 34 * c.s, 11 * c.s);
  ctx.fillStyle = p.accent;
  ctx.fillRect(shipX + 12 * c.s, horizon - 17 * c.s, 6 * c.s, 5 * c.s);
  ctx.fillStyle = p.cloud;
  ctx.fillRect(shipX + 22 * c.s, horizon - 17 * c.s, 6 * c.s, 5 * c.s);
  ctx.fillStyle = p.accentSoft;
  ctx.fillRect(shipX + 32 * c.s, horizon - 17 * c.s, 6 * c.s, 5 * c.s);
  ctx.restore();
}

export function drawKarachiScene(c: SceneContext): void {
  const { palette: p, w, s, playableH, ctx } = c;
  drawSky(c, '#6fd0dc', '#ffd9a4');
  drawSun(c, w * 0.78, playableH * 0.15, 36 * s, 0.95);
  drawClouds(c, [
    [0.14, 0.12, 50, 0.7, 3],
    [0.54, 0.09, 39, 0.5, 2.4],
    [0.82, 0.27, 31, 0.34, 4.8],
    [0.35, 0.24, 24, 0.3, 5.6],
  ]);
  drawArabianSea(c);

  // A soft sandy headland cushions the mausoleum.
  const base = playableH * 0.842;
  fillPolygon(c, [
    [-20, playableH + 4 * s],
    [w * 0.2, playableH * 0.79],
    [w * 0.52, playableH * 0.81],
    [w * 0.82, playableH * 0.86],
    [w + 20, playableH],
  ], p.groundTop, 'rgba(30,80,80,0.15)', 1.2 * s);
  drawHaze(c, playableH * 0.65, 42 * s, 0.2);

  tiledLandmark(c, 0.12, w * 1.95, 0.42, (cx) => {
    drawMazar(c, cx, base, s * 0.94);
  });

  drawDatePalm(c, w * 0.13 - mod(c.scroll * 0.28, 80 * s), playableH * 0.845, 110 * s, 0.5);
  drawDatePalm(c, w * 0.92 - mod(c.scroll * 0.28, 80 * s), playableH * 0.87, 86 * s, 0.42);

  drawBirds(c, [
    [0.26, 0.24, 4.5, 0.55],
    [0.31, 0.28, 3.4, 0.4],
    [0.67, 0.2, 3.8, 0.4],
    [0.72, 0.24, 2.8, 0.3],
  ]);

  // A few sea-spray sparkles.
  ctx.save();
  ctx.globalAlpha = 0.3;
  for (let i = 0; i < 8; i += 1) {
    const x = mod(i * 53 * s + c.scroll * 0.4, w + 20 * s);
    const y = playableH * (0.61 + (i % 3) * 0.055);
    fillCircle(c, x, y, (1 + (i % 2)) * s, p.cloud);
  }
  ctx.restore();

  drawGround(c, 'beach');
}

/* ------------------------------------------------------------------ */
/* Mohenjo-Daro                                                        */
/* ------------------------------------------------------------------ */

export function drawMohenjoScene(c: SceneContext): void {
  const { palette: p, w, s, playableH, ctx } = c;
  drawSky(c, '#f2ce95', '#e89b5b');
  drawSun(c, w * 0.68, playableH * 0.16, 46 * s, 0.85);
  drawClouds(c, [
    [0.12, 0.2, 42, 0.36, 2.5],
    [0.52, 0.11, 29, 0.24, 3.6],
    [0.83, 0.22, 33, 0.3, 2.1],
  ]);
  drawHaze(c, playableH * 0.47, 115 * s, 0.4);

  drawRidge(
    c,
    [
      [0, 0.22], [0.08, 0.34], [0.16, 0.31], [0.18, 0.5], [0.31, 0.5],
      [0.35, 0.29], [0.45, 0.31], [0.5, 0.46], [0.63, 0.44], [0.67, 0.26],
      [0.78, 0.3], [0.82, 0.48], [0.94, 0.46], [1, 0.22],
    ],
    w * 1.1,
    playableH * 0.64,
    58 * s,
    c.scroll * 0.065,
    p.far,
  );
  drawHaze(c, playableH * 0.6, 65 * s, 0.33);

  drawRidge(
    c,
    [
      [0, 0.1], [0.1, 0.27], [0.22, 0.16], [0.34, 0.29], [0.47, 0.2],
      [0.6, 0.33], [0.73, 0.2], [0.85, 0.3], [0.94, 0.17], [1, 0.1],
    ],
    w * 0.85,
    playableH * 0.8,
    36 * s,
    c.scroll * 0.28,
    p.midLight,
  );

  tiledLandmark(c, 0.16, w * 1.8, 0.25, (cx) => {
    drawMohenjoRuins(c, cx, playableH * 0.855, s * 0.92);
  });

  drawDatePalm(c, mod(60 * s - c.scroll * 0.35, w + 120 * s) - 60 * s, playableH * 0.87, 76 * s, 0.5);

  drawBirds(c, [
    [0.18, 0.24, 5, 0.35],
    [0.21, 0.27, 3, 0.25],
    [0.8, 0.18, 4.2, 0.3],
  ]);

  // Dust motes catching the low sun.
  if (!c.reducedMotion && !c.lowFx) {
    ctx.save();
    ctx.globalAlpha = 0.28;
    for (let i = 0; i < 10; i += 1) {
      const x = mod(i * 37 * s - c.time * 6 * s, w + 10 * s);
      const y = playableH * 0.4 + mod(i * 29 * s - c.time * 3 * s, playableH * 0.35);
      fillCircle(c, x, y, 1.4 * s, p.accentSoft);
    }
    ctx.restore();
  }

  drawGround(c, 'clay');
}

/* ------------------------------------------------------------------ */
/* Islamabad                                                           */
/* ------------------------------------------------------------------ */

export function drawIslamabadScene(c: SceneContext): void {
  const { palette: p, w, s, playableH } = c;
  drawSky(c, '#a5dbf0', '#eff8e5');
  drawSun(c, w * 0.26, playableH * 0.16, 36 * s, 0.9);
  drawClouds(c, [
    [0.18, 0.13, 48, 0.72, 3.4],
    [0.56, 0.2, 35, 0.44, 4.2],
    [0.78, 0.1, 55, 0.6, 2.4],
    [0.92, 0.3, 23, 0.3, 5.4],
  ]);

  drawHaze(c, playableH * 0.4, 100 * s, 0.3);
  drawRidge(
    c,
    [
      [0, 0.28], [0.08, 0.54], [0.16, 0.38], [0.24, 0.62], [0.34, 0.4],
      [0.45, 0.58], [0.56, 0.35], [0.66, 0.54], [0.77, 0.32], [0.87, 0.52],
      [0.94, 0.36], [1, 0.5],
    ],
    w * 1.1,
    playableH * 0.58,
    99 * s,
    c.scroll * 0.07,
    p.farLight,
  );
  drawRidge(
    c,
    [
      [0, 0.2], [0.12, 0.38], [0.2, 0.25], [0.33, 0.42], [0.46, 0.22],
      [0.58, 0.39], [0.7, 0.24], [0.82, 0.4], [0.92, 0.22], [1, 0.3],
    ],
    w * 1.25,
    playableH * 0.66,
    86 * s,
    c.scroll * 0.16,
    p.far,
  );
  drawHaze(c, playableH * 0.62, 55 * s, 0.22);

  tiledLandmark(c, 0.17, w * 1.9, 0.36, (cx) => {
    drawFaisalMosque(c, cx, playableH * 0.835, s * 0.9);
  });

  // Pine-covered lower slopes.
  drawPineRow(c, 0.36, 38 * s, playableH * 0.9, 28, 52, 0.55, 11);
  drawPineRow(c, 0.78, 50 * s, playableH + 2 * s, 38, 76, 0.95, 4);

  drawBirds(c, [
    [0.24, 0.22, 3.2, 0.35],
    [0.29, 0.25, 2.4, 0.28],
  ]);

  // Wildflowers dotted along the foreground.
  for (let i = 0; i < 5; i += 1) {
    const x = mod(i * 89 * s + c.scroll * 0.82, w + 30 * s) - 10 * s;
    drawFlower(c, x, playableH + 13 * s, 3.2 * s, p.cloud, p.accent, 0.7);
  }

  drawGround(c, 'grass');
}

/* ------------------------------------------------------------------ */
/* Gwadar                                                              */
/* ------------------------------------------------------------------ */

export function drawGwadarScene(c: SceneContext): void {
  const { w, s, playableH } = c;
  drawSky(c, '#7fc4dd', '#ffd9a8');
  drawSun(c, w * 0.7, playableH * 0.14, 36 * s, 0.95);
  drawClouds(c, [
    [0.12, 0.12, 42, 0.6, 3],
    [0.45, 0.08, 30, 0.45, 2.6],
    [0.75, 0.2, 26, 0.34, 4.6],
  ]);
  drawHaze(c, playableH * 0.55, 90 * s, 0.3);
  drawArabianSea(c);
  drawDatePalm(c, w * 0.12 - mod(c.scroll * 0.28, 80 * s), playableH * 0.85, 95 * s, 0.5);
  drawBirds(c, [
    [0.3, 0.2, 3.6, 0.5],
    [0.66, 0.16, 2.8, 0.4],
  ]);
  drawGround(c, 'beach');
}
