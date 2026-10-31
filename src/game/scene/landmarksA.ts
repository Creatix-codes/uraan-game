import type { SceneContext } from './shared';
import {
  TAU,
  drawArch,
  drawDatePalm,
  drawFlower,
  drawOnionDome,
  fillCircle,
  fillPolygon,
} from './shared';

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
/* Lahore — Badshahi Mosque                                            */
/* ------------------------------------------------------------------ */

export function drawBadshahi(
  c: SceneContext,
  cx: number,
  baseY: number,
  u: number,
): void {
  const { ctx, palette: p } = c;
  const ink = p.ink;
  const stone = p.obstacle;
  const stoneDeep = p.obstacleDark;
  const sand = p.obstacleLight;
  const cream = '#f6e4c6';
  const domeWhite = '#f7ead2';

  ctx.save();
  ctx.translate(cx, baseY);
  ctx.scale(u, u);

  // Foundation and long shadow.
  ctx.globalAlpha = 0.28;
  rect(ctx, -150, 0, 310, 12, ink);
  ctx.globalAlpha = 1;
  rect(ctx, -138, -6, 276, 8, stoneDeep, ink, 1.2);
  rect(ctx, -126, -11, 252, 6, sand, ink, 1);

  // Back wall and crenellations.
  rect(ctx, -112, -89, 224, 80, stone, ink, 1.8);
  ctx.fillStyle = cream;
  for (let x = -104; x <= 104; x += 18) {
    ctx.fillRect(x, -94, 9, 7);
  }

  // Main portal block.
  rect(ctx, -49, -131, 98, 122, sand, ink, 1.8);
  drawArch(ctx, 0, -6, 70, 116, stoneDeep, ink);
  drawArch(ctx, 0, -12, 50, 90, p.near, cream);
  drawArch(ctx, 0, -20, 35, 64, p.ink, p.accent, 2);
  // Golden inlay border and chhatri above the portal.
  ctx.strokeStyle = p.accent;
  ctx.lineWidth = 2;
  ctx.strokeRect(-43, -123, 86, 90);
  drawOnionDome(c, 0, -138, 28, 21, cream, 'rgba(255,255,255,0.5)', ink);
  fillCircle(c, 0, -160, 2.7, p.accent, ink, 1);
  ctx.strokeStyle = p.accent;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(0, -160);
  ctx.lineTo(0, -173);
  ctx.stroke();

  // Side arched niches.
  for (const x of [-80, 80]) {
    drawArch(ctx, x, -18, 25, 52, p.ink, cream, 1.2);
    drawArch(ctx, x, -12, 15, 29, p.midLight, p.accent, 1);
    drawFlower(c, x, -61, 4.6, p.accent, cream, 0.9);
  }

  // Horizontal marble bands.
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = cream;
  ctx.fillRect(-112, -52, 224, 2);
  ctx.fillRect(-112, -35, 224, 1.4);
  ctx.globalAlpha = 1;

  // Painted geometric panels along the base.
  for (let x = -104; x <= 96; x += 22) {
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x, -24);
    ctx.lineTo(x + 6, -18);
    ctx.lineTo(x, -12);
    ctx.lineTo(x + 6, -6);
    ctx.stroke();
  }

  // Three marble domes.
  drawOnionDome(c, 0, -137, 78, 57, domeWhite, 'rgba(255,255,255,0.55)', ink);
  drawOnionDome(c, -63, -99, 43, 34, domeWhite, 'rgba(255,255,255,0.5)', ink);
  drawOnionDome(c, 63, -99, 43, 34, domeWhite, 'rgba(255,255,255,0.5)', ink);
  for (const [x, y] of [
    [0, -194],
    [-63, -133],
    [63, -133],
  ]) {
    ctx.strokeStyle = p.accent;
    ctx.fillStyle = p.accent;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(x, y + 4, 2.8, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y + 7);
    ctx.lineTo(x, y + 15);
    ctx.stroke();
  }

  // Minarets with balconies and little cupolas.
  for (const x of [-135, 135]) {
    rect(ctx, x - 7, -207, 14, 203, stone, ink, 1.6);
    rect(ctx, x - 10, -6, 20, 10, stoneDeep, ink, 1);
    rect(ctx, x - 8.5, -78, 17, 3, cream);
    rect(ctx, x - 8.5, -144, 17, 3, cream);
    rect(ctx, x - 14, -143, 28, 8, sand, ink, 1.3);
    rect(ctx, x - 11, -135, 22, 4, cream);
    for (let i = 0; i < 3; i += 1) {
      ctx.fillStyle = i % 2 === 0 ? cream : p.accent;
      ctx.fillRect(x - 5, -192 + i * 11, 10, 2);
    }
    drawOnionDome(c, x, -207, 26, 22, domeWhite, 'rgba(255,255,255,0.5)', ink);
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x, -233);
    ctx.lineTo(x, -245);
    ctx.stroke();
    fillCircle(c, x, -234, 2.3, p.accent, ink, 0.8);
  }

  // Tiny truck-art flowers sprinkled across the facade.
  drawFlower(c, -20, -74, 3.8, p.accent, cream, 0.9);
  drawFlower(c, 20, -74, 3.8, p.accent, cream, 0.9);
  fillCircle(c, 0, -77, 2.1, cream);
  fillCircle(c, 0, -102, 2.1, cream);

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/* Karachi — Mazar-e-Quaid                                             */
/* ------------------------------------------------------------------ */

