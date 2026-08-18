import { computeRadius, computePeriod, computeCyclotronParams } from '../physics/cyclotronPhysics';

export default function ReadoutPanel({ params }) {
  const radius = computeRadius(params);
  const period = computePeriod(params);
  const { omega } = computeCyclotronParams(params);

  const fmt = (v) => (Number.isFinite(v) ? v.toFixed(2) : '∞ (straight line)');

  return (
    <div className="readout-panel">
      <div className="panel-title">
        <div>
          <span className="section-kicker">Values</span>
          <h2>What is happening?</h2>
        </div>
      </div>
      <div className="readout-grid">
        <div className="readout-row">
          <span>Circle size</span>
          <strong>{fmt(radius)}</strong>
          <small>r = mv / |q|B</small>
        </div>
        <div className="readout-row">
          <span>Time for one round</span>
          <strong>{fmt(period)}</strong>
          <small>T = 2πm / |q|B</small>
        </div>
        <div className="readout-row">
          <span>Turning rate</span>
          <strong>{fmt(omega)} rad/s</strong>
          <small>ω = qB / m</small>
        </div>
      </div>
    </div>
  );
}
