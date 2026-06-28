import { useState, useEffect } from 'react'
import RecipeCard from '../components/RecipeCard'
import AddRecipeForm from '../components/AddRecipeForm'
import { fetchRecipes } from '../api'

const FILTERS = ['All', 'All-time favorite', 'New favorite', 'Cocktail', 'Mocktail', 'Exclusive', 'Custom']

export default function RecipesPage() {
  // recipes starts empty, gets filled when the API responds
  const [recipes, setRecipes]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [search, setSearch]         = useState('')
  const [activeFilter, setFilter]   = useState('All')
  const [showForm, setShowForm]     = useState(false)

  // Fetch recipes from the Python backend when this page first loads
  useEffect(() => {
    fetchRecipes()
      .then(data => {
        setRecipes(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])  // [] = run once on mount

  // Filter + search logic (pure JS, no API call needed)
  const visible = recipes.filter(r => {
    const matchesFilter = activeFilter === 'All' || r.category === activeFilter
    const q = search.toLowerCase()
    const matchesSearch = !q || r.name.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q)
    return matchesFilter && matchesSearch
  })

  // Called by AddRecipeForm when user saves a new recipe
  function handleAddRecipe(newRecipe) {
    setRecipes(prev => [...prev, newRecipe])
    setShowForm(false)
    // Scroll to bottom so they can see their new recipe
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  if (loading) return <div className="loading">Loading recipes...</div>
  if (error)   return <div className="empty">Couldn't load recipes. Is the backend running?</div>

  return (
    <>
      {/* Search input */}
      <input
        type="search"
        placeholder="Search recipes..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 12 }}
      />

      {/* Filter chips */}
      <div className="chip-row">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`chip ${activeFilter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Recipe list */}
      {visible.length === 0
        ? <div className="empty">No recipes match.</div>
        : visible.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))
      }

      {/* Add recipe button */}
      <button
        className="btn btn-block"
        style={{ marginTop: 8, borderStyle: 'dashed' }}
        onClick={() => setShowForm(true)}
      >
        + Add your own recipe
      </button>

      {/* Form overlay — only renders when showForm is true */}
      {showForm && (
        <AddRecipeForm
          onSave={handleAddRecipe}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  )
}
