import type { LevelConfig, LevelPalette } from '../../types';

export const TAU = Math.PI * 2;

export const mod = (value: number, length: number): number => ((value % length) + length) % length;

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

/** Deterministic 0..1 pseudo-random value, useful for repeatable scenery. */
export const hash = (seed: number): number => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return value - Math.floor(value);
};

export interface SceneContext {
  ctx: CanvasRenderingContext2D;
  level: LevelConfig;
  palette: LevelPalette;
  w: number;
  h: number;
  s: number;
  groundY: number;
  playableH: number;
  scroll: number;
  time: number;
  reducedMotion: boolean;
}

export type CloudSpec = readonly [x: number, y: number, size: number, alpha: number, drift?: number];
export type Point = readonly [number, number];
export type GroundStyle =
  | 'terracotta'
  | 'beach'
  | 'clay'
  | 'grass'
  | 'rock'
  | 'meadow'
  | 'riverbank';

function path(c: SceneContext, points: readonly Point[], close = true): void {
  const { ctx } = c;
  ctx.beginPath();
  points.forEach(([x, y], index) => {
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  if (close) ctx.closePath();
}

export function fillPolygon(
  c: SceneContext,
  points: readonly Point[],
  fill: string,
  stroke?: string,
  lineWidth = 1,
): void {
  const { ctx } = c;
  path(c, points);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = 'round';
    ctx.stroke();
  }
}

export function fillCircle(
  c: SceneContext,
  x: number,
  y: number,
  radius: number,
  fill: string,
  stroke?: string,
  lineWidth = 1,
): void {
  const { ctx } = c;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

export function drawSky(c: SceneContext, top = c.palette.skyTop, bottom = c.palette.skyBottom): void {
  const { ctx } = c;
  const gradient = ctx.createLinearGradient(0, 0, 0, c.playableH);
  gradient.addColorStop(0, top);
  gradient.addColorStop(0.62, bottom);
  gradient.addColorStop(1, c.palette.haze);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, c.w, c.h);
}

export function drawSun(
  c: SceneContext,
  x: number,
  y: number,
  radius: number,
  alpha = 1,
): void {
  const { ctx, palette } = c;
  ctx.save();
  ctx.globalAlpha = alpha;
  const halos: Array<[number, number]> = [
    [2.5, 0.055],
    [1.9, 0.09],
    [1.4, 0.14],
  ];
  for (const [scale, opacity] of halos) {
    ctx.globalAlpha = alpha * opacity;
    ctx.fillStyle = palette.glow;
    ctx.beginPath();
    ctx.arc(x, y, radius * scale, 0, TAU);
    ctx.fill();
  }
  ctx.globalAlpha = alpha;
  ctx.fillStyle = palette.sun;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fill();
  ctx.globalAlpha = alpha * 0.7;
  ctx.fillStyle = palette.accentSoft;
  ctx.beginPath();
  ctx.arc(x - radius * 0.22, y - radius * 0.22, radius * 0.42, 0, TAU);
  ctx.fill();

  ctx.globalAlpha = alpha * 0.35;
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = Math.max(1, c.s * 1.2);
  ctx.setLineDash([c.s * 3, c.s * 7]);
  ctx.beginPath();
  ctx.arc(x, y, radius * 1.65, 0, TAU);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

export function drawCloud(
  c: SceneContext,
  x: number,
  y: number,
  size: number,
  alpha: number,
  color = c.palette.cloud,
): void {
  const { ctx } = c;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y + size * 0.12, size * 0.62, size * 0.22, 0, 0, TAU);
  ctx.arc(x - size * 0.34, y - size * 0.02, size * 0.2, 0, TAU);
  ctx.arc(x - size * 0.11, y - size * 0.18, size * 0.26, 0, TAU);
  ctx.arc(x + size * 0.2, y - size * 0.12, size * 0.22, 0, TAU);
  ctx.arc(x + size * 0.4, y + size * 0.02, size * 0.16, 0, TAU);
  ctx.fill();

  ctx.globalAlpha = alpha * 0.45;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(x + size * 0.02, y - size * 0.16, size * 0.3, size * 0.1, -0.1, 0, TAU);
  ctx.fill();
  ctx.restore();
}

export function drawClouds(c: SceneContext, specs: readonly CloudSpec[], parallax = 0.025): void {
  for (const [nx, ny, size, alpha, drift = 4] of specs) {
    const travel = c.reducedMotion ? 0 : c.time * drift * c.s;
    const x = mod(nx * c.w - c.scroll * parallax - travel, c.w + 190 * c.s) - 95 * c.s;
    drawCloud(c, x, ny * c.playableH, size * c.s, alpha);
  }
}

export function drawRidge(
  c: SceneContext,
  points: readonly Point[],
  tileWidth: number,
  baseY: number,
  height: number,
  offset: number,
  fill: string,
  stroke?: string,
): void {
  const { ctx } = c;
  const shift = -mod(offset, tileWidth);
  const copies = Math.ceil(c.w / tileWidth) + 3;
  ctx.save();
  ctx.fillStyle = fill;
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(1, c.s);
    ctx.lineJoin = 'round';
  }
  for (let i = 0; i < copies; i += 1) {
    const baseX = shift + (i - 1) * tileWidth;
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    for (const [px, py] of points) {
      ctx.lineTo(baseX + px * tileWidth, baseY - py * height);
    }
    ctx.lineTo(baseX + tileWidth, baseY);
    ctx.closePath();
    ctx.fill();
    if (stroke) ctx.stroke();
  }
  ctx.restore();
}

