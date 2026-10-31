import type { LevelConfig } from '../types';
import { createScene } from './scene';
import type { SceneRenderer } from './scene';
import { drawObstaclePair } from './obstacles';
import { drawCollectibleStar } from './star';
import { drawParrot } from './parrot';
import { isLowEndDevice, getCanvasDpr } from './perf';
import {
  drawFloatingText,
  drawFlame,
  drawParticles,
  makeConfetti,
  makeDustPuff,
  makeFeatherBurst,
  makeFlameTrail,
  makeStarBurst,
  updateParticles,
  type FloatingText,
  type Particle,
} from './effects';

export type EnginePhase = 'ready' | 'playing' | 'paused' | 'victory' | 'defeat';

export interface HudState {
  progress: number;
  hearts: number;
  stars: number;
  distance: number;
  phase: EnginePhase;
}

export interface RunResult {
  levelId: number;
  rating: number;
  starsCollected: number;
  heartsLeft: number;
  score: number;
  distance: number;
}

export interface EngineCallbacks {
  onHud: (hud: HudState) => void;
  onFlap: () => void;
  onStar: (count: number) => void;
  onHeartLost: (hearts: number) => void;
  onVictory: (result: RunResult) => void;
  onDefeat: () => void;
}

interface Obstacle {
  x: number;
  width: number;
  gap: number;
  gapCenter: number;
  passed: boolean;
}

interface StarEntity {
  x: number;
  y: number;
  radius: number;
  phase: number;
}

const TAU = Math.PI * 2;
const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

function circleHitsRect(
  cx: number,
  cy: number,
  radius: number,
  x: number,
  y: number,
  width: number,
  height: number,
): boolean {
  const closestX = clamp(cx, x, x + width);
  const closestY = clamp(cy, y, y + height);
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy <= radius * radius;
}

export class GameEngine {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly level: LevelConfig;
  private readonly callbacks: EngineCallbacks;
  private readonly scene: SceneRenderer;
  private readonly lowEnd: boolean;
  private lowFx: boolean;
  private reducedMotion = false;

  private width = 360;
  private height = 640;
  private dpr = 1;
  private scale = 1;
  private groundHeight = 62;
  private playableHeight = 578;
  private hasSized = false;

  private phase: EnginePhase = 'ready';
  private time = 0;
  private raf: number | null = null;
  private lastTimestamp = 0;
  private destroyed = false;

  private parrot = {
    x: 100,
    y: 280,
    vy: 0,
    radius: 15,
    angle: 0,
  };
  private wingPhase = 0;
  private wingEnergy = 0.2;
  private wingAngle = 0;
  private blinkUntil = 0;
  private nextBlinkAt = 2.4;

  private hearts = 3;
  private starsCollected = 0;
  private travelled = 0;
  private scroll = 0;
  private targetPx = 5200;
  private distanceUnit = 10;
  private obstacles: Obstacle[] = [];
  private collectibles: StarEntity[] = [];
  private particles: Particle[] = [];
  private floaters: FloatingText[] = [];
  private nextObstacleAt = 0;
  private lastGapCenter = 0;
  private invulnerableUntil = 0;
  private shakeUntil = 0;
  private shakeStrength = 0;
  private flashUntil = 0;
  private lastHudKey = '';
  private hasEnded = false;
  private landed = false;
  private vignette: CanvasGradient | null = null;