export function drawMazar(
  c: SceneContext,
  cx: number,
  baseY: number,
  u: number,
): void {
  const { ctx, palette: p } = c;
  const ink = p.ink;
  const marble = '#f4f1e3';
  const marbleShade = '#cfdfd8';
  const teal = '#2e7f81';

  ctx.save();
  ctx.translate(cx, baseY);
  ctx.scale(u, u);

  // Broad marble terrace.
  ctx.globalAlpha = 0.25;
  rect(ctx, -113, -2, 226, 14, ink);
  ctx.globalAlpha = 1;
  rect(ctx, -100, -14, 200, 13, marbleShade, ink, 1.2);
  rect(ctx, -90, -19, 180, 7, marble, ink, 1);

  // Four slender corner columns.
  for (const x of [-63, 63]) {
    rect(ctx, x - 3.5, -113, 7, 95, marble, teal, 1.1);
    rect(ctx, x - 6.5, -18, 13, 5, marbleShade, ink, 0.8);
    fillCircle(c, x, -116, 5.2, marble, ink, 1);
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(x, -120, 3, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, -123);
    ctx.lineTo(x, -128);
    ctx.stroke();
  }

  // Main white cube with carved arches.
  rect(ctx, -63, -79, 126, 61, marble, ink, 1.6);
  for (const x of [-37, 0, 37]) {
    drawArch(ctx, x, -21, 24, 43, teal, ink, 1.1);
    drawArch(ctx, x, -18, 17, 31, '#215f65', p.accent, 0.9);
  }
  ctx.fillStyle = p.accent;
  ctx.fillRect(-63, -80, 126, 1.8);
  ctx.fillRect(-63, -67, 126, 1.2);
  // Gold lattice windows.
  for (const x of [-20, 20]) {
    ctx.fillStyle = p.accent;
    for (let row = 0; row < 2; row += 1) {
      for (let col = 0; col < 2; col += 1) {
        ctx.fillRect(x + col * 5 - 3, -58 + row * 6, 2, 2);
      }
    }
  }

  // Dome with a soft scalloped base.
  rect(ctx, -45, -86, 90, 9, marbleShade, ink, 1.2);
  drawOnionDome(c, 0, -85, 88, 69, marble, 'rgba(255,255,255,0.75)', ink);
  ctx.strokeStyle = 'rgba(47,125,125,0.28)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(0, -114, 28, Math.PI * 0.08, Math.PI * 0.92);
  ctx.stroke();

  // Finial.
  ctx.strokeStyle = p.accent;
  ctx.lineWidth = 1.7;
  ctx.beginPath();
  ctx.moveTo(0, -154);
  ctx.lineTo(0, -172);
  ctx.stroke();
  fillCircle(c, 0, -158, 2.6, p.accent, ink, 0.7);
  ctx.beginPath();
  ctx.arc(2.5, -166, 4.3, Math.PI * 0.55, Math.PI * 1.6);
  ctx.stroke();

  // Palms flanking the mausoleum.
  drawDatePalm(c, -92, 4, 105, 0.8);
  drawDatePalm(c, 96, 6, 88, 0.65);

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/* Mohenjo-Daro — Indus ruins                                          */
/* ------------------------------------------------------------------ */

export function drawMohenjoRuins(
  c: SceneContext,
  cx: number,
  baseY: number,
  u: number,
): void {
  const { ctx, palette: p } = c;
  const ink = p.ink;
  const brick = p.obstacle;
  const brickLight = p.obstacleLight;
  const brickDark = p.obstacleDark;
  const water = '#5f8f83';

  ctx.save();
  ctx.translate(cx, baseY);
  ctx.scale(u, u);

  // The mound the ancient city rests on.
  ctx.beginPath();
  ctx.ellipse(0, -5, 150, 28, 0, Math.PI, TAU);
  ctx.fillStyle = p.mid;
  ctx.fill();
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // Great Bath — a sunken tank with steps.
  rect(ctx, 28, -34, 103, 33, brick, ink, 1.4);
  rect(ctx, 35, -29, 89, 23, water, ink, 1);
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = p.accentSoft;
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 6; col += 1) {
      ctx.fillRect(38 + col * 14, -27 + row * 8, 10, 3);
    }
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = brickLight;
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.moveTo(35 + i * 7, -6);
    ctx.lineTo(35 + i * 7, -16);
    ctx.stroke();
  }

  // Ruined stupa mound at the left.
  rect(ctx, -108, -64, 53, 58, brick, ink, 1.4);
  ctx.beginPath();
  ctx.ellipse(-82, -66, 30, 14, 0, Math.PI, TAU);
  ctx.fillStyle = brickLight;
  ctx.fill();
  ctx.strokeStyle = ink;
  ctx.stroke();
  // Irregular broken crown.
  ctx.beginPath();
  ctx.moveTo(-108, -64);
  ctx.lineTo(-100, -76);
  ctx.lineTo(-92, -64);
  ctx.lineTo(-84, -80);
  ctx.lineTo(-75, -64);
  ctx.lineTo(-67, -72);
  ctx.lineTo(-55, -64);
  ctx.strokeStyle = ink;
  ctx.lineWidth = 2;
  ctx.stroke();
  drawArch(ctx, -82, -10, 17, 35, brickDark, ink, 1);

  // Brick walls of the Lower Town.
  const walls: Array<[number, number, number, number]> = [
    [-49, -48, 34, 15],
    [-9, -55, 25, 22],
    [-51, -33, 23, 27],
    [131, -43, 30, 18],
    [120, -25, 41, 19],
    [161, -31, 17, 25],
    [5, -17, 24, 12],
  ];
  for (const [x, y, width, height] of walls) {
    rect(ctx, x, y, width, height, brick, ink, 1.1);
    ctx.strokeStyle = 'rgba(79,47,35,0.28)';
    ctx.lineWidth = 0.7;
    for (let by = y + 4; by < y + height; by += 5) {
      ctx.beginPath();
      ctx.moveTo(x + 1, by);
      ctx.lineTo(x + width - 1, by);
      ctx.stroke();
    }
    // Broken, uneven top edges.
    ctx.fillStyle = p.mid;
    for (let bx = x + 2; bx < x + width - 2; bx += 7) {
      ctx.fillRect(bx, y - 2, 4, 3);
    }
  }

  // Ancient well with a brick rim.
  ctx.beginPath();
  ctx.ellipse(88, -27, 16, 6, 0, 0, TAU);
  ctx.fillStyle = brickDark;
  ctx.fill();
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(88, -29, 10, 3.5, 0, 0, TAU);
  ctx.fillStyle = ink;
  ctx.fill();

  // An Indus seal motif painted on the largest wall.
  ctx.fillStyle = '#e4c08f';
  ctx.fillRect(-3, -47, 13, 13);
  ctx.strokeStyle = brickDark;
  ctx.lineWidth = 0.8;
  ctx.strokeRect(-3, -47, 13, 13);
  drawFlower(c, 3.5, -40.5, 2.8, brickDark, brickLight, 0.9);

  // Scattered bricks.
  for (let i = 0; i < 7; i += 1) {
    const x = -60 + i * 15;
    ctx.fillStyle = i % 2 === 0 ? brickDark : brickLight;
    ctx.fillRect(x, -7 - (i % 3) * 2, 8, 3);
  }

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/* Islamabad — Faisal Mosque                                           */
/* ------------------------------------------------------------------ */