export function drawHaze(c: SceneContext, y: number, height: number, alpha = 0.35): void {
  const { ctx, palette } = c;
  const gradient = ctx.createLinearGradient(0, y - height / 2, 0, y + height / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,0)');
  gradient.addColorStop(0.5, palette.haze);
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = gradient;
  ctx.fillRect(0, y - height / 2, c.w, height);
  ctx.restore();
}

export function drawBirds(
  c: SceneContext,
  specs: ReadonlyArray<readonly [number, number, number, number]>,
  color = c.palette.ink,
): void {
  const { ctx } = c;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  for (let i = 0; i < specs.length; i += 1) {
    const [nx, ny, size, alpha] = specs[i];
    const flap = c.reducedMotion ? 0.3 : Math.sin(c.time * 2.5 + i * 1.8) * 0.5 + 0.5;
    const x = mod(nx * c.w - c.scroll * 0.05 - c.time * 3 * c.s, c.w + 100 * c.s) - 50 * c.s;
    const y = ny * c.playableH + Math.sin(c.time * 0.8 + i) * 6 * c.s;
    const wing = size * c.s;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = Math.max(1, c.s * 1.4);
    ctx.beginPath();
    ctx.moveTo(x - wing, y + wing * 0.3 * flap);
    ctx.quadraticCurveTo(x - wing * 0.45, y - wing * 0.35 * flap, x, y);
    ctx.quadraticCurveTo(x + wing * 0.45, y - wing * 0.35 * flap, x + wing, y + wing * 0.3 * flap);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawPine(
  c: SceneContext,
  x: number,
  baseY: number,
  height: number,
  color = c.palette.mid,
  light = c.palette.midLight,
  alpha = 1,
): void {
  const { ctx } = c;
  const trunkW = Math.max(2, height * 0.075);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = c.palette.obstacleDark;
  ctx.fillRect(x - trunkW / 2, baseY - height * 0.3, trunkW, height * 0.3);
  const tiers = 4;
  for (let i = 0; i < tiers; i += 1) {
    const t = i / tiers;
    const tierY = baseY - height * (0.14 + t * 0.66);
    const half = height * (0.19 - t * 0.032);
    fillPolygon(c, [
      [x, tierY - height * 0.24],
      [x - half, tierY],
      [x + half, tierY],
    ], i % 2 === 0 ? color : light);
  }
  ctx.restore();
}

export function drawDatePalm(
  c: SceneContext,
  x: number,
  baseY: number,
  height: number,
  alpha = 1,
): void {
  const { ctx, palette } = c;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = palette.obstacleDark;
  ctx.lineWidth = Math.max(1.5, height * 0.035);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, baseY);
  ctx.quadraticCurveTo(x + height * 0.08, baseY - height * 0.5, x + height * 0.03, baseY - height * 0.78);
  ctx.stroke();
  const crownY = baseY - height * 0.78;
  const fronds = 7;
  for (let i = 0; i < fronds; i += 1) {
    const angle = -Math.PI + (i / (fronds - 1)) * Math.PI;
    const length = height * (0.24 + (i % 2) * 0.05);
    ctx.strokeStyle = i % 2 === 0 ? palette.mid : palette.midLight;
    ctx.lineWidth = Math.max(1.3, height * 0.022);
    ctx.beginPath();
    ctx.moveTo(x + height * 0.03, crownY);
    ctx.quadraticCurveTo(
      x + height * 0.03 + Math.cos(angle) * length * 0.6,
      crownY + Math.sin(angle) * length * 0.35 - height * 0.05,
      x + height * 0.03 + Math.cos(angle) * length,
      crownY + Math.sin(angle) * length * 0.42,
    );
    ctx.stroke();
  }
  ctx.restore();
}

export function drawFlower(
  c: SceneContext,
  x: number,
  y: number,
  radius: number,
  petal: string,
  center: string,
  alpha = 1,
): void {
  const { ctx } = c;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = petal;
  for (let i = 0; i < 5; i += 1) {
    const angle = (i / 5) * TAU;
    ctx.beginPath();
    ctx.ellipse(
      x + Math.cos(angle) * radius * 0.65,
      y + Math.sin(angle) * radius * 0.65,
      radius * 0.58,
      radius * 0.4,
      angle,
      0,
      TAU,
    );
    ctx.fill();
  }
  ctx.fillStyle = center;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.38, 0, TAU);
  ctx.fill();
  ctx.restore();
}