  constructor(canvas: HTMLCanvasElement, level: LevelConfig, callbacks: EngineCallbacks) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas 2D is not available in this browser.');
    this.ctx = ctx;
    this.level = level;
    this.callbacks = callbacks;
    this.lowEnd = isLowEndDevice();
    this.lowFx = this.lowEnd;
    this.scene = createScene(level, this.lowFx);
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    const rect = canvas.getBoundingClientRect();
    this.resize(rect.width || 360, rect.height || 640);
    this.reset();
  }

  getPhase(): EnginePhase {
    return this.phase;
  }

  resize(cssWidth: number, cssHeight: number): void {
    if (this.destroyed) return;
    const width = Math.max(240, Math.floor(cssWidth));
    const height = Math.max(360, Math.floor(cssHeight));
    if (this.hasSized && width === this.width && height === this.height) return;

    const previousWidth = this.width;
    const previousPlayable = this.playableHeight;
    const previousScale = this.scale;

    this.width = width;
    this.height = height;
    this.scale = clamp(Math.min(width / 360, height / 640), 0.7, 1.5);
    this.groundHeight = 62 * this.scale;
    this.playableHeight = height - this.groundHeight;
    this.dpr = getCanvasDpr(this.lowEnd);
    this.canvas.width = Math.round(width * this.dpr);
    this.canvas.height = Math.round(height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.ctx.imageSmoothingEnabled = true;

    if (this.hasSized) {
      const xRatio = width / previousWidth;
      const yRatio = this.playableHeight / previousPlayable;
      const sRatio = this.scale / previousScale;
      this.parrot.x = width * 0.29;
      this.parrot.y = clamp(this.parrot.y * yRatio, 20, this.playableHeight - 30);
      this.parrot.radius = 15 * this.scale;
      this.obstacles = this.obstacles.map((obstacle) => ({
        ...obstacle,
        x: obstacle.x * xRatio,
        width: obstacle.width * sRatio,
        gap: obstacle.gap * sRatio,
        gapCenter: obstacle.gapCenter * yRatio,
      }));
      this.collectibles = this.collectibles.map((star) => ({
        ...star,
        x: star.x * xRatio,
        y: star.y * yRatio,
        radius: 12 * this.scale,
      }));
      this.lastGapCenter *= yRatio;
      this.particles = this.particles.map((particle) => ({
        ...particle,
        x: particle.x * xRatio,
        y: particle.y * yRatio,
      }));
    } else {
      this.parrot.x = width * 0.29;
      this.parrot.y = this.playableHeight * 0.45;
      this.parrot.radius = 15 * this.scale;
    }

    if (this.phase === 'ready') {
      this.parrot.y = this.playableHeight * 0.45;
      this.targetPx = this.level.lengthMeters * 10 * this.scale;
      this.distanceUnit = 10 * this.scale;
    }

    this.scene.resize(width, height, this.scale, this.groundHeight);
    this.vignette = this.ctx.createRadialGradient(
      width / 2,
      height * 0.42,
      Math.min(width, height) * 0.26,
      width / 2,
      height * 0.44,
      Math.max(width, height) * 0.72,
    );
    this.vignette.addColorStop(0, 'rgba(12,35,29,0)');
    this.vignette.addColorStop(0.72, 'rgba(12,35,29,0.03)');
    this.vignette.addColorStop(1, 'rgba(12,35,29,0.2)');

    this.hasSized = true;
    this.draw();
  }

  reset(): void {
    this.phase = 'ready';
    this.time = 0;
    this.hearts = 3;
    this.starsCollected = 0;
    this.travelled = 0;
    this.scroll = 0;
    this.targetPx = this.level.lengthMeters * 10 * this.scale;
    this.distanceUnit = 10 * this.scale;
    this.obstacles = [];
    this.collectibles = [];
    this.particles = [];
    this.floaters = [];
    this.nextObstacleAt = 0;
    this.lastGapCenter = this.playableHeight * 0.5;
    this.invulnerableUntil = 0;
    this.shakeUntil = 0;
    this.shakeStrength = 0;
    this.flashUntil = 0;
    this.hasEnded = false;
    this.landed = false;
    this.wingEnergy = 0.2;
    this.wingPhase = 0;
    this.wingAngle = 0;
    this.parrot.x = this.width * 0.29;
    this.parrot.y = this.playableHeight * 0.45;
    this.parrot.vy = 0;
    this.parrot.angle = 0;
    this.parrot.radius = 15 * this.scale;
    this.nextBlinkAt = this.time + 1.8 + Math.random() * 2;
    this.emitHud(true);
    this.ensureLoop();
    this.draw();
  }

  begin(): void {
    if (this.phase !== 'ready') return;
    this.phase = 'playing';
    this.lastTimestamp = 0;
    this.parrot.vy = -330 * this.scale;
    this.spawnObstacle();
    this.nextObstacleAt = this.level.spacing * this.scale * 0.92;
    this.emitHud(true);
  }

  flap(): void {
    if (this.phase === 'ready') this.begin();
    if (this.phase !== 'playing') return;
    this.parrot.vy = -435 * this.scale;
    this.wingEnergy = 1;
    this.wingPhase = 0;
    this.callbacks.onFlap();
  }

  pause(): void {
    if (this.phase !== 'playing') return;
    this.phase = 'paused';
    this.stopLoop();
    this.emitHud(true);
    this.draw();
  }

  resume(): void {
    if (this.phase !== 'paused') return;
    this.phase = 'playing';
    this.lastTimestamp = 0;
    this.ensureLoop();
    this.emitHud(true);
  }

  restart(autoStart = false): void {
    this.stopLoop();
    this.reset();
    if (autoStart) {
      this.begin();
      this.flap();
    }
  }

  destroy(): void {
    this.destroyed = true;
    this.stopLoop();
  }

  private ensureLoop(): void {
    if (this.raf !== null || this.destroyed) return;
    this.lastTimestamp = 0;
    this.raf = requestAnimationFrame(this.loop);
  }

  private stopLoop(): void {
    if (this.raf !== null) {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    }
  }

  private loop = (timestamp: number): void => {
    if (this.destroyed) return;
    if (this.lastTimestamp === 0) this.lastTimestamp = timestamp;
    const dt = clamp((timestamp - this.lastTimestamp) / 1000, 0.001, 0.034);
    this.lastTimestamp = timestamp;
    this.time += dt;

    if (this.phase === 'playing') {
      this.updatePlaying(dt);
    } else if (this.phase === 'ready') {
      this.updateReady(dt);
    } else if (this.phase === 'victory' || this.phase === 'defeat') {
      this.updateEnd(dt);
    }

    this.updateBlink();
    updateParticles(this.particles, dt);
    this.updateFloaters(dt);
    this.emitHud();
    this.draw();
    this.raf = requestAnimationFrame(this.loop);
  };

  private updateReady(dt: number): void {
    const bob = Math.sin(this.time * 2.2) * 4.5 * this.scale;
    this.parrot.y = this.playableHeight * 0.45 + bob;
    this.parrot.angle = Math.sin(this.time * 1.5) * 0.025;
    this.wingEnergy = 0.22 + (Math.sin(this.time * 2.8) + 1) * 0.08;
    this.wingPhase += dt * 6.5;
    this.wingAngle = Math.sin(this.wingPhase) * 0.2;
  }

  private updatePlaying(dt: number): void {
    const progress = clamp(this.travelled / Math.max(1, this.targetPx), 0, 1);
    const speed = this.level.speed * this.scale * (1 + progress * 0.16);

    this.travelled += speed * dt;
    this.scroll += speed * dt;

    const gravity = 1420 * this.scale;
    this.parrot.vy = Math.min(this.parrot.vy + gravity * dt, 760 * this.scale);
    this.parrot.y += this.parrot.vy * dt;
    const targetAngle = clamp(this.parrot.vy / (900 * this.scale), -0.42, 0.72);
    this.parrot.angle += (targetAngle - this.parrot.angle) * Math.min(1, dt * 10);
    this.wingEnergy = Math.max(0, this.wingEnergy - dt * 2.35);
    this.wingPhase += dt * (8 + this.wingEnergy * 28);
    this.wingAngle = Math.sin(this.wingPhase) * (0.17 + this.wingEnergy * 0.68);

    this.spawnDueObstacles(progress);

    for (const obstacle of this.obstacles) {
      obstacle.x -= speed * dt;
      if (!obstacle.passed && obstacle.x + obstacle.width < this.parrot.x) {
        obstacle.passed = true;
      }
    }
    for (const star of this.collectibles) {
      star.x -= speed * dt;
    }

    this.checkObstacleCollisions();
    if (this.phase !== 'playing') return;
    this.collectStars();
    this.checkBoundaries();

    // Jetpack exhaust trail while climbing — a burst of flame particles.
    if (this.phase === 'playing' && this.parrot.vy < -120 * this.scale) {
      this.particles.push(
        ...makeFlameTrail(this.parrot.x - 20 * this.scale, this.parrot.y - 4 * this.scale, this.scale, this.level),
      );
    }

    this.obstacles = this.obstacles.filter((obstacle) => obstacle.x + obstacle.width > -30 * this.scale);
    this.collectibles = this.collectibles.filter(
      (star) => star.x > -30 * this.scale && !this.landed,
    );

    if (this.travelled >= this.targetPx) {
      this.finishVictory();
    }
  }

  private updateEnd(dt: number): void {
    if (this.phase === 'victory') {
      this.parrot.vy -= 90 * this.scale * dt;
      this.parrot.y += this.parrot.vy * dt;
      this.parrot.angle += (-0.35 - this.parrot.angle) * Math.min(1, dt * 3);
      this.wingPhase += dt * 16;
      this.wingAngle = Math.sin(this.wingPhase) * 0.6;
      return;
    }

    this.parrot.vy = Math.min(this.parrot.vy + 1500 * this.scale * dt, 840 * this.scale);
    this.parrot.y += this.parrot.vy * dt;
    this.parrot.angle += (1.05 - this.parrot.angle) * Math.min(1, dt * 5);
    this.wingPhase += dt * 2;
    this.wingAngle = Math.sin(this.wingPhase) * 0.14;
    const floor = this.playableHeight - this.parrot.radius - 4 * this.scale;
    if (this.parrot.y > floor) {
      this.parrot.y = floor;
      if (!this.landed) {
        this.landed = true;
        this.particles.push(...makeDustPuff(this.parrot.x, this.playableHeight, this.scale));
      }
      this.parrot.vy = 0;
    }
  }

  private spawnDueObstacles(progress: number): void {
    let guard = 0;
    while (this.travelled >= this.nextObstacleAt && guard < 3) {
      this.spawnObstacle();
      const spacing = this.level.spacing * this.scale * (1 - progress * 0.07);
      this.nextObstacleAt += Math.max(165 * this.scale, spacing);
      guard += 1;
    }
  }

  private spawnObstacle(): void {
    const progress = clamp(this.travelled / Math.max(1, this.targetPx), 0, 1);
    const gap = this.level.gap * this.scale * (1 - progress * 0.055);
    const margin = 54 * this.scale;
    const minCenter = margin + gap / 2;
    const maxCenter = this.playableHeight - margin - gap / 2;
    let center = minCenter + Math.random() * Math.max(1, maxCenter - minCenter);

    if (this.obstacles.length === 0) {
      center = clamp(this.parrot.y, minCenter, maxCenter);
    } else {
      const maxStep = 108 * this.scale;
      center = clamp(center, this.lastGapCenter - maxStep, this.lastGapCenter + maxStep);
      center = clamp(center, minCenter, maxCenter);
    }

    const width = 57 * this.scale;
    const x = this.width + 24 * this.scale;
    this.obstacles.push({
      x,
      width,
      gap,
      gapCenter: center,
      passed: false,
    });
    const starOffset = (Math.random() - 0.5) * gap * 0.3;
    this.collectibles.push({
      x: x + width / 2,
      y: clamp(center + starOffset, center - gap * 0.3, center + gap * 0.3),
      radius: 12 * this.scale,
      phase: Math.random() * TAU,
    });
    this.lastGapCenter = center;
  }

  private checkObstacleCollisions(): void {
    if (this.time < this.invulnerableUntil) return;
    const radius = 11 * this.scale;
    for (let i = this.obstacles.length - 1; i >= 0; i -= 1) {
      const obstacle = this.obstacles[i];
      const gapTop = obstacle.gapCenter - obstacle.gap / 2;
      const gapBottom = obstacle.gapCenter + obstacle.gap / 2;
      const inset = 4 * this.scale;
      const hitsTop = circleHitsRect(
        this.parrot.x,
        this.parrot.y,
        radius,
        obstacle.x + inset,
        -40,
        obstacle.width - inset * 2,
        gapTop + 40,
      );
      const hitsBottom = circleHitsRect(
        this.parrot.x,
        this.parrot.y,
        radius,
        obstacle.x + inset,
        gapBottom,
        obstacle.width - inset * 2,
        this.playableHeight - gapBottom + 20,
      );
      if (hitsTop || hitsBottom) {
        this.obstacles.splice(i, 1);
        this.loseHeart();
        if (this.phase === 'playing') {
          this.parrot.vy = -330 * this.scale;
          this.parrot.y = clamp(
            this.parrot.y,
            gapTop + radius,
            gapBottom - radius,
          );
        }
        break;
      }
    }
  }

  private collectStars(): void {
    const reach = this.parrot.radius + 8 * this.scale;
    for (let i = this.collectibles.length - 1; i >= 0; i -= 1) {
      const star = this.collectibles[i];
      const bob = Math.sin(this.time * 3 + star.phase) * 3 * this.scale;
      const dx = this.parrot.x - star.x;
      const dy = this.parrot.y - (star.y + bob);
      if (dx * dx + dy * dy < (reach + star.radius) * (reach + star.radius)) {
        this.collectibles.splice(i, 1);
        this.starsCollected += 1;
        this.particles.push(...makeStarBurst(star.x, star.y + bob, this.scale, this.level));
        this.floaters.push({
          x: star.x,
          y: star.y + bob - 18 * this.scale,
          life: 0.8,
          maxLife: 0.8,
          text: '+1',
          color: '#fff0b5',
          size: 17 * this.scale,
        });
        if (this.floaters.length > 6) this.floaters.shift();
        this.callbacks.onStar(this.starsCollected);
        this.emitHud(true);
      }
    }
  }

  private checkBoundaries(): void {
    const radius = this.parrot.radius;
    if (this.parrot.y - radius < 4 * this.scale) {
      this.parrot.y = 4 * this.scale + radius;
      if (this.parrot.vy < 0) this.parrot.vy = 0;
    }

    const floor = this.playableHeight - radius;
    if (this.parrot.y > floor) {
      this.parrot.y = floor;
      this.parrot.vy = -330 * this.scale;
      if (this.time >= this.invulnerableUntil) {
        this.loseHeart();
        this.particles.push(...makeDustPuff(this.parrot.x, this.playableHeight, this.scale));
      }
      if (this.phase === 'playing') {
        this.parrot.vy = -410 * this.scale;
      }
    }
  }

  private loseHeart(): void {
    if (this.phase !== 'playing') return;
    this.hearts = Math.max(0, this.hearts - 1);
    this.invulnerableUntil = this.time + 1.65;
    this.shakeUntil = this.time + 0.38;
    this.shakeStrength = 9 * this.scale;
    this.flashUntil = this.time + 0.28;
    this.particles.push(...makeFeatherBurst(this.parrot.x, this.parrot.y, this.scale, this.level));
    this.callbacks.onHeartLost(this.hearts);
    this.emitHud(true);
    if (this.hearts <= 0) {
      this.finishDefeat();
    }
  }

  private finishVictory(): void {
    if (this.hasEnded) return;
    this.hasEnded = true;
    this.phase = 'victory';
    this.travelled = this.targetPx;
    this.parrot.vy = -120 * this.scale;
    this.particles.push(...makeConfetti(this.width, this.height, this.scale, this.level));
    this.emitHud(true);

    let rating = 1;
    if (this.starsCollected >= this.level.starGoals[0]) rating = 2;
    if (this.starsCollected >= this.level.starGoals[1]) rating = 3;
    const distance = Math.round(this.level.lengthMeters);
    const score =
      distance +
      this.starsCollected * 35 +
      this.hearts * 60 +
      (this.hearts === 3 ? 80 : 0);
    this.callbacks.onVictory({
      levelId: this.level.id,
      rating,
      starsCollected: this.starsCollected,
      heartsLeft: this.hearts,
      score,
      distance,
    });
  }

  private finishDefeat(): void {
    if (this.hasEnded) return;
    this.hasEnded = true;
    this.phase = 'defeat';
    this.parrot.vy = -260 * this.scale;
    this.shakeUntil = this.time + 0.45;
    this.shakeStrength = 12 * this.scale;
    this.emitHud(true);
    this.callbacks.onDefeat();
  }

  private updateBlink(): void {
    if (this.time >= this.nextBlinkAt) {
      this.blinkUntil = this.time + 0.12;
      this.nextBlinkAt = this.time + 2.2 + Math.random() * 3.4;
    }
  }

  private updateFloaters(dt: number): void {
    for (let i = this.floaters.length - 1; i >= 0; i -= 1) {
      const floater = this.floaters[i];
      floater.life -= dt;
      floater.y -= 28 * dt;
      if (floater.life <= 0) this.floaters.splice(i, 1);
    }
  }

  private emitHud(force = false): void {
    const progress = clamp(this.travelled / Math.max(1, this.targetPx), 0, 1);
    const distance = Math.min(
      this.level.lengthMeters,
      Math.round(this.travelled / Math.max(1, this.distanceUnit)),
    );
    const key = `${this.phase}|${this.hearts}|${this.starsCollected}|${distance}|${progress.toFixed(3)}`;
    if (!force && key === this.lastHudKey) return;
    this.lastHudKey = key;
    this.callbacks.onHud({
      progress,
      hearts: this.hearts,
      stars: this.starsCollected,
      distance,
      phase: this.phase,
    });
  }

  private draw(): void {
    const { ctx, width, height } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    let shakeX = 0;
    let shakeY = 0;
    if (this.time < this.shakeUntil) {
      const remain = (this.shakeUntil - this.time) / 0.4;
      const amount = this.shakeStrength * remain;
      shakeX = Math.sin(this.time * 82) * amount;
      shakeY = Math.cos(this.time * 73) * amount * 0.65;
    }

    ctx.save();
    ctx.translate(shakeX, shakeY);
    this.scene.draw(ctx, this.scroll, this.time, this.reducedMotion);

    // Ground shadow.
    const altitude = clamp(
      1 - this.parrot.y / Math.max(1, this.playableHeight),
      0.05,
      0.95,
    );
    ctx.save();
    ctx.globalAlpha = 0.07 + (1 - altitude) * 0.12;
    ctx.fillStyle = this.level.palette.ink;
    ctx.beginPath();
    ctx.ellipse(
      this.parrot.x,
      this.playableHeight + 9 * this.scale,
      (12 + altitude * 9) * this.scale,
      4.4 * this.scale,
      0,
      0,
      TAU,
    );
    ctx.fill();
    ctx.restore();

    for (const obstacle of this.obstacles) {
      drawObstaclePair(
        ctx,
        this.level,
        {
          x: obstacle.x,
          width: obstacle.width,
          gapTop: obstacle.gapCenter - obstacle.gap / 2,
          gapBottom: obstacle.gapCenter + obstacle.gap / 2,
          groundY: this.playableHeight,
        },
        this.scale,
        this.time,
        this.reducedMotion,
      );
    }

    for (const star of this.collectibles) {
      const bob = Math.sin(this.time * 3 + star.phase) * 3 * this.scale;
      drawCollectibleStar(
        ctx,
        this.level,
        star.x,
        star.y + bob,
        12.5 * this.scale,
        this.time * 1.1 + star.phase,
        this.time,
        this.reducedMotion,
      );
    }

    this.drawParrotFrame();
    drawParticles(ctx, this.particles, this.reducedMotion);
    drawFloatingText(ctx, this.floaters);
    ctx.restore();

    if (this.vignette) {
      ctx.fillStyle = this.vignette;
      ctx.fillRect(0, 0, width, height);
    }

    if (this.time < this.flashUntil) {
      const alpha = ((this.flashUntil - this.time) / 0.28) * 0.16;
      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle = '#e95c57';
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    // A soft painted edge keeps the play area feeling like a framed artwork.
    ctx.save();
    ctx.strokeStyle = 'rgba(255,241,201,0.28)';
    ctx.lineWidth = Math.max(1, this.scale);
    ctx.strokeRect(4 * this.scale, 4 * this.scale, width - 8 * this.scale, height - 8 * this.scale);
    ctx.restore();
  }

  private drawParrotFrame(): void {
    const { ctx } = this;
    const isInvulnerable = this.time < this.invulnerableUntil;
    const flicker = isInvulnerable && Math.floor(this.time * 11) % 2 === 0;
    const blink = this.time < this.blinkUntil;
    const size = 42 * this.scale;

    ctx.save();
    if (isInvulnerable && this.phase === 'playing') {
      ctx.globalAlpha = 0.45;
      ctx.strokeStyle = 'rgba(255,244,201,0.9)';
      ctx.lineWidth = 1.6 * this.scale;
      ctx.setLineDash([5 * this.scale, 5 * this.scale]);
      ctx.beginPath();
      ctx.arc(this.parrot.x, this.parrot.y, 27 * this.scale, this.time * 2, this.time * 2 + TAU);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }

    drawParrot(ctx, {
      x: this.parrot.x,
      y: this.parrot.y,
      size,
      angle: this.parrot.angle,
      wingAngle: this.wingAngle,
      blink,
      alpha: this.phase === 'defeat' || flicker ? 0.65 : 1,
    });

    // Jetpack-style exhaust flame while Uraan climbs.
    if (this.phase === 'playing') {
      drawFlame(
        ctx,
        this.parrot.x - 26 * this.scale,
        this.parrot.y - 8 * this.scale,
        16 * this.scale,
        this.wingAngle * 0.5,
        this.wingEnergy,
      );
    }
    ctx.restore();
  }
}
