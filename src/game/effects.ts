import type { LevelConfig } from '../types';

export type ParticleKind = 'spark' | 'petal' | 'feather' | 'confetti' | 'dust';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  rotation: number;
  spin: number;
  kind: ParticleKind;
}

export interface FloatingText {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  text: string;
  color: string;
  size: number;
}

const TAU = Math.PI * 2;

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function makeStarBurst(
  x: number,
  y: number,
  scale: number,
  level: LevelConfig,
): Particle[] {
  const colors = [level.palette.accent, '#e95a78', '#fff0b5', '#3fc2a1', level.palette.accentSoft];
  const burst: Particle[] = [];
  for (let i = 0; i < 13; i += 1) {
    const angle = (i / 13) * TAU + rand(-0.25, 0.25);
    const speed = rand(55, 150) * scale;
    burst.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 25 * scale,
      gravity: 190 * scale,
      life: rand(0.45, 0.85),
      maxLife: 0.9,
      size: rand(2.2, 4.6) * scale,
      color: colors[i % colors.length],
      rotation: rand(0, TAU),
      spin: rand(-6, 6),
      kind: i % 3 === 0 ? 'petal' : 'spark',
    });
  }
  return burst;
}

export function makeFeatherBurst(
  x: number,
  y: number,
  scale: number,
  level: LevelConfig,
): Particle[] {
  const colors = ['#52bf65', '#2f9a56', '#e7d95e', level.palette.accentSoft, '#d6a34b'];
  const feathers: Particle[] = [];
  for (let i = 0; i < 15; i += 1) {
    const angle = rand(-Math.PI, 0.2);
    const speed = rand(60, 190) * scale;
    feathers.push({
      x: x + rand(-9, 9) * scale,
      y: y + rand(-7, 7) * scale,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity: 260 * scale,
      life: rand(0.6, 1.15),
      maxLife: 1.15,
      size: rand(3.5, 6.5) * scale,
      color: colors[i % colors.length],
      rotation: rand(0, TAU),
      spin: rand(-8, 8),
      kind: 'feather',
    });
  }
  return feathers;
}

export function makeDustPuff(x: number, y: number, scale: number): Particle[] {
  const dust: Particle[] = [];
  for (let i = 0; i < 8; i += 1) {
    dust.push({
      x: x + rand(-12, 12) * scale,
      y: y - 2 * scale,
      vx: rand(-45, 45) * scale,
      vy: rand(-60, -15) * scale,
      gravity: 20 * scale,
      life: rand(0.3, 0.55),
      maxLife: 0.55,
      size: rand(2.5, 5) * scale,
      color: 'rgba(247,231,193,0.65)',
      rotation: 0,
      spin: 0,
      kind: 'dust',
    });
  }
  return dust;
}

export function makeConfetti(
  width: number,
  height: number,
  scale: number,
  level: LevelConfig,
): Particle[] {
  const palette = [
    level.palette.accent,
    '#e95574',
    '#35bfa0',
    '#f7e7b4',
    '#2c7bbf',
    level.palette.accentSoft,
  ];
  const confetti: Particle[] = [];
  for (let i = 0; i < 72; i += 1) {
    confetti.push({
      x: rand(0, width),
      y: rand(-height * 0.4, height * 0.15),
      vx: rand(-38, 38) * scale,
      vy: rand(45, 135) * scale,
      gravity: 85 * scale,
      life: rand(1.4, 2.5),
      maxLife: 2.5,
      size: rand(3.5, 7) * scale,
      color: palette[i % palette.length],
      rotation: rand(0, TAU),
      spin: rand(-7, 7),
      kind: 'confetti',
    });
  }
  return confetti;
}

export function updateParticles(particles: Particle[], dt: number): void {
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const particle = particles[i];
    particle.vy += particle.gravity * dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.rotation += particle.spin * dt;
    particle.life -= dt;
    if (particle.life <= 0) particles.splice(i, 1);
  }
}

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  reducedMotion: boolean,
): void {
  ctx.save();
  for (const particle of particles) {
    const alpha = Math.min(1, particle.life / Math.max(0.08, particle.maxLife));
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.fillStyle = particle.color;

    if (particle.kind === 'confetti') {
      ctx.fillRect(-particle.size * 0.35, -particle.size * 0.8, particle.size * 0.7, particle.size * 1.6);
    } else if (particle.kind === 'feather') {
      ctx.beginPath();
      ctx.ellipse(0, 0, particle.size * 1.55, particle.size * 0.6, 0.2, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = 'rgba(20,50,40,0.35)';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(-particle.size * 1.2, 0);
      ctx.lineTo(particle.size * 1.2, 0);
      ctx.stroke();
    } else if (particle.kind === 'petal') {
      ctx.beginPath();
      ctx.ellipse(0, 0, particle.size * 1.3, particle.size * 0.65, 0, 0, TAU);
      ctx.fill();
    } else if (particle.kind === 'spark' && !reducedMotion) {
      const size = particle.size;
      ctx.beginPath();
      ctx.moveTo(0, -size * 1.8);
      ctx.lineTo(size * 0.55, -size * 0.5);
      ctx.lineTo(size * 1.8, 0);
      ctx.lineTo(size * 0.55, size * 0.5);
      ctx.lineTo(0, size * 1.8);
      ctx.lineTo(-size * 0.55, size * 0.5);
      ctx.lineTo(-size * 1.8, 0);
      ctx.lineTo(-size * 0.55, -size * 0.5);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, particle.size, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }
  ctx.restore();
}

export function drawFloatingText(
  ctx: CanvasRenderingContext2D,
  texts: FloatingText[],
): void {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const item of texts) {
    const alpha = Math.min(1, item.life / item.maxLife);
    ctx.globalAlpha = alpha;
    ctx.font = `800 ${item.size}px "Baloo 2", "Trebuchet MS", sans-serif`;
    ctx.lineWidth = Math.max(2, item.size * 0.16);
    ctx.strokeStyle = 'rgba(22,48,40,0.75)';
    ctx.strokeText(item.text, item.x, item.y);
    ctx.fillStyle = item.color;
    ctx.fillText(item.text, item.x, item.y);
  }
  ctx.restore();
}