export function drawButterfly(c: SceneContext, x: number, y: number, size: number, alpha = 1): void {
  const { ctx, palette } = c;
  const flutter = c.reducedMotion ? 0.4 : Math.sin(c.time * 5 + x * 0.02) * 0.5 + 0.5;
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = palette.accent;
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.ellipse(-size * 0.28, 0, size * 0.3, size * 0.5 * (0.35 + flutter), -0.4, 0, TAU);
  ctx.ellipse(size * 0.28, 0, size * 0.3, size * 0.5 * (0.35 + flutter), 0.4, 0, TAU);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = palette.ink;
  ctx.fillRect(-size * 0.04, -size * 0.28, size * 0.08, size * 0.55);
  ctx.restore();
}

export function tiledLandmark(
  c: SceneContext,
  speed: number,
  tileWidth: number,
  startRatio: number,
  draw: (cx: number) => void,
): void {
  const shift = -mod(c.scroll * speed, tileWidth);
  const copies = Math.ceil(c.w / tileWidth) + 2;
  for (let i = -1; i < copies; i += 1) {
    draw(shift + i * tileWidth + tileWidth * startRatio);
  }
}

export function drawArch(
  ctx: CanvasRenderingContext2D,
  x: number,
  bottom: number,
  width: number,
  height: number,
  fill: string,
  stroke?: string,
  lineWidth = 1.2,
): void {
  const half = width / 2;
  const shoulder = bottom - height * 0.55;
  ctx.beginPath();
  ctx.moveTo(x - half, bottom);
  ctx.lineTo(x - half, shoulder);
  ctx.quadraticCurveTo(x - half, bottom - height * 0.82, x, bottom - height);
  ctx.quadraticCurveTo(x + half, bottom - height * 0.82, x + half, shoulder);
  ctx.lineTo(x + half, bottom);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

export function drawOnionDome(
  c: SceneContext,
  x: number,
  baseY: number,
  width: number,
  height: number,
  fill: string,
  highlight = 'rgba(255,255,255,0.35)',
  stroke = c.palette.ink,
): void {
  const { ctx } = c;
  const half = width / 2;
  ctx.beginPath();
  ctx.moveTo(x - half * 0.72, baseY);
  ctx.bezierCurveTo(x - half * 1.02, baseY - height * 0.25, x - half * 0.92, baseY - height * 0.7, x, baseY - height);
  ctx.bezierCurveTo(x + half * 0.92, baseY - height * 0.7, x + half * 1.02, baseY - height * 0.25, x + half * 0.72, baseY);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = Math.max(1, c.s * 1.2);
  ctx.stroke();
  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = highlight;
  ctx.beginPath();
  ctx.ellipse(x - half * 0.25, baseY - height * 0.55, half * 0.22, height * 0.2, -0.35, 0, TAU);
  ctx.fill();
  ctx.restore();
}

export function drawPineRow(
  c: SceneContext,
  speed: number,
  spacing: number,
  baseY: number,
  minHeight: number,
  maxHeight: number,
  alpha = 1,
  seed = 1,
): void {
  const shifted = mod(c.scroll * speed, spacing);
  const count = Math.ceil(c.w / spacing) + 2;
  for (let i = -1; i < count; i += 1) {
    const x = i * spacing + shifted;
    const variance = hash(seed + i * 3.7);
    const height = (minHeight + (maxHeight - minHeight) * variance) * c.s;
    drawPine(
      c,
      x,
      baseY + 3 * c.s,
      height,
      c.palette.near,
      c.palette.mid,
      alpha,
    );
  }
}

export function drawGround(c: SceneContext, style: GroundStyle): void {
  const { ctx, palette, w, h, s, groundY } = c;
  const groundH = h - groundY;
  const gradient = ctx.createLinearGradient(0, groundY, 0, h);
  gradient.addColorStop(0, palette.groundTop);
  gradient.addColorStop(1, palette.groundBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, groundY, w, groundH);

  // A painted lip where the sky meets the earth.
  ctx.fillStyle = palette.ink;
  ctx.globalAlpha = 0.25;
  ctx.fillRect(0, groundY, w, 2.5 * s);
  ctx.globalAlpha = 1;
  ctx.fillStyle = palette.accentSoft;
  ctx.fillRect(0, groundY + 2.5 * s, w, 2 * s);

  const trimY = groundY + 5 * s;
  ctx.fillStyle = palette.accent;
  ctx.globalAlpha = 0.9;
  const step = 26 * s;
  const offset = mod(c.scroll, step);
  for (let x = -step - offset; x < w + step; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, trimY);
    ctx.lineTo(x + step * 0.5, trimY + 11 * s);
    ctx.lineTo(x + step, trimY);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, groundY + 18 * s, w, groundH - 18 * s);
  ctx.clip();

  const unit = 54 * s;
  const shift = mod(c.scroll, unit);

  if (style === 'terracotta') {
    ctx.strokeStyle = 'rgba(255,226,176,0.24)';
    ctx.lineWidth = 2 * s;
    for (let x = -unit - shift; x < w + unit; x += unit) {
      ctx.beginPath();
      ctx.moveTo(x + unit * 0.2, groundY + 30 * s);
      ctx.lineTo(x + unit * 0.8, groundY + 30 * s);
      ctx.lineTo(x + unit * 0.5, groundY + 42 * s);
      ctx.closePath();
      ctx.stroke();
      drawFlower(c, x + unit * 0.38, groundY + 46 * s, 4.5 * s, 'rgba(255,220,160,0.34)', 'rgba(255,244,215,0.5)');
    }
  } else if (style === 'beach') {
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 2 * s;
    for (let x = -unit - shift; x < w + unit; x += unit) {
      ctx.beginPath();
      ctx.arc(x + unit * 0.5, groundY + 35 * s, 12 * s, Math.PI * 1.08, Math.PI * 1.92);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + unit * 0.8, groundY + 50 * s, 5 * s, 0, Math.PI);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (let x = -unit - shift; x < w + unit; x += unit) {
      ctx.beginPath();
      ctx.ellipse(x + unit * 0.2, groundY + 29 * s, 3 * s, 1.6 * s, 0.5, 0, TAU);
      ctx.fill();
    }
  } else if (style === 'clay') {
    ctx.strokeStyle = 'rgba(255,224,170,0.22)';
    ctx.lineWidth = 1.5 * s;
    for (let row = 0; row < 3; row += 1) {
      const y = groundY + (30 + row * 14) * s;
      const rowOffset = mod(shift + row * unit * 0.5, unit);
      for (let x = -unit - rowOffset; x < w + unit; x += unit) {
        ctx.strokeRect(x, y, unit * 0.55, 8 * s);
      }
    }
    drawFlower(c, w * 0.2, groundY + 42 * s, 4 * s, 'rgba(255,224,178,0.35)', 'rgba(94,145,111,0.7)');
  } else if (style === 'rock') {
    ctx.strokeStyle = 'rgba(255,245,220,0.18)';
    ctx.lineWidth = 2 * s;
    for (let x = -unit - shift; x < w + unit; x += unit) {
      ctx.beginPath();
      ctx.moveTo(x, groundY + 36 * s);
      ctx.lineTo(x + unit * 0.45, groundY + 30 * s);
      ctx.lineTo(x + unit * 0.9, groundY + 38 * s);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,244,218,0.1)';
    for (let x = -unit - shift; x < w + unit; x += unit) {
      ctx.beginPath();
      ctx.arc(x + unit * 0.25, groundY + 50 * s, 5 * s, 0, TAU);
      ctx.fill();
    }
  } else {
    // Grass, meadow and riverbank styles.
    ctx.strokeStyle = 'rgba(38,84,48,0.28)';
    ctx.lineWidth = 1.6 * s;
    const blades = 5;
    for (let x = -unit - shift; x < w + unit; x += unit) {
      for (let i = 0; i < blades; i += 1) {
        const bx = x + i * unit * 0.18 + (i % 2) * 4 * s;
        const by = groundY + (28 + (i % 3) * 4) * s;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.quadraticCurveTo(bx + 3 * s, by - 8 * s, bx + 1 * s, by - 14 * s);
        ctx.stroke();
      }
      drawFlower(
        c,
        x + unit * 0.35,
        groundY + 39 * s,
        4.2 * s,
        palette.accentSoft,
        palette.accent,
        0.8,
      );
      drawFlower(
        c,
        x + unit * 0.75,
        groundY + 49 * s,
        3.2 * s,
        palette.cloud,
        palette.accent,
        0.7,
      );
    }
  }
  ctx.restore();

  const shade = ctx.createLinearGradient(0, h - 24 * s, 0, h);
  shade.addColorStop(0, 'rgba(20,30,24,0)');
  shade.addColorStop(1, 'rgba(20,30,24,0.28)');
  ctx.fillStyle = shade;
  ctx.fillRect(0, h - 24 * s, w, 24 * s);
}

