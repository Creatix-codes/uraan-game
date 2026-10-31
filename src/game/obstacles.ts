import type { LevelConfig } from '../types';

export interface ObstacleShape {
  x: number;
  width: number;
  gapTop: number;
  gapBottom: number;
  groundY: number;
}

type Ctx = CanvasRenderingContext2D;

function roundedPath(ctx: Ctx, x: number, y: number, w: number, h: number, r: number): void {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function miniFlower(
  ctx: Ctx,
  x: number,
  y: number,
  r: number,
  petal: string,
  center: string,
  alpha = 1,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = petal;
  for (let i = 0; i < 5; i += 1) {
    const angle = (i / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(
      x + Math.cos(angle) * r * 0.62,
      y + Math.sin(angle) * r * 0.62,
      r * 0.48,
      r * 0.34,
      angle,
      0,
      0,
    );
    ctx.fill();
  }
  ctx.fillStyle = center;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.34, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function capRect(
  ctx: Ctx,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  stroke: string,
  r: number,
): void {
  roundedPath(ctx, x, y, width, height, r);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = Math.max(1.4, height * 0.09);
  ctx.stroke();
}

function drawTruckDiamonds(ctx: Ctx, x: number, y: number, w: number, h: number, color: string): void {
  ctx.fillStyle = color;
  const step = Math.max(18, 22);
  for (let dy = y + 20; dy < y + h - 12; dy += step) {
    ctx.beginPath();
    ctx.moveTo(x + w * 0.5, dy - 3);
    ctx.lineTo(x + w * 0.5 + 3, dy);
    ctx.lineTo(x + w * 0.5, dy + 3);
    ctx.lineTo(x + w * 0.5 - 3, dy);
    ctx.closePath();
    ctx.fill();
  }
}

function drawLahoreTower(
  ctx: Ctx,
  level: LevelConfig,
  x: number,
  y: number,
  width: number,
  height: number,
  top: boolean,
  s: number,
): void {
  const p = level.palette;
  const capH = 22 * s;
  const capY = top ? y + height - capH : y;
  roundedPath(ctx, x, y, width, height, 7 * s);
  ctx.save();
  ctx.clip();

  ctx.fillStyle = p.obstacle;
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = p.obstacleDark;
  ctx.globalAlpha = 0.34;
  ctx.fillRect(x + width * 0.62, y, width * 0.38, height);
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(255,233,198,0.22)';
  ctx.fillRect(x + width * 0.1, y, width * 0.12, height);

  // Carved sandstone courses and a recessed arch.
  const bandOffset = top ? 34 * s : 18 * s;
  ctx.fillStyle = 'rgba(245,222,187,0.55)';
  for (let by = y + bandOffset; by < y + height; by += 42 * s) {
    ctx.fillRect(x + 3 * s, by, width - 6 * s, 2 * s);
  }
  ctx.strokeStyle = 'rgba(70,26,30,0.35)';
  ctx.lineWidth = 1.6 * s;
  const nicheX = x + width * 0.5;
  const nicheY = y + height * (top ? 0.62 : 0.26);
  ctx.beginPath();
  ctx.moveTo(nicheX - 10 * s, nicheY + 24 * s);
  ctx.lineTo(nicheX - 10 * s, nicheY + 5 * s);
  ctx.quadraticCurveTo(nicheX, nicheY - 12 * s, nicheX + 10 * s, nicheY + 5 * s);
  ctx.lineTo(nicheX + 10 * s, nicheY + 24 * s);
  ctx.closePath();
  ctx.stroke();
  miniFlower(ctx, x + width * 0.5, top ? y + 24 * s : y + height - 24 * s, 5 * s, p.accent, '#fff1ca');

  // Inlaid lotus cornice at the gap edge.
  ctx.restore();
  capRect(ctx, x - 6 * s, capY, width + 12 * s, capH, p.obstacleLight, p.ink, 5 * s);
  ctx.fillStyle = p.obstacle;
  ctx.fillRect(x - 2 * s, capY + (top ? 4 : capH - 8) * s, width + 4 * s, 4 * s);
  ctx.fillStyle = p.accent;
  for (let dx = 4; dx < width; dx += 12 * s) {
    ctx.beginPath();
    ctx.arc(x + dx, capY + capH * 0.5, 2 * s, 0, Math.PI * 2);
    ctx.fill();
  }
  drawTruckDiamonds(ctx, x, y, width, height, 'rgba(255,222,160,0.55)');
}

function drawKarachiTower(
  ctx: Ctx,
  level: LevelConfig,
  x: number,
  y: number,
  width: number,
  height: number,
  top: boolean,
  s: number,
): void {
  const p = level.palette;
  roundedPath(ctx, x, y, width, height, 6 * s);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = p.obstacle;
  ctx.fillRect(x, y, width, height);
  // Coral and teal bands like a storybook lighthouse.
  const stripeH = 26 * s;
  for (let by = y; by < y + height; by += stripeH * 2) {
    ctx.fillStyle = '#ef8b74';
    ctx.fillRect(x, by, width, Math.min(stripeH, y + height - by));
  }
  ctx.fillStyle = 'rgba(35,95,98,0.35)';
  ctx.fillRect(x + width * 0.7, y, width * 0.3, height);
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  ctx.fillRect(x + width * 0.13, y, width * 0.1, height);

  // Porthole windows.
  const portholeStep = 45 * s;
  for (let by = y + 24 * s; by < y + height - 12 * s; by += portholeStep) {
    ctx.fillStyle = '#1f6d74';
    ctx.beginPath();
    ctx.arc(x + width * 0.5, by, 5 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 1.2 * s;
    ctx.stroke();
  }
  ctx.restore();

  roundedPath(ctx, x, y, width, height, 6 * s);
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.2 * s;
  ctx.stroke();

  // Lantern room with a gallery rail at the gap edge.
  const capY = top ? y + height - 26 * s : y;
  capRect(ctx, x - 7 * s, top ? capY : capY, width + 14 * s, 26 * s, '#245f66', p.ink, 4 * s);
  ctx.fillStyle = '#f8dda2';
  for (let wx = x - 1 * s; wx < x + width + 2 * s; wx += 10 * s) {
    ctx.fillRect(wx, capY + 8 * s, 5 * s, 9 * s);
  }
  ctx.strokeStyle = '#123f45';
  ctx.lineWidth = 2 * s;
  ctx.strokeRect(x - 1 * s, capY + 7 * s, width + 2 * s, 11 * s);
  ctx.fillStyle = p.accent;
  ctx.fillRect(x - 8 * s, capY + (top ? 3 : 20) * s, width + 16 * s, 3 * s);

  // A tiny dome on the lantern.
  ctx.beginPath();
  ctx.arc(x + width / 2, capY + (top ? 2 : 24) * s, 8 * s, top ? 0 : Math.PI, top ? Math.PI : 0);
  ctx.fillStyle = p.accentSoft;
  ctx.fill();
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 1.2 * s;
  ctx.stroke();
}

function drawMohenjoTower(
  ctx: Ctx,
  level: LevelConfig,
  x: number,
  y: number,
  width: number,
  height: number,
  top: boolean,
  s: number,
): void {
  const p = level.palette;
  roundedPath(ctx, x, y, width, height, 4 * s);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = p.obstacle;
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = p.obstacleDark;
  ctx.globalAlpha = 0.3;
  ctx.fillRect(x + width * 0.66, y, width * 0.34, height);
  ctx.globalAlpha = 1;

  // Ancient brick courses.
  const brickH = 8 * s;
  ctx.strokeStyle = 'rgba(91,55,39,0.42)';
  ctx.lineWidth = 0.9 * s;
  for (let row = 0; row < Math.ceil(height / brickH); row += 1) {
    const by = y + row * brickH;
    ctx.beginPath();
    ctx.moveTo(x + 2 * s, by);
    ctx.lineTo(x + width - 2 * s, by);
    ctx.stroke();
    const offsetX = row % 2 === 0 ? 0 : 8 * s;
    for (let bx = x + offsetX; bx < x + width; bx += 16 * s) {
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx, by + brickH);
      ctx.stroke();
    }
  }
  // A tiny carved seal.
  ctx.fillStyle = 'rgba(239,207,159,0.6)';
  const sealY = top ? y + height * 0.3 : y + height * 0.22;
  ctx.fillRect(x + width * 0.5 - 7 * s, sealY, 14 * s, 14 * s);
  miniFlower(ctx, x + width * 0.5, sealY + 7 * s, 4 * s, 'rgba(117,74,55,0.8)', '#f5ddb4');
  ctx.restore();

  roundedPath(ctx, x, y, width, height, 4 * s);
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.2 * s;
  ctx.stroke();

  // Stepped, broken-brick ledge.
  const capY = top ? y + height - 22 * s : y;
  capRect(ctx, x - 5 * s, capY, width + 10 * s, 22 * s, p.obstacleLight, p.ink, 3 * s);
  ctx.fillStyle = p.obstacleDark;
  for (let i = 0; i < Math.ceil(width / 12); i += 1) {
    ctx.fillRect(x - 2 * s + i * 12 * s, capY + (top ? 4 : 14) * s, 6 * s, 3 * s);
  }
  miniFlower(ctx, x + width * 0.5, capY + 11 * s, 4 * s, p.accentSoft, p.mid, 0.8);
}

function drawIslamabadTower(
  ctx: Ctx,
  level: LevelConfig,
  x: number,
  y: number,
  width: number,
  height: number,
  top: boolean,
  s: number,
): void {
  const p = level.palette;
  roundedPath(ctx, x, y, width, height, 8 * s);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = p.obstacle;
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = p.obstacleDark;
  ctx.globalAlpha = 0.32;
  ctx.fillRect(x + width * 0.65, y, width * 0.35, height);
  ctx.globalAlpha = 1;

  // Layered stone with cushions of moss.
  for (let by = y + 20 * s; by < y + height; by += 34 * s) {
    ctx.strokeStyle = 'rgba(30,62,48,0.38)';
    ctx.lineWidth = 1.3 * s;
    ctx.beginPath();
    ctx.moveTo(x + 3 * s, by);
    ctx.lineTo(x + width - 3 * s, by - 3 * s);
    ctx.stroke();
  }
  for (let i = 0; i < 4; i += 1) {
    const patchX = x + ((i * 17 + 9) % Math.max(1, width - 18)) * s;
    const patchY = y + (30 + i * 53) * s;
    ctx.fillStyle = i % 2 ? 'rgba(132,176,112,0.6)' : 'rgba(92,150,95,0.5)';
    ctx.beginPath();
    ctx.ellipse(patchX, patchY, 10 * s, 6 * s, 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Hanging vines.
  ctx.strokeStyle = 'rgba(53,107,75,0.8)';
  ctx.lineWidth = 1.4 * s;
  for (let i = 0; i < 3; i += 1) {
    const vx = x + width * (0.22 + i * 0.28);
    const vy = top ? y + height - 30 * s : y + 18 * s;
    const length = (16 + i * 8) * s;
    ctx.beginPath();
    ctx.moveTo(vx, vy);
    ctx.quadraticCurveTo(vx + 4 * s, vy + length * 0.6, vx - 2 * s, vy + (top ? length : -length));
    ctx.stroke();
  }
  ctx.restore();

  roundedPath(ctx, x, y, width, height, 8 * s);
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.4 * s;
  ctx.stroke();

  const capY = top ? y + height - 24 * s : y;
  capRect(ctx, x - 7 * s, capY, width + 14 * s, 24 * s, p.obstacleLight, p.ink, 7 * s);
  ctx.fillStyle = 'rgba(55,98,72,0.75)';
  ctx.fillRect(x - 4 * s, capY + (top ? 4 : 16) * s, width + 8 * s, 4 * s);

  // Pine sprays poking out of the mossy ledge.
  const sprayY = capY + (top ? 2 : 23) * s;
  for (let i = 0; i < 5; i += 1) {
    const sx = x + 8 * s + i * (width - 16 * s) / 4;
    ctx.strokeStyle = i % 2 ? p.obstacleDark : '#2f6246';
    ctx.lineWidth = 1.6 * s;
    ctx.beginPath();
    ctx.moveTo(sx, sprayY);
    ctx.lineTo(sx - 9 * s, sprayY + (top ? -11 : 11) * s);
    ctx.moveTo(sx, sprayY);
    ctx.lineTo(sx + 7 * s, sprayY + (top ? -8 : 8) * s);
    ctx.stroke();
  }
}

function drawSwatTower(
  ctx: Ctx,
  level: LevelConfig,
  x: number,
  y: number,
  width: number,
  height: number,
  top: boolean,
  s: number,
): void {
  const p = level.palette;
  roundedPath(ctx, x, y, width, height, 7 * s);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = '#735039';
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = 'rgba(35,30,22,0.3)';
  ctx.fillRect(x + width * 0.62, y, width * 0.38, height);
  ctx.fillStyle = 'rgba(255,223,175,0.15)';
  ctx.fillRect(x + width * 0.12, y, width * 0.14, height);

  // Bark grooves.
  ctx.strokeStyle = 'rgba(54,36,26,0.5)';
  ctx.lineWidth = 1.2 * s;
  for (let bx = x + 9 * s; bx < x + width - 4 * s; bx += 12 * s) {
    ctx.beginPath();
    ctx.moveTo(bx, y);
    ctx.quadraticCurveTo(bx + 3 * s, y + height * 0.4, bx - 2 * s, y + height);
    ctx.stroke();
  }
  // Vine and leaves.
  ctx.strokeStyle = '#4e845b';
  ctx.lineWidth = 2 * s;
  const vineX = x + width * 0.32;
  ctx.beginPath();
  ctx.moveTo(vineX, top ? y : y + height);
  ctx.bezierCurveTo(vineX + 18 * s, y + height * 0.35, vineX - 12 * s, y + height * 0.6, vineX + 6 * s, top ? y + height : y);
  ctx.stroke();
  for (let i = 0; i < 4; i += 1) {
    const ly = y + height * (0.2 + i * 0.18);
    ctx.fillStyle = i % 2 ? p.obstacleLight : '#87b078';
    ctx.beginPath();
    ctx.ellipse(vineX + (i % 2 ? 6 : -5) * s, ly, 4 * s, 2.6 * s, i * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }
  // A little painted heart, truck-art style.
  ctx.fillStyle = 'rgba(244,190,79,0.7)';
  const hy = top ? y + height * 0.22 : y + height * 0.72;
  ctx.beginPath();
  ctx.arc(x + width * 0.56 - 2.4 * s, hy, 2.6 * s, 0, Math.PI * 2);
  ctx.arc(x + width * 0.56 + 2.4 * s, hy, 2.6 * s, 0, Math.PI * 2);
  ctx.moveTo(x + width * 0.56 - 4.8 * s, hy + 1 * s);
  ctx.lineTo(x + width * 0.56, hy + 6 * s);
  ctx.lineTo(x + width * 0.56 + 4.8 * s, hy + 1 * s);
  ctx.fill();
  ctx.restore();

  roundedPath(ctx, x, y, width, height, 7 * s);
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.4 * s;
  ctx.stroke();

  // Pine-bough cap.
  const capY = top ? y + height - 22 * s : y;
  capRect(ctx, x - 6 * s, capY, width + 12 * s, 22 * s, '#65442f', p.ink, 5 * s);
  const boughY = capY + (top ? 4 : 18) * s;
  for (let i = 0; i < 5; i += 1) {
    const bx = x + 5 * s + i * (width - 10 * s) / 4;
    ctx.strokeStyle = i % 2 ? p.obstacleDark : p.obstacleLight;
    ctx.lineWidth = 1.8 * s;
    ctx.beginPath();
    ctx.moveTo(bx, boughY);
    ctx.lineTo(bx - 11 * s, boughY + (top ? -11 : 11) * s);
    ctx.moveTo(bx, boughY);
    ctx.lineTo(bx + 9 * s, boughY + (top ? -7 : 7) * s);
    ctx.stroke();
  }
  miniFlower(ctx, x + width * 0.5, capY + 11 * s, 4 * s, p.accentSoft, p.accent, 0.9);
}

function drawHunzaTower(
  ctx: Ctx,
  level: LevelConfig,
  x: number,
  y: number,
  width: number,
  height: number,
  top: boolean,
  s: number,
): void {
  const p = level.palette;
  roundedPath(ctx, x, y, width, height, 5 * s);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = p.obstacle;
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = p.obstacleDark;
  ctx.globalAlpha = 0.4;
  ctx.fillRect(x + width * 0.62, y, width * 0.38, height);
  ctx.globalAlpha = 1;
  // Angular rock facets.
  for (let i = 0; i < 5; i += 1) {
    ctx.fillStyle = i % 2 ? 'rgba(255,255,255,0.09)' : 'rgba(30,53,69,0.18)';
    const fy = y + i * height * 0.22;
    ctx.beginPath();
    ctx.moveTo(x, fy);
    ctx.lineTo(x + width * (0.35 + (i % 3) * 0.2), fy + 12 * s);
    ctx.lineTo(x + width, fy - 4 * s);
    ctx.lineTo(x + width, fy + 18 * s);
    ctx.lineTo(x + width * 0.4, fy + 24 * s);
    ctx.closePath();
    ctx.fill();
  }
  // Snow dusting.
  ctx.fillStyle = 'rgba(239,248,249,0.7)';
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.ellipse(x + width * (0.2 + i * 0.2), y + height * (0.15 + (i % 2) * 0.6), 12 * s, 4 * s, -0.2, 0, Math.PI * 2);
    ctx.fill();
  }
  // Painted gold star.
  miniFlower(ctx, x + width * 0.5, y + height * 0.45, 4.4 * s, p.accent, '#fff0c2', 0.9);
  ctx.restore();

  roundedPath(ctx, x, y, width, height, 5 * s);
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.4 * s;
  ctx.stroke();

  const capY = top ? y + height - 24 * s : y;
  capRect(ctx, x - 7 * s, capY, width + 14 * s, 24 * s, p.obstacleLight, p.ink, 5 * s);
  ctx.fillStyle = 'rgba(250,253,252,0.85)';
  ctx.beginPath();
  ctx.moveTo(x - 4 * s, capY + (top ? 3 : 21) * s);
  ctx.lineTo(x + width * 0.2, capY + (top ? 8 : 16) * s);
  ctx.lineTo(x + width * 0.48, capY + (top ? 2 : 22) * s);
  ctx.lineTo(x + width * 0.75, capY + (top ? 9 : 15) * s);
  ctx.lineTo(x + width + 4 * s, capY + (top ? 3 : 21) * s);
  ctx.lineTo(x + width + 4 * s, capY + (top ? 0 : 24) * s);
  ctx.lineTo(x - 4 * s, capY + (top ? 0 : 24) * s);
  ctx.closePath();
  ctx.fill();

  // Icicles reaching into the gap.
  ctx.fillStyle = 'rgba(220,240,246,0.8)';
  for (let i = 0; i < 4; i += 1) {
    const ix = x + 8 * s + i * width * 0.25;
    ctx.beginPath();
    ctx.moveTo(ix, capY + (top ? 23 : 1) * s);
    ctx.lineTo(ix + 3 * s, capY + (top ? 23 : 1) * s);
    ctx.lineTo(ix + 1.5 * s, capY + (top ? 38 : -14) * s);
    ctx.closePath();
    ctx.fill();
  }
}

function drawSkarduTower(
  ctx: Ctx,
  level: LevelConfig,
  x: number,
  y: number,
  width: number,
  height: number,
  top: boolean,
  s: number,
): void {
  const p = level.palette;
  roundedPath(ctx, x, y, width, height, 4 * s);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = '#526a78';
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = 'rgba(22,42,53,0.35)';
  ctx.fillRect(x + width * 0.63, y, width * 0.37, height);
  ctx.fillStyle = 'rgba(195,231,235,0.14)';
  ctx.fillRect(x + width * 0.1, y, width * 0.13, height);

  // Slate fractures.
  ctx.strokeStyle = 'rgba(17,37,46,0.45)';
  ctx.lineWidth = 1.2 * s;
  for (let i = 0; i < 5; i += 1) {
    const fy = y + 30 * s + i * height * 0.19;
    ctx.beginPath();
    ctx.moveTo(x + 3 * s, fy);
    ctx.lineTo(x + width * 0.45, fy + (i % 2 ? 7 : -4) * s);
    ctx.lineTo(x + width - 3 * s, fy + 3 * s);
    ctx.stroke();
  }
  // Turquoise ice veins.
  ctx.strokeStyle = 'rgba(115,226,221,0.65)';
  ctx.lineWidth = 1.6 * s;
  ctx.beginPath();
  ctx.moveTo(x + width * 0.6, y);
  ctx.lineTo(x + width * 0.42, y + height * 0.3);
  ctx.lineTo(x + width * 0.66, y + height * 0.52);
  ctx.lineTo(x + width * 0.46, y + height * 0.84);
  ctx.stroke();
  ctx.fillStyle = 'rgba(226,248,246,0.35)';
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.ellipse(x + width * (0.25 + i * 0.2), y + height * (0.2 + i * 0.25), 10 * s, 4 * s, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  roundedPath(ctx, x, y, width, height, 4 * s);
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.4 * s;
  ctx.stroke();

  const capY = top ? y + height - 24 * s : y;
  capRect(ctx, x - 7 * s, capY, width + 14 * s, 24 * s, '#7e929c', p.ink, 3 * s);
  ctx.fillStyle = 'rgba(241,248,245,0.75)';
  ctx.fillRect(x - 3 * s, capY + (top ? 3 : 17) * s, width + 6 * s, 4 * s);
  // Ice crystal spikes.
  for (let i = 0; i < 4; i += 1) {
    const ix = x + 4 * s + i * width * 0.26;
    ctx.fillStyle = i % 2 ? '#b4e7e4' : '#d9f2ed';
    ctx.beginPath();
    ctx.moveTo(ix, capY + (top ? 23 : 2) * s);
    ctx.lineTo(ix + 6 * s, capY + (top ? 23 : 2) * s);
    ctx.lineTo(ix + 2 * s, capY + (top ? 35 : -9) * s);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(25,64,71,0.4)';
    ctx.lineWidth = 0.8 * s;
    ctx.stroke();
  }
  miniFlower(ctx, x + width * 0.5, capY + 11 * s, 3.6 * s, p.accentSoft, p.accent, 0.8);
}

function drawFairyTower(
  ctx: Ctx,
  level: LevelConfig,
  x: number,
  y: number,
  width: number,
  height: number,
  top: boolean,
  s: number,
): void {
  const p = level.palette;
  roundedPath(ctx, x, y, width, height, 8 * s);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = '#547658';
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = 'rgba(28,53,38,0.32)';
  ctx.fillRect(x + width * 0.64, y, width * 0.36, height);
  ctx.fillStyle = 'rgba(218,235,182,0.2)';
  ctx.fillRect(x + width * 0.1, y, width * 0.12, height);

  // Mossy boulder shapes.
  for (let i = 0; i < 4; i += 1) {
    ctx.fillStyle = i % 2 ? 'rgba(118,155,103,0.45)' : 'rgba(44,80,57,0.38)';
    ctx.beginPath();
    ctx.ellipse(
      x + width * (0.28 + (i % 2) * 0.38),
      y + height * (0.15 + i * 0.22),
      18 * s,
      9 * s,
      i * 0.35,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  // Tiny flowers threaded through the moss.
  for (let i = 0; i < 4; i += 1) {
    miniFlower(
      ctx,
      x + width * (0.2 + (i % 2) * 0.55),
      y + height * (0.26 + i * 0.16),
      3 * s,
      i % 2 ? p.accentSoft : '#f2b1ae',
      p.accent,
    );
  }
  // Pine sprig.
  ctx.strokeStyle = '#335b3d';
  ctx.lineWidth = 1.4 * s;
  ctx.beginPath();
  ctx.moveTo(x + width * 0.75, y + height * 0.68);
  ctx.lineTo(x + width * 0.55, y + height * 0.8);
  ctx.moveTo(x + width * 0.75, y + height * 0.68);
  ctx.lineTo(x + width * 0.94, y + height * 0.78);
  ctx.stroke();
  ctx.restore();

  roundedPath(ctx, x, y, width, height, 8 * s);
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.4 * s;
  ctx.stroke();

  const capY = top ? y + height - 24 * s : y;
  capRect(ctx, x - 7 * s, capY, width + 14 * s, 24 * s, '#75955d', p.ink, 7 * s);
  ctx.fillStyle = '#90b56d';
  ctx.fillRect(x - 3 * s, capY + (top ? 3 : 16) * s, width + 6 * s, 5 * s);
  // Flower fringe.
  for (let i = 0; i < 4; i += 1) {
    miniFlower(
      ctx,
      x + 7 * s + i * (width - 14 * s) / 3,
      capY + (top ? 16 : 8) * s,
      3.4 * s,
      i % 2 ? p.accentSoft : '#f0a9a6',
      p.accent,
    );
  }
  // Grass blades over the ledge.
  ctx.strokeStyle = '#3b6348';
  ctx.lineWidth = 1.3 * s;
  for (let i = 0; i < 4; i += 1) {
    const bx = x + 6 * s + i * width * 0.27;
    ctx.beginPath();
    ctx.moveTo(bx, capY + (top ? 23 : 1) * s);
    ctx.lineTo(bx + 2 * s, capY + (top ? 33 : -9) * s);
    ctx.stroke();
  }
}

function drawTower(
  ctx: Ctx,
  level: LevelConfig,
  x: number,
  y: number,
  width: number,
  height: number,
  top: boolean,
  s: number,
): void {
  if (height <= 4) return;
  const ink = 'rgba(25,46,40,0.65)';
  switch (level.slug) {
    case 'lahore':
      drawLahoreTower(ctx, level, x, y, width, height, top, s);
      break;
    case 'karachi':
      drawKarachiTower(ctx, level, x, y, width, height, top, s);
      break;
    case 'mohenjo-daro':
      drawMohenjoTower(ctx, level, x, y, width, height, top, s);
      break;
    case 'islamabad':
      drawIslamabadTower(ctx, level, x, y, width, height, top, s);
      break;
    case 'swat':
      drawSwatTower(ctx, level, x, y, width, height, top, s);
      break;
    case 'hunza':
      drawHunzaTower(ctx, level, x, y, width, height, top, s);
      break;
    case 'skardu':
      drawSkarduTower(ctx, level, x, y, width, height, top, s);
      break;
    case 'fairy-meadows':
      drawFairyTower(ctx, level, x, y, width, height, top, s);
      break;
    default:
      roundedPath(ctx, x, y, width, height, 6 * s);
      ctx.fillStyle = level.palette.obstacle;
      ctx.fill();
      ctx.strokeStyle = ink;
      ctx.stroke();
  }
}

export function drawObstaclePair(
  ctx: Ctx,
  level: LevelConfig,
  shape: ObstacleShape,
  scale: number,
  _time: number,
  reducedMotion: boolean,
): void {
  const s = scale;
  const { x, width, gapTop, gapBottom, groundY } = shape;

  // Soft shadow gives a little depth without expensive blur.
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = level.palette.ink;
  roundedPath(ctx, x + 5 * s, gapTop - 4 * s + 10 * s, width, Math.max(0, gapBottom - gapTop - 20 * s), 9 * s);
  ctx.restore();

  drawTower(ctx, level, x, -10 * s, width, gapTop + 10 * s, true, s);
  drawTower(ctx, level, x, gapBottom, width, Math.max(6, groundY - gapBottom + 4 * s), false, s);

  // Painted gold studs at the edges of the gap-facing rims.
  ctx.save();
  ctx.fillStyle = level.palette.accent;
  for (const cx of [x + 4 * s, x + width - 4 * s]) {
    ctx.beginPath();
    ctx.arc(cx, gapTop - 8 * s, 1.7 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, gapBottom + 8 * s, 1.7 * s, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  if (!reducedMotion) {
    // A few motes of pollen drifting around the obstacle base.
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = level.palette.accentSoft;
    for (let i = 0; i < 3; i += 1) {
      const px = x + width * (0.2 + i * 0.3);
      const py = gapTop + ((_time * 10 * s + i * 31 * s) % Math.max(1, gapBottom - gapTop));
      ctx.beginPath();
      ctx.arc(px, py, 1.2 * s, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
