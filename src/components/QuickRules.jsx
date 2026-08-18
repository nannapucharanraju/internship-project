const RULES = [
  {
    title: 'Force is sideways',
    text: 'Magnetic force acts at 90 deg to motion, so it turns the particle.',
  },
  {
    title: 'Speed stays same',
    text: 'Only direction changes. That is why the path becomes circular.',
  },
  {
    title: 'Signs matter',
    text: 'Negative charge or opposite B direction flips the curve.',
  },
];

export default function QuickRules() {
  return (
    <section className="quick-rules">
      <div className="panel-title">
        <div>
          <span className="section-kicker">Remember</span>
          <h2>3 key rules</h2>
        </div>
      </div>

      <div className="rule-list">
        {RULES.map((rule, index) => (
          <article className="rule-card" key={rule.title}>
            <strong>{index + 1}</strong>
            <div>
              <h3>{rule.title}</h3>
              <p>{rule.text}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="formula-strip">
        <span>Formula to remember</span>
        <code>F = q(v x B)</code>
      </div>
    </section>
  );
}
