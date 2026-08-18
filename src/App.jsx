import { useState } from 'react';
import SimulationCanvas from './components/SimulationCanvas';
import ControlPanel from './components/ControlPanel';
import ConceptNotes from './components/ConceptNotes';
import ConceptFaq from './components/ConceptFaq';
import GuidedChallenge from './components/GuidedChallenge';
import LiveInsightPanel from './components/LiveInsightPanel';
import ReadoutPanel from './components/ReadoutPanel';
import QuickRules from './components/QuickRules';
import ThumbRulePanel from './components/ThumbRulePanel';
import VelocityGraph from './components/VelocityGraph';
import './App.css';

const DEFAULT_PARAMS = { charge: 1, mass: 1, speed: 4, angleDeg: 0, Bz: 1 };

export default function App() {
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [compareMode, setCompareMode] = useState(false);
  const [showForce, setShowForce] = useState(true);

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-copy">
          <h1>Cyclotron & Lorentz Force</h1>
          <p>
            Imagine a tiny charged particle entering a magnetic field. It does not go straight forever.
            A sideways push keeps turning it, so its path becomes circular.
          </p>
          <div className="intro-story">
            <article>
              <span>What is Lorentz force?</span>
              <p>It is the force on a moving charge inside a magnetic field.</p>
            </article>
            <article>
              <span>What is a cyclotron?</span>
              <p>It is a machine that uses this circular motion to speed up charged particles.</p>
            </article>
            <article>
              <span>Applications</span>
              <p>Particle research, cancer treatment, medical isotope production, and physics labs.</p>
            </article>
          </div>
        </div>
        <div className="hero-metrics" aria-label="Current simulation summary">
          <span>{params.Bz >= 0 ? 'B field out of page' : 'B field into page'}</span>
          <strong>{compareMode ? 'Dual charge comparison' : 'Single particle mode'}</strong>
          <small>Blue = motion, Yellow = force</small>
        </div>
      </header>

      <div className="main-grid">
        <main className="canvas-column">
          <section className="lab-stage">
            <div className="stage-header">
              <div>
                <span className="section-kicker">Live field chamber</span>
                <h2>Particle orbit</h2>
              </div>
              <div className="status-pill">
                <span className="pulse-dot" />
                {showForce ? 'Force revealed' : 'Predict first'}
              </div>
            </div>
            <SimulationCanvas params={params} compareMode={compareMode} showForce={showForce} />
          </section>
          <GuidedChallenge params={params} showForce={showForce} setShowForce={setShowForce} />
          <LiveInsightPanel params={params} />
          <VelocityGraph params={params} />
          <ConceptNotes />
        </main>
        <aside className="side-column">
          <ControlPanel
            params={params}
            setParams={setParams}
            compareMode={compareMode}
            setCompareMode={setCompareMode}
            onReset={() => setParams(DEFAULT_PARAMS)}
          />
          <ThumbRulePanel params={params} />
          <ReadoutPanel params={params} />
          <QuickRules />
          <ConceptFaq />
        </aside>
      </div>
    </div>
  );
}
