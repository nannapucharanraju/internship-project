import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { stateAtTime, computePeriod } from '../physics/cyclotronPhysics';

export default function VelocityGraph({ params }) {
  const data = useMemo(() => {
    const period = computePeriod(params);
    const span = Number.isFinite(period) ? period * 1.5 : 5;
    const steps = 100;
    const angleRad = (params.angleDeg * Math.PI) / 180;
    const vx0 = params.speed * Math.cos(angleRad);
    const vy0 = params.speed * Math.sin(angleRad);

    return Array.from({ length: steps + 1 }, (_, i) => {
      const t = (span * i) / steps;
      const s = stateAtTime({ x0: 0, y0: 0, vx0, vy0, charge: params.charge, mass: params.mass, Bz: params.Bz, t });
      return { t: t.toFixed(2), vx: s.vx, vy: s.vy };
    });
  }, [params]);

  return (
    <div className="velocity-graph">
      <div className="panel-title">
        <div>
          <span className="section-kicker">Speed graph</span>
          <h2>Motion in x and y directions</h2>
        </div>
      </div>
      <p className="graph-caption">The particle has motion in both x and y directions. Together, they make the circular path.</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 12, right: 14, bottom: 12, left: -18 }}>
          <CartesianGrid strokeDasharray="4 8" stroke="rgba(137, 160, 190, 0.18)" vertical={false} />
          <XAxis
            dataKey="t"
            tick={{ fontSize: 10, fill: '#8fa4b8' }}
            axisLine={{ stroke: 'rgba(137, 160, 190, 0.22)' }}
            tickLine={false}
            interval={9}
          />
          <YAxis tick={{ fontSize: 10, fill: '#8fa4b8' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: 'rgba(9, 19, 31, 0.92)',
              border: '1px solid rgba(98, 188, 255, 0.24)',
              borderRadius: 8,
              color: '#ecf7ff',
            }}
          />
          <Legend iconType="circle" wrapperStyle={{ color: '#b9c9d8', fontSize: 12 }} />
          <Line type="monotone" dataKey="vx" stroke="#55d5ff" strokeWidth={3} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="vy" stroke="#ff7a90" strokeWidth={3} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
