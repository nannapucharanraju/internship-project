import { useMemo } from 'react';
import { computeRadius, computePeriod } from '../physics/cyclotronPhysics';

const BASELINE = { charge: 1, mass: 1, speed: 4, Bz: 1 };

export default function LiveInsightPanel({ params }) {
  const insight = useMemo(() => buildInsight(params), [params]);

  return (
    <section className="insight-panel">
      <div className="panel-title">
        <div>
          <span className="section-kicker">Live explanation</span>
          <h2>Simple explanation</h2>
        </div>
      </div>

      <div className="insight-hero">
        <span>{insight.badge}</span>
        <strong>{insight.headline}</strong>
        <p>{insight.summary}</p>
      </div>

      <div className="insight-grid">
        {insight.points.map((point) => (
          <article className="insight-card" key={point.title}>
            <span>{point.title}</span>
            <strong>{point.value}</strong>
            <p>{point.reason}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function buildInsight(params) {
  const radius = computeRadius(params);
  const period = computePeriod(params);
  const chargeStrength = Math.abs(params.charge);
  const fieldStrength = Math.abs(params.Bz);
  const noForce = chargeStrength < 1e-6 || fieldStrength < 1e-6 || params.speed < 1e-6;
  const dominant = strongestChange(params);

  if (noForce) {
    return {
      badge: 'Straight path',
      headline: 'The particle is going straight.',
      summary: 'To bend the path, we need charge, motion, and magnetic field. If any one is zero, there is no magnetic force.',
      points: [
        {
          title: 'Path',
          value: 'Straight',
          reason: 'No sideways push is acting on it.',
        },
        {
          title: 'Force',
          value: 'Zero',
          reason: 'Increase charge, speed, or magnetic field to see bending again.',
        },
        {
          title: 'Magnetic field',
          value: params.Bz >= 0 ? 'Out of page' : 'Into page',
          reason: 'Dots mean coming out. Crosses mean going in.',
        },
      ],
    };
  }

  return {
    badge: dominant.badge,
    headline: dominant.headline,
    summary: dominant.summary,
    points: [
      {
        title: 'Circle size',
        value: radius.toFixed(2),
        reason: radiusReason(params),
      },
      {
        title: 'Time for one round',
        value: `${period.toFixed(2)} s per turn`,
        reason: 'More charge or stronger field makes it rotate faster. More mass makes it slower.',
      },
      {
        title: 'Direction',
        value: params.charge * params.Bz >= 0 ? 'Clockwise' : 'Anticlockwise',
        reason: 'Changing charge sign or field direction flips the curve.',
      },
    ],
  };
}

function strongestChange(params) {
  const changes = [
    {
      key: 'mass',
      amount: Math.abs(params.mass - BASELINE.mass) / BASELINE.mass,
      badge: 'Mass',
      headline: params.mass >= BASELINE.mass ? 'More mass makes the orbit wider.' : 'Less mass makes the orbit tighter.',
      summary: 'A heavier particle is harder to turn, so it bends less.',
    },
    {
      key: 'speed',
      amount: Math.abs(params.speed - BASELINE.speed) / BASELINE.speed,
      badge: 'Speed',
      headline: params.speed >= BASELINE.speed ? 'More speed makes the orbit wider.' : 'Less speed makes the orbit tighter.',
      summary: 'A faster particle moves farther before it turns, so the circle becomes bigger.',
    },
    {
      key: 'charge',
      amount: Math.abs(Math.abs(params.charge) - BASELINE.charge) / BASELINE.charge + (params.charge < 0 ? 0.35 : 0),
      badge: 'Charge',
      headline: params.charge < 0 ? 'Negative charge bends the other way.' : 'More charge bends the path more.',
      summary: 'More charge means more magnetic force. Negative charge reverses the direction.',
    },
    {
      key: 'Bz',
      amount: Math.abs(Math.abs(params.Bz) - BASELINE.Bz) / BASELINE.Bz + (params.Bz < 0 ? 0.35 : 0),
      badge: 'Magnetic field',
      headline: params.Bz < 0 ? 'Reversing B bends the path the other way.' : 'Stronger magnetic field makes a smaller circle.',
      summary: 'A stronger magnetic field gives a stronger sideways push.',
    },
  ];

  return changes.sort((a, b) => b.amount - a.amount)[0];
}

function radiusReason(params) {
  const pieces = [];
  if (params.mass > BASELINE.mass) pieces.push('more mass makes it bigger');
  if (params.mass < BASELINE.mass) pieces.push('less mass makes it smaller');
  if (params.speed > BASELINE.speed) pieces.push('more speed makes it bigger');
  if (params.speed < BASELINE.speed) pieces.push('less speed makes it smaller');
  if (Math.abs(params.charge) > BASELINE.charge) pieces.push('more charge makes it smaller');
  if (Math.abs(params.charge) < BASELINE.charge) pieces.push('less charge makes it bigger');
  if (Math.abs(params.Bz) > BASELINE.Bz) pieces.push('stronger field makes it smaller');
  if (Math.abs(params.Bz) < BASELINE.Bz) pieces.push('weaker field makes it bigger');

  return pieces.length ? `Because ${pieces.slice(0, 2).join(' and ')}.` : 'This is the normal starting circle.';
}
