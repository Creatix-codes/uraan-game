import type { SceneContext } from './shared';
import { TAU, drawFlower, fillCircle, fillPolygon } from './shared';

function rect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  stroke?: string,
  lineWidth = 1.5,
): void {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, width, height);
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(x, y, width, height);
  }
}

/* ------------------------------------------------------------------ */
/* Swat — hillside chalet                                              */
/* ------------------------------------------------------------------ */

export function drawSwatChalet(
  c: SceneContext,
  cx: number,
  baseY: number,
  u: number,
): void {
  const { ctx, palette: p } = c;
  const ink = p.ink;
  const wood = '#8a5a3c';
  const woodLight = '#c08b5a';
  const plaster = '#f1e2bd';
  const roof = '#7d3f35';

  ctx.save();
  ctx.translate(cx, baseY);
  ctx.scale(u, u);

  // Stone terrace.
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = p.near;
  ctx.beginPath();
  ctx.ellipse(0, -2, 88, 14, 0, 0, TAU);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Timber lower storey.
  rect(ctx, -66, -58, 132, 55, plaster, ink, 1.5);
  ctx.strokeStyle = wood;
  ctx.lineWidth = 2.6;
  for (const x of [-66, -22, 22, 66]) {
    ctx.beginPath();
    ctx.moveTo(x, -58);
    ctx.lineTo(x, -3);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(-66, -33);
  ctx.lineTo(66, -33);
  ctx.stroke();

  // Golden windows and flower boxes.
  for (const x of [-48, -8, 32]) {
    rect(ctx, x, -28, 22, 17, '#f8d98c', ink, 1);
    ctx.strokeStyle = wood;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x + 11, -28);
    ctx.lineTo(x + 11, -11);
    ctx.stroke();
    rect(ctx, x - 2, -10, 26, 4, wood, ink, 0.8);
    drawFlower(c, x + 4, -8, 2.7, p.accent, p.accentSoft, 0.95);
    drawFlower(c, x + 18, -8, 2.4, '#e86a72', '#f9e3b1', 0.95);
  }

  // Upper wooden balcony.
  rect(ctx, -72, -84, 144, 29, wood, ink, 1.4);
  ctx.strokeStyle = woodLight;
  ctx.lineWidth = 1.4;
  for (let x = -68; x < 70; x += 8) {
    ctx.beginPath();
    ctx.moveTo(x, -81);
    ctx.lineTo(x, -58);
    ctx.stroke();
  }
  rect(ctx, -76, -88, 152, 5, woodLight, ink, 1.2);
  for (const x of [-52, 4, 48]) {
    rect(ctx, x, -78, 18, 12, '#f8d98c', ink, 0.8);
  }

  // Broad pitched roof.
  fillPolygon(c, [
    [-84, -86],
    [-30, -121],
    [30, -121],
    [84, -86],
    [62, -84],
    [0, -106],
    [-62, -84],
  ], roof, ink, 1.5);
  fillPolygon(c, [
    [-84, -86],
    [-30, -121],
    [0, -106],
    [-62, -84],
  ], '#94513f', ink, 1.1);
  // Roof ridge flowers.
  for (let x = -48; x <= 48; x += 24) {
    drawFlower(c, x, -92 + Math.abs(x) * 0.16, 2.3, p.accent, plaster, 0.85);
  }

  // Chimney with a curl of smoke.
  rect(ctx, 42, -126, 11, 23, wood, ink, 1);
  ctx.strokeStyle = 'rgba(255,255,255,0.48)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(47, -130);
  ctx.bezierCurveTo(38, -140, 56, -147, 47, -160);
  ctx.bezierCurveTo(40, -169, 53, -174, 49, -181);
  ctx.stroke();

  // Small fence.
  ctx.strokeStyle = wood;
  ctx.lineWidth = 1.5;
  for (let x = -84; x <= 84; x += 14) {
    ctx.beginPath();
    ctx.moveTo(x, -9);
    ctx.lineTo(x, -22);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(-86, -18);
  ctx.lineTo(86, -18);
  ctx.stroke();

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/* Hunza — Baltit stone fort                                           */
/* ------------------------------------------------------------------ */

export function drawHunzaFort(
  c: SceneContext,
  cx: number,
  baseY: number,
  u: number,
): void {
  const { ctx, palette: p } = c;
  const ink = p.ink;
  const stone = '#8d745c';
  const stoneLight = '#bea583';
  const stoneDark = '#5d4f43';

  ctx.save();
  ctx.translate(cx, baseY);
  ctx.scale(u, u);

  // Rocky ridge.
  fillPolygon(c, [
    [-120, 4],
    [-90, -22],
    [-45, -10],
    [0, -30],
    [48, -11],
    [90, -25],
    [125, 4],
  ], p.near, ink, 1.3);

  // Outer walls.
  rect(ctx, -86, -66, 172, 55, stone, ink, 1.6);
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1;
  for (let y = -59; y < -13; y += 9) {
    ctx.beginPath();
    ctx.moveTo(-84, y);
    ctx.lineTo(84, y);
    ctx.stroke();
    for (let x = -76 + ((y / 9) % 2) * 9; x < 80; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 9);
      ctx.stroke();
    }
  }

  // Crenellated parapet.
  ctx.fillStyle = stoneLight;
  for (let x = -86; x <= 70; x += 16) {
    ctx.fillRect(x, -74, 9, 9);
  }

  // Main keep tower.
  rect(ctx, -25, -121, 58, 57, stoneLight, ink, 1.6);
  ctx.fillStyle = stone;
  for (let x = -25; x <= 24; x += 14) {
    ctx.fillRect(x, -130, 8, 10);
  }
  // Windows glowing with the last sunlight.
  for (const [x, y] of [
    [-12, -109],
    [8, -109],
    [-12, -84],
    [8, -84],
  ] as const) {
    fillCircle(c, x, y, 3.4, '#f6cf86', ink, 0.7);
  }
  // Little watch tower.
  rect(ctx, 54, -101, 27, 37, stone, ink, 1.4);
  ctx.fillStyle = stoneLight;
  for (let x = 54; x <= 73; x += 9) {
    ctx.fillRect(x, -108, 6, 8);
  }
  fillCircle(c, 67, -83, 2.6, '#f6cf86', ink, 0.6);
  // Door and steps.
  ctx.fillStyle = stoneDark;
  ctx.beginPath();
  ctx.moveTo(-9, -11);
  ctx.lineTo(-9, -34);
  ctx.quadraticCurveTo(0, -46, 9, -34);
  ctx.lineTo(9, -11);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = ink;
  ctx.stroke();
  rect(ctx, -18, -11, 36, 5, stoneLight, ink, 0.8);

  // A tall apricot tree in blossom beside the fort.
  ctx.strokeStyle = '#5f4433';
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(96, 0);
  ctx.quadraticCurveTo(102, -36, 92, -69);
  ctx.stroke();
  const blossoms: Array<[number, number, number]> = [
    [93, -77, 15],
    [107, -66, 13],
    [79, -63, 12],
    [100, -51, 10],
    [84, -92, 9],
  ];
  for (const [x, y, radius] of blossoms) {
    ctx.globalAlpha = 0.88;
    fillCircle(c, x, y, radius, '#f6d0ce');
    fillCircle(c, x - 2, y - 2, radius * 0.55, '#fff0e5');
    ctx.globalAlpha = 1;
    fillCircle(c, x + 2, y + 1, 1.2, p.accent);
  }

  // Long flag on the keep.
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(0, -130);
  ctx.lineTo(0, -164);
  ctx.stroke();
  fillPolygon(c, [
    [0, -164],
    [19, -157],
    [0, -150],
  ], p.accent, ink, 0.8);

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/* Skardu — Shangrila lake hut                                         */
/* ------------------------------------------------------------------ */

export function drawShangrilaHut(
  c: SceneContext,
  cx: number,
  baseY: number,
  u: number,
): void {
  const { ctx, palette: p } = c;
  const ink = p.ink;
  const wood = '#845437';
  const plaster = '#f1dfbb';
  const roof = '#c85548';

  ctx.save();
  ctx.translate(cx, baseY);
  ctx.scale(u, u);

  // Wooden deck on stilts above the water.
  ctx.fillStyle = '#6f4d38';
  for (const x of [-58, -30, 20, 52]) {
    ctx.fillRect(x, -8, 4, 25);
  }
  ctx.fillStyle = '#a87950';
  ctx.fillRect(-72, -12, 145, 6);
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1;
  ctx.strokeRect(-72, -12, 145, 6);

  // Two connected cottages with red pitched roofs.
  for (const [x, width, height, roofColor] of [
    [-51, 56, 46, roof],
    [14, 58, 42, '#d96553'],
  ] as const) {
    rect(ctx, x, -height - 12, width, height, plaster, ink, 1.3);
    ctx.strokeStyle = wood;
    ctx.lineWidth = 1.5;
    for (let beam = x + 8; beam < x + width; beam += 13) {
      ctx.beginPath();
      ctx.moveTo(beam, -height - 12);
      ctx.lineTo(beam, -12);
      ctx.stroke();
    }
    // Window with warm light.
    rect(ctx, x + width * 0.28, -height + 8, 17, 15, '#f7d88d', ink, 1);
    ctx.strokeStyle = wood;
    ctx.beginPath();
    ctx.moveTo(x + width * 0.28 + 8.5, -height + 8);
    ctx.lineTo(x + width * 0.28 + 8.5, -height + 23);
    ctx.moveTo(x + width * 0.28, -height + 15.5);
    ctx.lineTo(x + width * 0.28 + 17, -height + 15.5);
    ctx.stroke();
    fillPolygon(c, [
      [x - 7, -height - 10],
      [x + width / 2, -height - 31],
      [x + width + 7, -height - 10],
      [x + width + 2, -height - 5],
      [x + width / 2, -height - 23],
      [x - 2, -height - 5],
    ], roofColor, ink, 1.4);
    for (let flower = 0; flower < 3; flower += 1) {
      drawFlower(c, x + 12 + flower * 16, -16, 2.2, p.accent, '#fff3cb', 0.9);
    }
  }

  // Little rowboat on the lake.
  ctx.save();
  ctx.translate(86, 13);
  ctx.rotate(-0.04);
  fillPolygon(c, [
    [-23, 0],
    [23, 0],
    [16, 7],
    [-16, 7],
  ], '#9a5d3f', ink, 1.2);
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(8, 0);
  ctx.lineTo(8, -13);
  ctx.stroke();
  fillPolygon(c, [
    [9, -12],
    [22, -2],
    [9, -3],
  ], p.accentSoft, ink, 0.8);
  ctx.restore();

  // Poplar trees on the shore.
  ctx.strokeStyle = '#6d4c36';
  ctx.lineWidth = 1.6;
  for (const [x, height] of [
    [-82, 62],
    [90, 53],
  ] as const) {
    ctx.beginPath();
    ctx.moveTo(x, -12);
    ctx.lineTo(x, -height);
    ctx.stroke();
    ctx.fillStyle = p.mid;
    ctx.beginPath();
    ctx.ellipse(x, -height * 0.62, 8, height * 0.4, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = p.midLight;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.ellipse(x + 2, -height * 0.66, 4, height * 0.3, 0.1, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/* Fairy Meadows — alpine cabin                                        */
/* ------------------------------------------------------------------ */

export function drawFairyCabin(
  c: SceneContext,
  cx: number,
  baseY: number,
  u: number,
): void {
  const { ctx, palette: p } = c;
  const ink = p.ink;
  const log = '#7b5137';
  const logLight = '#a9754b';
  const roof = '#8f493a';
  const roofLight = '#b6634c';

  ctx.save();
  ctx.translate(cx, baseY);
  ctx.scale(u, u);

  // Log walls.
  rect(ctx, -74, -67, 148, 62, log, ink, 1.6);
  ctx.strokeStyle = logLight;
  ctx.lineWidth = 1.3;
  for (let y = -58; y < -8; y += 8) {
    ctx.beginPath();
    ctx.moveTo(-72, y);
    ctx.lineTo(72, y);
    ctx.stroke();
    fillCircle(c, -74, y + 4, 2.2, logLight, ink, 0.6);
    fillCircle(c, 74, y + 4, 2.2, logLight, ink, 0.6);
  }

  // Steep alpine roof with snow on the ridge.
  fillPolygon(c, [
    [-91, -64],
    [-34, -111],
    [34, -111],
    [91, -64],
    [70, -59],
    [0, -96],
    [-70, -59],
  ], roof, ink, 1.6);
  fillPolygon(c, [
    [-91, -64],
    [-34, -111],
    [0, -96],
    [-70, -59],
  ], roofLight, ink, 1);
  // Soft snow along the roof edge.
  fillPolygon(c, [
    [-34, -111],
    [-20, -104],
    [-8, -108],
    [0, -96],
    [-70, -59],
    [-62, -67],
    [-48, -63],
    [-40, -73],
    [-28, -68],
  ], 'rgba(248,249,240,0.9)', ink, 0.8);

  // Chimney smoke.
  rect(ctx, 36, -120, 11, 27, '#8e6e55', ink, 1);
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(41, -125);
  ctx.bezierCurveTo(30, -136, 52, -143, 41, -155);
  ctx.stroke();

  // Door and glowing windows.
  ctx.fillStyle = '#4b3528';
  ctx.fillRect(-11, -35, 22, 30);
  ctx.strokeStyle = ink;
  ctx.strokeRect(-11, -35, 22, 30);
  fillCircle(c, 6, -21, 1.3, p.accent);
  for (const x of [-49, 27]) {
    rect(ctx, x, -49, 22, 18, '#f8d88a', ink, 1);
    ctx.strokeStyle = log;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x + 11, -49);
    ctx.lineTo(x + 11, -31);
    ctx.moveTo(x, -40);
    ctx.lineTo(x + 22, -40);
    ctx.stroke();
  }

  // Flower boxes and a little fence.
  for (const x of [-53, 23]) {
    rect(ctx, x, -29, 30, 4, logLight, ink, 0.7);
    for (let i = 0; i < 4; i += 1) {
      drawFlower(c, x + 3 + i * 8, -31, 2.5, i % 2 ? '#e86a72' : p.accent, '#fff4c8', 0.95);
    }
  }

  ctx.strokeStyle = log;
  ctx.lineWidth = 1.4;
  for (let x = -92; x <= 92; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, -13);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(-95, -8);
  ctx.lineTo(95, -8);
  ctx.stroke();

  // A flag painted with a tiny star.
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-30, -105);
  ctx.lineTo(-30, -137);
  ctx.stroke();
  fillPolygon(c, [
    [-30, -137],
    [-11, -131],
    [-30, -124],
  ], p.accent, ink, 0.7);
  fillCircle(c, -23, -131, 1.4, ink);

  ctx.restore();
}
