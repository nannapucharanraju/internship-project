const FAQS = [
  {
    question: 'Does the magnet make it faster?',
    answer: 'No. The magnetic force pushes sideways, so it changes direction, not speed.',
  },
  {
    question: 'Why does it move in a circle?',
    answer: 'The force keeps pushing sideways, so the particle keeps turning.',
  },
  {
    question: 'What if the charge is negative?',
    answer: 'It bends in the opposite direction.',
  },
  {
    question: 'What do dot and cross mean?',
    answer: 'Dot means magnetic field comes out of the screen. Cross means it goes into the screen.',
  },
  {
    question: 'How do I make the circle smaller?',
    answer: 'Increase magnetic field or charge. You can also reduce mass or speed.',
  },
];

export default function ConceptFaq() {
  return (
    <section className="faq-panel">
      <div className="panel-title">
        <div>
          <span className="section-kicker">Quick FAQ</span>
          <h2>Common doubts</h2>
        </div>
      </div>

      <div className="faq-list">
        {FAQS.map((item) => (
          <details key={item.question} className="faq-item">
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
