export default function ConceptNotes() {
  return (
    <section className="concept-notes">
      <div className="panel-title">
        <div>
          <span className="section-kicker">Study notes</span>
          <h2>Easy notes</h2>
        </div>
      </div>

      <div className="notes-grid">
        <article className="note-card highlight-note">
          <h3>Main idea</h3>
          <p>A moving charge feels a sideways force in a magnetic field.</p>
          <code>F = q(v x B)</code>
        </article>

        <article className="note-card">
          <h3>Why it curves</h3>
          <ul>
            <li>The force is sideways.</li>
            <li>Sideways force changes direction.</li>
            <li>Changing direction again and again makes a circle.</li>
          </ul>
        </article>

        <article className="note-card">
          <h3>Hand rule</h3>
          <ul>
            <li>Fingers point along motion.</li>
            <li>Curl fingers toward magnetic field.</li>
            <li>Thumb gives force for positive charge.</li>
            <li>Negative charge goes opposite.</li>
          </ul>
        </article>

        <article className="note-card">
          <h3>Dot and cross</h3>
          <ul>
            <li><strong>Dot</strong> means field comes out.</li>
            <li><strong>Cross</strong> means field goes in.</li>
          </ul>
        </article>

        <article className="note-card">
          <h3>Circle size</h3>
          <p>This formula tells how big the circle becomes.</p>
          <code>r = mv / |q|B</code>
          <ul>
            <li>More mass or speed means bigger circle.</li>
            <li>More charge or field means smaller circle.</li>
          </ul>
        </article>

        <article className="note-card">
          <h3>Time for one round</h3>
          <code>T = 2πm / |q|B</code>
          <p>One round depends on mass, charge, and magnetic field.</p>
        </article>
      </div>
    </section>
  );
}