export function drawWoodBridge(
  c: SceneContext,
  x: number,
  y: number,
  width: number,
  _deckY: number,
  alpha = 1,
): void {
  const { ctx } = c;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = c.palette.obstacleDark;
  ctx.lineWidth = 3 * c.s;
  ctx.beginPath();
  ctx.moveTo(x - width / 2, y);
  ctx.quadraticCurveTo(x, y - 23 * c.s, x + width / 2, y);
  ctx.stroke();
  ctx.fillStyle = c.palette.obstacle;
  ctx.fillRect(x - width / 2, y - 2 * c.s, width, 5 * c.s);
  ctx.strokeStyle = c.palette.obstacleLight;
  ctx.lineWidth = 1.5 * c.s;
  for (let i = 1; i < 7; i += 1) {
    const px = x - width / 2 + (width * i) / 7;
    const t = (i / 7) * 2 - 1;
    const py = y - (1 - t * t) * 22 * c.s;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px, py - 12 * c.s);
    ctx.stroke();
  }
  ctx.strokeStyle = c.palette.obstacleLight;
  ctx.beginPath();
  ctx.moveTo(x - width / 2, y - 12 * c.s);
  ctx.quadraticCurveTo(x, y - 38 * c.s, x + width / 2, y - 12 * c.s);
  ctx.stroke();
  ctx.restore();
}
