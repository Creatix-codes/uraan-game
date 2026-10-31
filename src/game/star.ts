import type { LevelConfig } from '../types';

export function drawCollectibleStar(
  ctx: CanvasRenderingContext2D,
  level: LevelConfig,
  x: number,
  y: number,
  radius: number,
  angle: number,
  time: number,
  reducedMotion: boolean,
): void {
  const pulse = reducedMotion ? 1 : 1 + Math.sin(time * 4.6) * 0.055;
  const r = radius * pulse;
  const palette = level.palette;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Soft painterly halo.
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = palette.glow;
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.9, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = palette.accentSoft;
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.38, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Eight-pointed truck-art star.
  ctx.beginPath();
  for (let i = 0; i < 16; i += 1) {
    const outer = i % 2 === 0;
    const pointRadius = outer ? r : r * 0.46;
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
    const px = Math.cos(a) * pointRadius;
    const py = Math.sin(a) * pointRadius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  const gold = ctx.createLinearGradient(-r, -r, r, r);
  gold.addColorStop(0, '#ffeaa6');
  gold.addColorStop(0.45, palette.accent);
  gold.addColorStop(1, '#e59234');
  ctx.fillStyle = gold;
  ctx.fill();
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = Math.max(1.6, r * 0.13);
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Inlaid crimson and teal petals.
  ctx.save();
  ctx.rotate(-angle * 0.54);
  for (let i = 0; i < 8; i += 1) {
    ctx.save();
    ctx.rotate((i / 8) * Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? '#d94565' : '#187f6d';
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.46, r * 0.15, r * 0.26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = '#fff4c2';
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.24, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = Math.max(1, r * 0.07);
  ctx.stroke();
  ctx.fillStyle = '#d94565';
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.09, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Twinkling points around the star.
  const twinkle = reducedMotion ? 0.5 : 0.45 + Math.sin(time * 3.4) * 0.35;
  ctx.globalAlpha = twinkle;
  ctx.fillStyle = '#fff5cd';
  for (const [tx, ty, size] of [
    [-r * 1.32, -r * 0.92, r * 0.2],
    [r * 1.25, -r * 0.72, r * 0.14],
    [r * 1.05, r * 1.16, r * 0.17],
  ] as const) {
    ctx.beginPath();
    ctx.moveTo(tx, ty - size);
    ctx.quadraticCurveTo(tx + size * 0.22, ty - size * 0.22, tx + size, ty);
    ctx.quadraticCurveTo(tx + size * 0.22, ty + size * 0.22, tx, ty + size);
    ctx.quadraticCurveTo(tx - size * 0.22, ty + size * 0.22, tx - size, ty);
    ctx.quadraticCurveTo(tx - size * 0.22, ty - size * 0.22, tx, ty - size);
    ctx.fill();
  }

  ctx.restore();
}