export function drawFaisalMosque(
  c: SceneContext,
  cx: number,
  baseY: number,
  u: number,
): void {
  const { ctx, palette: p } = c;
  const ink = p.ink;
  const white = '#f5f2e6';
  const cream = '#e8e2cf';
  const shade = '#cdd9d3';
  const teal = '#3d756d';

  ctx.save();
  ctx.translate(cx, baseY);
  ctx.scale(u, u);

  // Terrace.
  ctx.globalAlpha = 0.22;
  rect(ctx, -118, -2, 236, 15, ink);
  ctx.globalAlpha = 1;
  rect(ctx, -105, -12, 210, 11, cream, ink, 1.2);
  rect(ctx, -95, -17, 190, 6, white, ink, 1);

  // Four minarets, two partly hidden by the canopy.
  for (const [x, height, alpha] of [
    [-91, 180, 0.75],
    [91, 180, 0.75],
    [-121, 149, 0.55],
    [121, 149, 0.55],
  ] as const) {
    ctx.globalAlpha = alpha;
    rect(ctx, x - 3.2, -height, 6.4, height - 12, white, ink, 1.1);
    rect(ctx, x - 5.5, -height + 26, 11, 3, cream, teal, 0.8);
    rect(ctx, x - 5.5, -height + 62, 11, 3, cream, teal, 0.8);
    ctx.beginPath();
    ctx.moveTo(x - 5.5, -height);
    ctx.lineTo(x, -height - 19);
    ctx.lineTo(x + 5.5, -height);
    ctx.closePath();
    ctx.fillStyle = white;
    ctx.fill();
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.strokeStyle = p.accent;
    ctx.beginPath();
    ctx.moveTo(x, -height - 19);
    ctx.lineTo(x, -height - 28);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Main block with a geometric facade.
  rect(ctx, -84, -45, 168, 34, white, ink, 1.6);
  rect(ctx, -75, -40, 150, 29, cream, teal, 0.8);
  for (const x of [-56, -28, 0, 28, 56]) {
    drawArch(ctx, x, -16, 15, 25, teal, white, 0.8);
  }
  ctx.fillStyle = p.accent;
  ctx.fillRect(-84, -45, 168, 1.8);

  // The great angular tent canopy.
  fillPolygon(c, [
    [-104, -42],
    [-34, -84],
    [0, -164],
    [0, -48],
  ], cream, ink, 1.6);
  fillPolygon(c, [
    [0, -48],
    [0, -164],
    [34, -84],
    [104, -42],
  ], white, ink, 1.6);
  fillPolygon(c, [
    [-104, -42],
    [-34, -84],
    [0, -48],
  ], shade, ink, 1.2);
  fillPolygon(c, [
    [104, -42],
    [34, -84],
    [0, -48],
  ], shade, ink, 1.2);
  fillPolygon(c, [
    [-34, -84],
    [0, -164],
    [34, -84],
    [0, -48],
  ], white, ink, 1.4);
  // Fold lines and golden apex.
  ctx.strokeStyle = 'rgba(61,117,109,0.5)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -164);
  ctx.lineTo(0, -48);
  ctx.moveTo(-34, -84);
  ctx.lineTo(34, -84);
  ctx.stroke();
  fillCircle(c, 0, -164, 2.5, p.accent, ink, 0.7);
  ctx.strokeStyle = p.accent;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(0, -164);
  ctx.lineTo(0, -178);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(2, -173, 3.8, Math.PI * 0.55, Math.PI * 1.6);
  ctx.stroke();

  // Truck-art dots on the base.
  for (let x = -70; x <= 70; x += 20) {
    fillCircle(c, x, -35, 1.4, p.accent);
  }

  ctx.restore();
}
