import { useState } from 'react'

// This form slides up over the whole screen when the user wants to add a recipe.
// It receives two props:
//   onSave(recipe) — called when the user saves, passes the new recipe up to the parent
//   onClose()      — called when the user hits Back

export default function AddRecipeForm({ onSave, onClose }) {
  const [name, setName]             = useState('')
  const [tag, setTag]               = useState('')
  const [desc, setDesc]             = useState('')
  const [instructions, setInstructions] = useState('')
  const [garnish, setGarnish]       = useState('')
  // Ingredients are an array of strings so we can add/remove rows
  const [ingredients, setIngredients] = useState(['', '', ''])

  function addIngredient() {
    setIngredients([...ingredients, ''])
  }

  function removeIngredient(index) {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  function updateIngredient(index, value) {
    const updated = [...ingredients]
    updated[index] = value
    setIngredients(updated)
  }

  function handleSave() {
    if (!name.trim()) { alert('Give your recipe a name.'); return }

    const newRecipe = {
      id:           'custom-' + Date.now(),
      name:         name.trim(),
      category:     tag.trim() || 'Custom',
      description:  desc.trim(),
      ingredients:  ingredients.filter(i => i.trim()),
      steps:        instructions.split('\n').filter(s => s.trim()),
      garnish:      garnish.trim(),
    }

    onSave(newRecipe)
  }

  return (
    <div className="form-overlay">

      <div className="form-header">
        <button className="back-btn" onClick={onClose}>← Back</button>
        <span className="form-title">Add a recipe</span>
      </div>

      <div className="form-body">

        <div className="field-group">
          <label className="field-label">Recipe name</label>
          <input
            type="text"
            placeholder="Passion fruit daiquiri"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label className="field-label">Category</label>
          <input
            type="text"
            placeholder="Tropical, Classic, Mocktail..."
            value={tag}
            onChange={e => setTag(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label className="field-label">Short description</label>
          <input
            type="text"
            placeholder="Bright and tropical with a tangy finish"
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label className="field-label">Ingredients</label>
          {ingredients.map((ing, i) => (
            <div className="ing-row" key={i}>
              <input
                type="text"
                placeholder={`e.g. 2 oz white rum`}
                value={ing}
                onChange={e => updateIngredient(i, e.target.value)}
              />
              <button className="remove-btn" onClick={() => removeIngredient(i)}>×</button>
            </div>
          ))}
          <button className="add-ing-btn" onClick={addIngredient}>+ Add ingredient</button>
        </div>

        <div className="field-group">
          <label className="field-label">Instructions (one step per line)</label>
          <textarea
            placeholder={"Shake all ingredients with ice.\nStrain into a chilled glass."}
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label className="field-label">Garnish</label>
          <input
            type="text"
            placeholder="Lime wheel and passion fruit slice"
            value={garnish}
            onChange={e => setGarnish(e.target.value)}
          />
        </div>

        <button className="btn btn-primary btn-block" onClick={handleSave}>
          Save recipe
        </button>

      </div>
    </div>
  )
}
