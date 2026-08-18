const RAD = Math.PI / 180;

export default function ThumbRulePanel({ params }) {
  const angle = params.angleDeg * RAD;
  const vx = Math.cos(angle);
  const vy = Math.sin(angle);
  const forceX = params.charge * params.Bz * vy;
  const forceY = -params.charge * params.Bz * vx;
  const forceAngle = Math.atan2(-forceY, forceX) / RAD;
  const velocityAngle = Math.atan2(-vy, vx) / RAD;
  const isStraight = Math.abs(params.charge * params.Bz * params.speed) < 1e-6;
  const fieldLabel = params.Bz >= 0 ? 'Out of page' : 'Into page';
  const chargeLabel = params.charge >= 0 ? 'positive charge' : 'negative charge';

  return (
    <div className="thumb-panel">
      <div className="panel-title">
        <div>
          <span className="section-kicker">Hand rule</span>
          <h2>How to find force direction</h2>
        </div>
      </div>

      <div className="rule-stage" aria-label="Animated right-hand rule diagram">
        <div className="field-plane">
          {Array.from({ length: 16 }, (_, i) => (
            <span key={i}>{params.Bz >= 0 ? '•' : '×'}</span>
          ))}
        </div>

        <div className="rule-center">
          <div className="orbit-ring" />
          <div className="hand-orbit">
            <div className="hand-palm" />
            <div className="hand-finger index" />
            <div className="hand-finger middle" />
            <div className="hand-thumb" />
          </div>
          <Arrow className="velocity-vector" angle={velocityAngle} label="v" />
          {!isStraight && <Arrow className="force-vector" angle={forceAngle} label="F" />}
          <div className="field-badge">{params.Bz >= 0 ? 'B •' : 'B ×'}</div>
        </div>
      </div>

      <div className="rule-legend">
        <span><i className="dot cyan" /> Fingers show motion</span>
        <span><i className="dot blue" /> Curl toward B</span>
        <span><i className="dot gold" /> Thumb shows force</span>
      </div>

      <p className="rule-note">
        For a {chargeLabel}, the yellow arrow shows the force. B is {fieldLabel.toLowerCase()}.
      </p>
    </div>
  );
}

function Arrow({ className, angle, label }) {
  return (
    <div className={`rule-arrow ${className}`} style={{ transform: `rotate(${angle}deg)` }}>
      <span>{label}</span>
    </div>
  );
}
