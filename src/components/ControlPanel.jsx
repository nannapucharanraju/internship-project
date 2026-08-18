const CONTROLS = [
  { key: 'charge', label: 'Charge', unit: 'e', min: -2, max: 2, step: 0.1 },
  { key: 'mass', label: 'Mass', unit: 'u', min: 0.5, max: 5, step: 0.1 },
  { key: 'speed', label: 'Speed', unit: '', min: 0, max: 10, step: 0.1 },
  { key: 'angleDeg', label: 'Starting angle', unit: 'deg', min: 0, max: 360, step: 1 },
  { key: 'Bz', label: 'Magnetic field', unit: 'T', min: -3, max: 3, step: 0.1 },
];

export default function ControlPanel({ params, setParams, compareMode, setCompareMode, onReset }) {
  const update = (key) => (e) => {
    setParams((p) => ({ ...p, [key]: parseFloat(e.target.value) }));
  };

  return (
    <div className="control-panel">
      <div className="panel-title">
        <div>
          <span className="section-kicker">Try changing</span>
          <h2>Sliders</h2>
        </div>
        <button type="button" className="ghost-button" onClick={onReset} aria-label="Reset">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M12 6v2a6 6 0 1 1-5 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 4v4h-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ marginLeft: 8 }}>Reset</span>
        </button>
      </div>

      <div className="control-stack">
        {CONTROLS.map((control) => {
          const value = params[control.key];
          const percent = ((value - control.min) / (control.max - control.min)) * 100;
          const display = control.key === 'angleDeg' ? value.toFixed(0) : value.toFixed(1);
          const suffix = control.unit === 'deg' ? 'deg' : control.unit;

          return (
            <label className="slider-control" key={control.key}>
              <span className="slider-label">
                <span>{control.label}</span>
                <strong>{display}{suffix ? ` ${suffix}` : ''}</strong>
              </span>
              <input
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={value}
                onChange={update(control.key)}
                style={{ '--value': `${percent}%` }}
              />
            </label>
          );
        })}
      </div>

      <label className="toggle-row">
        <input type="checkbox" checked={compareMode} onChange={(e) => setCompareMode(e.target.checked)} />
        <span className="toggle-track" />
        <span>
          <strong>Show opposite charge</strong>
          <small>See how positive and negative charges bend differently.</small>
        </span>
      </label>

      {/* light theme toggle removed per request */}
    </div>
  );
}
