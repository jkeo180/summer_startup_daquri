// This page is static content — no API calls needed.
// All the prompts, challenges, and quotes come from your Canva booklet.

const PROMPTS = [
  { num: '01', cat: 'Relationship',   q: 'If you could choose a theme song for our relationship right now, what would it be?' },
  { num: '02', cat: 'Dreams',         q: 'If we had unlimited money for one weekend, what would we do?' },
  { num: '03', cat: 'Self-reflection',q: 'What do you think is your biggest strength, and how do you use it in our relationship?' },
  { num: '04', cat: 'Growth',         q: "What's one area of your life you want to improve, and what steps can you take?" },
  { num: '05', cat: 'Identity',       q: 'If you could describe yourself in three words, what would they be and why?' },
  { num: '06', cat: 'Connection',     q: 'How do you want to feel in our relationship, and how can we work together to create that?' },
  { num: '07', cat: 'Memory',         q: "What's a memory that always reminds you of who you are at your core?" },
  { num: '08', cat: 'Intimacy',       q: 'What does intimacy mean to you now, and how can we redefine it together?' },
  { num: '09', cat: 'Appreciation',   q: 'What makes you feel most appreciated or desired in our relationship?' },
  { num: '10', cat: 'Fun',            q: 'If you could invent a holiday, what would it celebrate and how would people honor it?' },
  { num: '11', cat: 'Parenting',      q: 'What values do you hope to instill in our children as they grow?' },
  { num: '12', cat: 'Legacy',         q: "What's the biggest accomplishment you want your children to watch you attain?" },
]

const CONFLICT_STEPS = [
  { n: 1, label: 'Clarification',       desc: 'Ask questions to fully understand the issue before reacting.' },
  { n: 2, label: 'Perspective taking',  desc: 'Explore emotions and viewpoints to build empathy.' },
  { n: 3, label: 'Identifying needs',   desc: 'Uncover the core needs driving each concern.' },
  { n: 4, label: 'Exploring solutions', desc: 'Brainstorm resolutions that address those needs together.' },
  { n: 5, label: 'Reflect and confirm', desc: "Summarize and confirm next steps so you're aligned." },
]

export default function ConnectPage() {
  return (
    <>
      <p className="eyebrow">Conversation starters</p>
      <div style={{ marginBottom: 20 }}>
        {PROMPTS.map(p => (
          <div key={p.num} style={{
            background: 'var(--surface)', borderRadius: 12,
            padding: '14px 16px', marginBottom: 8,
          }}>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--rose)', marginBottom: 4 }}>
              {p.num} · {p.cat}
            </p>
            <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5, fontStyle: 'italic' }}>
              {p.q}
            </p>
          </div>
        ))}
      </div>

      <p className="eyebrow" style={{ marginTop: 8 }}>Fun challenges</p>

      <div className="card" style={{ padding: '16px', marginBottom: 10 }}>
        <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>Left-handed drawing challenge</p>
        <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
          Pick an object and draw it together using your non-dominant hands — 3 minutes on the clock.
          Laugh at the results. Bonus points for the most abstract interpretation.
        </p>
      </div>

      <div className="card" style={{ padding: '16px', marginBottom: 20 }}>
        <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>Memory challenge</p>
        <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
          In 2 minutes, write about a moment that made you feel truly loved. Share your responses
          and decide who captured it best. Bonus points for creativity.
        </p>
      </div>

      <p className="eyebrow">Navigate conflict together</p>
      <div className="card" style={{ padding: '16px', marginBottom: 20 }}>
        <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 12 }}>
          A 5-step framework for working through any problem as a team.
        </p>
        {CONFLICT_STEPS.map(s => (
          <div key={s.n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: 'var(--coral-light)', color: 'var(--coral-text)',
              fontSize: 11, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: 1,
            }}>{s.n}</div>
            <div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{s.label}</span>
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}> — {s.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="quote-block">
        <p className="quote-text">Age does not protect you from love, but love protects you from age.</p>
        <p className="quote-attr">— Jeanne Moreau</p>
      </div>
      <div className="quote-block">
        <p className="quote-text">Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.</p>
        <p className="quote-attr">— Lao Tzu</p>
      </div>
    </>
  )
}