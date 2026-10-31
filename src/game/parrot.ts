export interface ParrotDrawOptions {
  x: number;
  y: number;
  size: number;
  angle: number;
  wingAngle: number;
  blink: boolean;
  alpha?: number;
}

/**
 * A small, hand-drawn canvas parrot. The drawing is built from vector shapes
 * so it stays crisp on high-density screens and needs no image assets.
 */
export function drawParrot(ctx: CanvasRenderingContext2D, options: ParrotDrawOptions): void {
  const { x, y, size, angle, wingAngle, blink } = options;
  const k = size / 40;
  if (k <= 0) return;

  ctx.save();
  ctx.globalAlpha = options.alpha ?? 1;
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(k, k);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const ink = '#18342d';
  const outline = 2.1;

  // ---- Tail feathers -------------------------------------------------
  const tail = ctx.createLinearGradient(-40, 0, -12, 15);
  tail.addColorStop(0, '#1c8c57');
  tail.addColorStop(0.6, '#39b96a');
  tail.addColorStop(1, '#d5e36b');
  ctx.fillStyle = tail;
  ctx.strokeStyle = ink;
  ctx.lineWidth = outline;
  ctx.beginPath();
  ctx.moveTo(-14, 1);
  ctx.quadraticCurveTo(-30, -5, -43, 1);
  ctx.quadraticCurveTo(-34, 5, -22, 7);
  ctx.quadraticCurveTo(-28, 13, -39, 20);
  ctx.quadraticCurveTo(-24, 18, -12, 9);
  ctx.quadraticCurveTo(-18, 18, -26, 26);
  ctx.quadraticCurveTo(-14, 22, -3, 13);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Painted stripe on the longest feather.
  ctx.strokeStyle = '#f6c34e';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-34, 4);
  ctx.quadraticCurveTo(-27, 5, -21, 7);
  ctx.stroke();
  ctx.fillStyle = '#e45772';
  ctx.beginPath();
  ctx.ellipse(-33, 13, 2.4, 1.5, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // ---- Far wing ------------------------------------------------------
  ctx.fillStyle = '#1d6d4a';
  ctx.strokeStyle = ink;
  ctx.lineWidth = outline;
  ctx.beginPath();
  ctx.moveTo(-8, -1);
  ctx.quadraticCurveTo(-25, 2, -27, 13);
  ctx.quadraticCurveTo(-22, 21, -6, 15);
  ctx.quadraticCurveTo(2, 9, 6, 1);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // ---- Body ----------------------------------------------------------
  const bodyGradient = ctx.createLinearGradient(-16, -12, 15, 18);
  bodyGradient.addColorStop(0, '#6fd05f');
  bodyGradient.addColorStop(0.45, '#3fb65f');
  bodyGradient.addColorStop(1, '#1c8a52');
  ctx.fillStyle = bodyGradient;
  ctx.strokeStyle = ink;
  ctx.lineWidth = outline + 0.4;
  ctx.beginPath();
  ctx.ellipse(0, 4, 18, 15.5, -0.13, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Golden belly panel and pattern.
  const belly = ctx.createLinearGradient(0, 2, 4, 20);
  belly.addColorStop(0, '#f0e579');
  belly.addColorStop(1, '#cfd34e');
  ctx.fillStyle = belly;
  ctx.beginPath();
  ctx.ellipse(3, 9, 10.5, 8.4, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(34,72,50,0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = '#e45772';
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.arc(-1 + i * 4.2, 13.5 - i * 1.2, 1.1, 0, Math.PI * 2);
    ctx.fill();
  }

  // ---- Head ----------------------------------------------------------
  const headGradient = ctx.createRadialGradient(8, -20, 2, 11, -11, 18);
  headGradient.addColorStop(0, '#86dd69');
  headGradient.addColorStop(0.7, '#42b95e');
  headGradient.addColorStop(1, '#279a56');
  ctx.fillStyle = headGradient;
  ctx.strokeStyle = ink;
  ctx.lineWidth = outline + 0.3;
  ctx.beginPath();
  ctx.arc(11, -11, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Golden cheek curl.
  ctx.strokeStyle = '#f6c34e';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(15, -6, 5.2, 0.4, 2.2);
  ctx.stroke();
  ctx.fillStyle = '#f1a46d';
  ctx.globalAlpha = 0.55;
  ctx.beginPath();
  ctx.ellipse(14, -5, 4.6, 2.7, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // ---- Crest ---------------------------------------------------------
  const crestColors = ['#e45772', '#f6c34e', '#3abd64'];
  for (let i = 0; i < 3; i += 1) {
    ctx.save();
    ctx.translate(11 + i * 1.2, -23);
    ctx.rotate(-0.45 + i * 0.32);
    ctx.fillStyle = crestColors[i];
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 3);
    ctx.bezierCurveTo(-4, -5, 3 - i, -9, 4 - i, -13);
    ctx.bezierCurveTo(8 - i, -7, 5 - i, -1, 3, 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // ---- Beak ----------------------------------------------------------
  ctx.fillStyle = '#f7a63f';
  ctx.strokeStyle = ink;
  ctx.lineWidth = outline * 0.85;
  ctx.beginPath();
  ctx.moveTo(22, -12);
  ctx.quadraticCurveTo(33, -12, 31, -6);
  ctx.quadraticCurveTo(29, -1, 21, -4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#e68432';
  ctx.beginPath();
  ctx.moveTo(22, -5);
  ctx.quadraticCurveTo(28, -1, 25, 2);
  ctx.quadraticCurveTo(21, 0, 20, -3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,241,176,0.7)';
  ctx.beginPath();
  ctx.ellipse(26, -9, 3, 1.4, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // ---- Eye -----------------------------------------------------------
  if (blink) {
    ctx.strokeStyle = ink;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(17, -15, 4.2, 0.15, Math.PI - 0.15);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#fff9ea';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(17, -15.5, 4.6, 5.2, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#22342f';
    ctx.beginPath();
    ctx.arc(18.4, -15.2, 2.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(19.3, -16.4, 1, 0, Math.PI * 2);
    ctx.fill();
    // Tiny gold eyeliner for the truck-art spirit.
    ctx.strokeStyle = '#f6c34e';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(17, -15.5, 5.9, -2.5, -0.4);
    ctx.stroke();
  }

  // ---- Feet ----------------------------------------------------------
  ctx.strokeStyle = ink;
  ctx.lineWidth = 2.4;
  ctx.strokeStyle = '#e88538';
  ctx.beginPath();
  ctx.moveTo(2, 18);
  ctx.lineTo(2, 22);
  ctx.lineTo(-2, 24);
  ctx.moveTo(2, 22);
  ctx.lineTo(6, 24);
  ctx.moveTo(8, 17);
  ctx.lineTo(8, 21);
  ctx.lineTo(5, 23);
  ctx.moveTo(8, 21);
  ctx.lineTo(11, 23);
  ctx.stroke();

  // ---- Near wing (animated) -----------------------------------------
  ctx.save();
  ctx.translate(-3, -1);
  ctx.rotate(wingAngle);
  const wingGradient = ctx.createLinearGradient(-18, 1, 6, 20);
  wingGradient.addColorStop(0, '#65cc5b');
  wingGradient.addColorStop(0.55, '#31a75b');
  wingGradient.addColorStop(1, '#1c7d4d');
  ctx.fillStyle = wingGradient;
  ctx.strokeStyle = ink;
  ctx.lineWidth = outline;
  ctx.beginPath();
  ctx.moveTo(3, 2);
  ctx.bezierCurveTo(-10, 2, -22, 7, -20, 15);
  ctx.bezierCurveTo(-19, 22, -8, 22, -2, 18);
  ctx.bezierCurveTo(3, 14, 5, 8, 3, 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Wing feather grooves.
  ctx.strokeStyle = '#165f40';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.moveTo(-2 + i * 2, 5 + i * 3);
    ctx.quadraticCurveTo(-10 - i * 2, 10 + i * 1.5, -14 - i, 16 + i * 0.8);
    ctx.stroke();
  }
  // Truck-art flower on the wing.
  ctx.fillStyle = '#e45772';
  for (let i = 0; i < 5; i += 1) {
    const a = (i / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(-7 + Math.cos(a) * 3, 9 + Math.sin(a) * 3, 2.4, 1.7, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#f6c34e';
  ctx.beginPath();
  ctx.arc(-7, 9, 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f6c34e';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(-7, 9, 6.3, 0.2, 2.4);
  ctx.stroke();
  ctx.restore();

  // A few tiny gold sparkles around the wingtip.
  ctx.fillStyle = '#f7d166';
  ctx.beginPath();
  ctx.arc(14, 4, 1.1, 0, Math.PI * 2);
  ctx.arc(-13, -18, 0.9, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
