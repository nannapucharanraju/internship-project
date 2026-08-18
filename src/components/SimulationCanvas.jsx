import { useRef, useEffect } from 'react';
import { stateAtTime, CANVAS_SCALE } from '../physics/cyclotronPhysics';

const TRAIL_LENGTH = 400;

export default function SimulationCanvas({ params, compareMode, showForce = true }) {
  const canvasRef = useRef(null);
  const trailsRef = useRef({ main: [], compare: [] });
  const animRef = useRef(null);

  useEffect(() => {
    trailsRef.current = { main: [], compare: [] };
  }, [params.charge, params.mass, params.Bz, params.speed, params.angleDeg, compareMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // make canvas responsive and high-DPI
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const ctx = canvas.getContext('2d');
    const start = performance.now();

    function frame(now) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // use CSS pixel dimensions for layout calculations
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const cx = width / 2;
      const cy = height / 2;
      const dt = (now - start) / 1000;

      // clear and set transform for crisp high-DPI rendering
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      drawChamber(ctx, width, height, params.Bz);

      const angleRad = (params.angleDeg * Math.PI) / 180;
      const vx0 = params.speed * Math.cos(angleRad);
      const vy0 = params.speed * Math.sin(angleRad);

      const main = stateAtTime({
        x0: 0, y0: 0, vx0, vy0,
        charge: params.charge, mass: params.mass, Bz: params.Bz, t: dt,
      });

      pushTrail(trailsRef.current.main, main, TRAIL_LENGTH);
      drawTrail(ctx, trailsRef.current.main, cx, cy, '#55d5ff');
      drawParticle(ctx, main, cx, cy, '#55d5ff', params.charge);
      drawVelocityArrow(ctx, main, cx, cy, '#9be7ff');
      if (showForce) drawForceArrow(ctx, main, cx, cy, params, '#f4c45f');

      if (compareMode) {
        const compare = stateAtTime({
          x0: 0, y0: 0, vx0, vy0,
          charge: -params.charge, mass: params.mass, Bz: params.Bz, t: dt,
        });
        pushTrail(trailsRef.current.compare, compare, TRAIL_LENGTH);
        drawTrail(ctx, trailsRef.current.compare, cx, cy, '#ff7a90');
        drawParticle(ctx, compare, cx, cy, '#ff7a90', -params.charge);
      }

      animRef.current = requestAnimationFrame(frame);
    }

    animRef.current = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, [params, compareMode, showForce]);

  return <canvas ref={canvasRef} width={640} height={480} className="sim-canvas" />;
}

function pushTrail(trail, state, maxLen) {
  trail.push({ x: state.x, y: state.y });
  if (trail.length > maxLen) trail.shift();
}

function drawTrail(ctx, trail, cx, cy, color) {
  if (trail.length < 2) return;
  trail.forEach((p, i) => {
    if (i === 0) return;
    const prev = trail[i - 1];
    const age = i / trail.length;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.08 + age * 0.82;
    ctx.lineWidth = 1 + age * 3.2;
    ctx.moveTo(cx + prev.x * CANVAS_SCALE, cy - prev.y * CANVAS_SCALE);
    ctx.lineTo(cx + p.x * CANVAS_SCALE, cy - p.y * CANVAS_SCALE);
    ctx.stroke();
  });
  ctx.globalAlpha = 1;
}

