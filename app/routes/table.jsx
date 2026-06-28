import { useState, useEffect } from 'react'
import { fetchRecipes, fetchStarters, unlockTable, joinTable, placeOrder } from '../api'

// TablePage has several sub-states:
//   'locked'    → user needs to enter box code + nickname
//   'unlocked'  → session active, pick drinks and generate starters

export default function TablePage() {
  const [session, setSession]       = useState(null)   // null = locked
  const [recipes, setRecipes]       = useState([])
  const [selected, setSelected]     = useState(new Set())
  const [starters, setStarters]     = useState([])
  const [loadingAI, setLoadingAI]   = useState(false)
  const [aiError, setAiError]       = useState(null)

  // Unlock form state
  const [boxCode, setBoxCode]       = useState('')
  const [nickname, setNickname]     = useState('')
  const [unlockError, setUnlockError] = useState(null)
  const [unlocking, setUnlocking]   = useState(false)

  // Load recipe list so we can show drink picker chips
  useEffect(() => {
    fetchRecipes().then(setRecipes).catch(() => {})
  }, [])

  // Check localStorage — if they already unlocked a table, restore the session
  useEffect(() => {
    const saved = localStorage.getItem('daiquiri_session')
    if (saved) setSession(JSON.parse(saved))
  }, [])

  async function handleUnlock() {
    if (!boxCode.trim() || !nickname.trim()) {
      setUnlockError('Enter both your box code and a nickname.')
      return
    }
    setUnlocking(true)
    setUnlockError(null)
    try {
      const data = await unlockTable(boxCode.trim().toUpperCase(), nickname.trim())
      const s = { ...data, nickname: nickname.trim() }
      setSession(s)
      localStorage.setItem('daiquiri_session', JSON.stringify(s))
    } catch (err) {
      setUnlockError(err.message)
    } finally {
      setUnlocking(false)
    }
  }

  function toggleDrink(id) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
    // Clear old starters when selection changes
    setStarters([])
  }

  async function handleGenerate() {
    if (selected.size === 0) return
    setLoadingAI(true)
    setAiError(null)
    setStarters([])
    try {
      // Record the order on the backend so everyone at the table can see
      await placeOrder(session.table_code, session.nickname, [...selected])
      const data = await fetchStarters([...selected], session.table_code)
      setStarters(data.starters || [])
    } catch (err) {
      setAiError("Couldn't generate starters. Try again.")
    } finally {
      setLoadingAI(false)
    }
  }

  function handleLeave() {
    localStorage.removeItem('daiquiri_session')
    setSession(null)
    setSelected(new Set())
    setStarters([])
  }

  // ── Locked state: show unlock form ───────────────────────────────────────
  if (!session) {
    return (
      <div>
        <p className="section-title">Unlock your table</p>
        <p className="section-sub">Enter the code from your box to start a shared session.</p>

        <div className="field-group">
          <label className="field-label">Box code</label>
          <input
            type="text"
            placeholder="DEMO42"
            value={boxCode}
            onChange={e => setBoxCode(e.target.value.toUpperCase())}
            style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}
          />
        </div>

        <div className="field-group">
          <label className="field-label">Your nickname</label>
          <input
            type="text"
            placeholder="e.g. Julie"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
          />
        </div>

        {unlockError && (
          <p style={{ color: 'var(--coral-dark)', fontSize: 13, marginBottom: 12 }}>
            {unlockError}
          </p>
        )}

        <button
          className="btn btn-primary btn-block"
          onClick={handleUnlock}
          disabled={unlocking}
        >
          {unlocking ? 'Unlocking...' : 'Unlock table'}
        </button>

        <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginTop: 16 }}>
          Try code <strong>DEMO42</strong> to test without a box.
        </p>
      </div>
    )
  }

  // ── Unlocked state: show session ─────────────────────────────────────────
  return (
    <>
      {/* Table hero */}
      <div className="table-hero">
        <p className="eyebrow" style={{ marginBottom: 4 }}>Your table</p>
        <div className="table-code">{session.table_code}</div>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 12 }}>
          Share this code so friends can join
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: -6, marginBottom: 8 }}>
          {(session.members || [nickname]).slice(0, 5).map((m, i) => (
            <div key={i} style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--coral-light)', border: '2px solid white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: 'var(--coral-text)',
              marginLeft: i === 0 ? 0 : -8, zIndex: 5 - i,
            }}>
              {m[0].toUpperCase()}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
          {(session.members || [session.nickname]).length} at this table
        </p>
      </div>

      {/* Drink picker */}
      <p className="eyebrow">What did you order?</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 16 }}>
        {recipes.map(r => (
          <button
            key={r.id}
            className={`drink-chip ${selected.has(r.id) ? 'selected' : ''}`}
            onClick={() => toggleDrink(r.id)}
          >
            {r.name}
          </button>
        ))}
      </div>

      {/* Generate button */}
      <button
        className="btn btn-primary btn-block"
        onClick={handleGenerate}
        disabled={loadingAI || selected.size === 0}
        style={{ marginBottom: 20 }}
      >
        {loadingAI
          ? <><div className="dot-loader"><span/><span/><span/></div> Generating...</>
          : '✦ Generate conversation starters'
        }
      </button>

      {/* Error */}
      {aiError && (
        <p style={{ color: 'var(--coral-dark)', fontSize: 13, marginBottom: 12 }}>{aiError}</p>
      )}

      {/* Starters */}
      {starters.length > 0 && (
        <>
          <p className="eyebrow">Tonight's starters</p>
          {starters.map((s, i) => (
            <div key={i} className="starter-card">
              <p className="starter-cat">{s.category}</p>
              <p className="starter-text">{s.text}</p>
            </div>
          ))}
        </>
      )}

      {/* Leave session */}
      <button
        className="btn btn-block"
        onClick={handleLeave}
        style={{ marginTop: 24, color: 'var(--text-3)', fontSize: 13 }}
      >
        Leave table
      </button>
    </>
  )
}
