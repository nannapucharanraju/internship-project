// Physics core for a charged particle in a uniform magnetic field (B along z).
// Uses the exact closed-form solution of the Lorentz force equation,
// so there is no numerical integration drift — the radius stays exact
// no matter how long the sim runs or how large the timestep is.

const Q_UNIT = 1; // charge is expressed in multiples of this unit

export function computeCyclotronParams({ charge, mass, Bz }) {
  const omega = (charge * Q_UNIT * Bz) / mass; // signed cyclotron angular frequency (rad/s)
  return { omega };
}

export function computeRadius({ charge, mass, Bz, speed }) {
  if (charge === 0 || Bz === 0) return Infinity; // no curving, straight line
  return (mass * speed) / (Math.abs(charge) * Q_UNIT * Math.abs(Bz));
}

export function computePeriod({ charge, mass, Bz }) {
  if (charge === 0 || Bz === 0) return Infinity;
  return (2 * Math.PI * mass) / (Math.abs(charge) * Q_UNIT * Math.abs(Bz));
}

// Exact position/velocity at time t, given initial conditions.
// Handles the omega -> 0 edge case (zero charge or zero field) as a
// straight line, avoiding a division-by-zero in the closed-form solution.
export function stateAtTime({ x0, y0, vx0, vy0, charge, mass, Bz, t }) {
  const { omega } = computeCyclotronParams({ charge, mass, Bz });

  if (Math.abs(omega) < 1e-9) {
    return { x: x0 + vx0 * t, y: y0 + vy0 * t, vx: vx0, vy: vy0 };
  }

  const cos = Math.cos(omega * t);
  const sin = Math.sin(omega * t);

  const vx = vx0 * cos + vy0 * sin;
  const vy = -vx0 * sin + vy0 * cos;

  const x = x0 + (vx0 * sin + vy0 * (1 - cos)) / omega;
  const y = y0 + (vx0 * (cos - 1) + vy0 * sin) / omega;

  return { x, y, vx, vy };
}

export const CANVAS_SCALE = 20; // pixels per simulation unit