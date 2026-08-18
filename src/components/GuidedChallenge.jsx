import { useMemo, useState } from 'react';

const OPTIONS = [
  { id: 'up', label: 'Up' },
  { id: 'right', label: 'Right' },
  { id: 'down', label: 'Down' },
  { id: 'left', label: 'Left' },
];

export default function GuidedChallenge({ params, showForce, setShowForce }) {
  const [selected, setSelected] = useState(null);
  const answer = useMemo(() => getForceDirection(params), [params]);
  const isCorrect = selected === answer.id;
  const canPredict = answer.id !== 'none';

  function choose(option) {
    setSelected(option);
    setShowForce(false);
  }

  function reveal() {
    setShowForce(true);
  }

  function reset() {
    setSelected(null);
    setShowForce(false);
  }

  return (
    <section className="guided-panel">
      <div className="panel-title">
        <div>
          <span className="section-kicker">Guided mode</span>
          <h2>Try it yourself</h2>
        </div>
        <button type="button" className="ghost-button" onClick={reset}>Try again</button>
      </div>

      <div className="lesson-steps">
        <div className="lesson-step active">
          <strong>1</strong>
          <span>Blue arrow shows where the particle is moving.</span>
        </div>
        <div className="lesson-step active">
          <strong>2</strong>
          <span>Dots mean magnetic field comes out. Crosses mean it goes in.</span>
        </div>
        <div className={`lesson-step ${selected ? 'active' : ''}`}>
          <strong>3</strong>
          <span>Guess where the yellow force arrow will point.</span>
        </div>
      </div>

      <div className="prediction-box">
        <p>Which way will the force act first?</p>
        <div className="prediction-options">
          {OPTIONS.map((option) => (
            <button
              type="button"
              key={option.id}
              className={`direction-button ${selected === option.id ? 'selected' : ''} ${
                showForce && selected === option.id ? (isCorrect ? 'correct' : 'wrong') : ''
              }`}
              onClick={() => choose(option.id)}
              disabled={!canPredict}
            >
              {option.label}
            </button>
          ))}
        </div>
        <button type="button" className="reveal-button" onClick={reveal} disabled={!selected && canPredict}>
          Show answer
        </button>
      </div>

      <div className={`feedback-card ${showForce && selected ? (isCorrect ? 'success' : 'error') : ''}`}>
        {!canPredict && 'No force now. If charge, speed, or magnetic field is zero, the particle goes straight.'}
        {canPredict && !selected && 'Choose one direction, then click Show answer.'}
        {canPredict && selected && !showForce && 'Good. Now click Show answer and compare your guess.'}
        {canPredict && selected && showForce && isCorrect && `Correct. The force points ${answer.label} first.`}
        {canPredict && selected && showForce && !isCorrect && `Not this time. The force points ${answer.label} first. For a negative charge, the direction reverses.`}
      </div>
    </section>
  );
}

function getForceDirection({ charge, Bz, speed, angleDeg }) {
  if (Math.abs(charge * Bz * speed) < 1e-6) return { id: 'none', label: 'nowhere' };

  const angle = (angleDeg * Math.PI) / 180;
  const vx = speed * Math.cos(angle);
  const vy = speed * Math.sin(angle);
  const fx = charge * Bz * vy;
  const fy = -charge * Bz * vx;

  if (Math.abs(fx) > Math.abs(fy)) {
    return fx > 0 ? { id: 'right', label: 'right' } : { id: 'left', label: 'left' };
  }

  return fy > 0 ? { id: 'up', label: 'up' } : { id: 'down', label: 'down' };
}