function drawParticle(ctx, state, cx, cy, color, charge) {
  const px = cx + state.x * CANVAS_SCALE;
  const py = cy - state.y * CANVAS_SCALE;
  const glow = ctx.createRadialGradient(px, py, 2, px, py, 24);
  glow.addColorStop(0, color);
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(px, py, 24, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(px, py, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)';
  ctx.stroke();

  ctx.fillStyle = '#03111a';
  ctx.font = 'bold 12px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(charge >= 0 ? '+' : '-', px, py + 1);
}

function drawVelocityArrow(ctx, state, cx, cy, color) {
  const px = cx + state.x * CANVAS_SCALE;
  const py = cy - state.y * CANVAS_SCALE;
  const scale = 6;
  const ex = px + state.vx * scale;
  const ey = py - state.vy * scale;

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.moveTo(px, py);
  ctx.lineTo(ex, ey);
  ctx.stroke();
  ctx.shadowBlur = 0;

  const angle = Math.atan2(ey - py, ex - px);
  ctx.beginPath();
  ctx.moveTo(ex, ey);
  ctx.lineTo(ex - 8 * Math.cos(angle - 0.4), ey - 8 * Math.sin(angle - 0.4));
  ctx.lineTo(ex - 8 * Math.cos(angle + 0.4), ey - 8 * Math.sin(angle + 0.4));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawForceArrow(ctx, state, cx, cy, params, color) {
  const magnitude = Math.abs(params.charge * params.Bz * params.speed);
  if (magnitude < 1e-6) return;

  const px = cx + state.x * CANVAS_SCALE;
  const py = cy - state.y * CANVAS_SCALE;
  const fx = params.charge * params.Bz * state.vy;
  const fy = -params.charge * params.Bz * state.vx;
  const length = 42;
  const norm = Math.hypot(fx, fy) || 1;
  const ex = px + (fx / norm) * length;
  const ey = py - (fy / norm) * length;

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.moveTo(px, py);
  ctx.lineTo(ex, ey);
  ctx.stroke();
  ctx.shadowBlur = 0;

  const angle = Math.atan2(ey - py, ex - px);
  ctx.beginPath();
  ctx.moveTo(ex, ey);
  ctx.lineTo(ex - 10 * Math.cos(angle - 0.42), ey - 10 * Math.sin(angle - 0.42));
  ctx.lineTo(ex - 10 * Math.cos(angle + 0.42), ey - 10 * Math.sin(angle + 0.42));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  ctx.fillStyle = 'rgba(244, 196, 95, 0.95)';
  ctx.font = 'bold 12px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('F', ex + 12 * Math.cos(angle), ey + 12 * Math.sin(angle));
}

function drawChamber(ctx, width, height, Bz) {
  const gradient = ctx.createRadialGradient(width * 0.5, height * 0.48, 20, width * 0.5, height * 0.5, width * 0.72);
  gradient.addColorStop(0, '#112a3d');
  gradient.addColorStop(0.56, '#071521');
  gradient.addColorStop(1, '#03070d');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  for (let r = 64; r < Math.max(width, height); r += 64) {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(85, 213, 255, ${0.18 - Math.min(r / 900, 0.12)})`;
    ctx.lineWidth = 1;
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  ctx.strokeStyle = 'rgba(137, 160, 190, 0.13)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= width; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 128, -0.88, 0.88);
  ctx.arc(0, 0, 128, Math.PI - 0.88, Math.PI + 0.88);
  ctx.stroke();
  ctx.fillStyle = 'rgba(85, 213, 255, 0.08)';
  ctx.fillRect(-12, -142, 24, 284);
  ctx.restore();

  drawFieldIndicator(ctx, width, height, Bz);
}

function drawFieldIndicator(ctx, width, height, Bz) {
  const spacing = 48;
  ctx.fillStyle = Bz >= 0 ? 'rgba(149, 232, 255, 0.58)' : 'rgba(255, 173, 188, 0.58)';
  ctx.strokeStyle = ctx.fillStyle;
  for (let x = spacing / 2; x < width; x += spacing) {
    for (let y = spacing / 2; y < height; y += spacing) {
      if (Bz > 0) {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.globalAlpha = 0.16;
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      } else if (Bz < 0) {
        ctx.beginPath();
        ctx.moveTo(x - 5, y - 5);
        ctx.lineTo(x + 5, y + 5);
        ctx.moveTo(x + 5, y - 5);
        ctx.lineTo(x - 5, y + 5);
        ctx.stroke();
      }
    }
  }
}
