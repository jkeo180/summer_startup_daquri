import { useState } from 'react'

// Badge color depends on category
function categoryBadge(cat) {
  if (cat === 'Mocktail')          return 'badge badge-purple'
  if (cat === 'Exclusive')         return 'badge badge-coral'
  if (cat === 'New favorite')      return 'badge badge-teal'
  return 'badge badge-coral'
}

// RecipeCard receives a single recipe object as a prop
// and manages its own open/closed state internally
export default function RecipeCard({ recipe }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`card ${open ? 'active' : ''}`}>

      {/* Always visible: name, description, badge */}
      <div
        onClick={() => setOpen(!open)}
        style={{ padding: '14px 16px', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>
              {recipe.name}
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-2)' }}>
              {recipe.description}
            </p>
          </div>
          <span className={categoryBadge(recipe.category)} style={{ flexShrink: 0, marginTop: 2 }}>
            {recipe.category}
          </span>
        </div>
      </div>

      {/* Expanded detail: only renders when open is true */}
      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: '0.5px solid var(--border)' }}>
          <div style={{ paddingTop: 14 }}>

            <p className="detail-label">Ingredients</p>
            <ul className="ing-list">
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>

            <p className="detail-label">Instructions</p>
            <ol className="step-list">
              {recipe.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>

            <div className="garnish-row">
              <span style={{ color: 'var(--coral)', fontSize: 14 }}>✦</span>
              {recipe.garnish}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
