const { useState } = React;

const SAMPLE_RECIPES = [
  { id: 1, name: 'Veggie One-Pot Pasta', ingredients: ['pasta','tomato','garlic','basil','olive oil'], category: 'Quick', difficulty: 'Easy' },
  { id: 2, name: 'Spicy Chickpea Curry', ingredients: ['chickpeas','onion','cumin','turmeric','spinach'], category: 'Vegan', difficulty: 'Medium' },
  { id: 3, name: 'Chicken & Rice Bowl', ingredients: ['chicken','rice','soy sauce','ginger','green onion'], category: 'Protein', difficulty: 'Easy' },
  { id: 4, name: 'Avocado Toast Deluxe', ingredients: ['bread','avocado','lemon','chili flakes'], category: 'Breakfast', difficulty: 'Easy' },
  { id: 5, name: 'Banana Oat Pancakes', ingredients: ['banana','oats','milk','egg','cinnamon'], category: 'Sweet', difficulty: 'Easy' }
];

function RecipeCard({ recipe, onCook }) {
  return (
    <div className="recipe-item">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>{recipe.name}</h3>
          <small>{recipe.category || recipe.source || 'Recipe'} • {recipe.difficulty || 'Easy'}</small>
        </div>
        <button onClick={() => onCook(recipe.id)} style={{ padding: '5px 9px', fontSize: '0.8rem', borderRadius: '7px', background: '#1d4ed8' }}>
          I cooked this
        </button>
      </div>
      <ul>
        {recipe.ingredients.map((i) => <li key={`${recipe.id}-${i}`}>{i}</li>)}
      </ul>
      {recipe.sourceUrl ? (
        <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" style={{ color: '#1d4ed8', textDecoration: 'none' }}>View full recipe</a>
      ) : null}
    </div>
  );
}

function App() {
  const [ingredientsInput, setIngredientsInput] = useState('tomato, pasta');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Quick');
  const [difficulty, setDifficulty] = useState('Easy');
  const [recipes, setRecipes] = useState(SAMPLE_RECIPES);
  const [cookHistory, setCookHistory] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [liveMode, setLiveMode] = useState(false);

  const parseIngredients = (input) =>
    input
      .split(',')
      .map((ingredient) => ingredient.trim().toLowerCase())
      .filter(Boolean);

  const normalizedIngredients = parseIngredients(ingredientsInput);

  const filteredRecipes = recipes.filter((recipe) => {
    if (normalizedIngredients.length === 0) return true;
    return normalizedIngredients.every((needed) => recipe.ingredients.some((ing) => ing.toLowerCase().includes(needed)));
  });

  const createRecipe = (event) => {
    event.preventDefault();
    const sanitized = title.trim();
    if (!sanitized) return;
    const newRecipe = {
      id: Date.now(),
      name: sanitized,
      ingredients: parseIngredients(ingredientsInput),
      category,
      difficulty
    };
    setRecipes((prev) => [newRecipe, ...prev]);
    setTitle('');
    setIngredientsInput('');
  };

  const handleCook = (id) => {
    const recipe = recipes.find((r) => r.id === id);
    if (!recipe) return;
    setCookHistory((prev) => [{ id: Date.now(), name: recipe.name, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 4)]);
  };

  const searchLiveRecipes = async () => {
    setError('');
    const normalized = parseIngredients(ingredientsInput);
    if (!normalized.length) {
      setError('Enter at least one ingredient before live search.');
      return;
    }
    if (!apiKey) {
      setError('Set your Spoonacular API key to use live search.');
      return;
    }
    setLoading(true);
    try {
      const ingString = normalized.join(',');
      const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingString)}&number=8&ranking=1&ignorePantry=true&apiKey=${encodeURIComponent(apiKey)}`;
      const response = await fetch(url);
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const message = data?.message || response.statusText;
        throw new Error(`API failed: ${message}`);
      }
      const list = await response.json();
      if (!Array.isArray(list)) {
        throw new Error('Unexpected API result.');
      }
      const liveRecipes = list.map((item) => ({
        id: item.id,
        name: item.title,
        ingredients: [...(item.usedIngredients || []).map((i) => i.name), ...(item.missedIngredients || []).map((i) => i.name)],
        category: 'Live',
        difficulty: 'Medium',
        sourceUrl: item.sourceUrl || `https://spoonacular.com/recipes/${item.title.replace(/\s+/g, '-').toLowerCase()}-${item.id}`
      }));
      setRecipes(liveRecipes);
      setLiveMode(true);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const successCount = cookHistory.length;
  const uniqueCategories = [...new Set(recipes.map((r) => r.category))];
  const mostCommonIngredient = (() => {
    const names = recipes.flatMap((r) => r.ingredients);
    const freq = names.reduce((acc, item) => { acc[item] = (acc[item] ?? 0) + 1; return acc; }, {});
    return names.length ? Object.entries(freq).sort((a,b) => b[1]-a[1])[0][0] : 'none';
  })();

  return (
    <div className="container">
      <header className="header">
        <h1>Smart Recipe Builder</h1>
        <p>Now with live Spoonacular ingredient search. Add API key and hit Search Live.</p>
      </header>
      <div className="main">
        <div className="card">
          <h2>API Settings</h2>
          <div className="form-group"><label>Spoonacular API Key</label>
            <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Paste your API key" />
          </div>
          <div className="form-group"><label>Ingredients to Search</label>
            <input value={ingredientsInput} onChange={(e) => setIngredientsInput(e.target.value)} placeholder="e.g. chicken, garlic" />
          </div>
          <button onClick={searchLiveRecipes} style={{ marginRight: '8px' }}>
            {loading ? 'Searching...' : 'Search Live'}
          </button>
          <button onClick={() => { setRecipes(SAMPLE_RECIPES); setLiveMode(false); setError(''); }}>Use Sample Data</button>
          {error ? <div className="summary" style={{ borderColor: '#fecaca', background: '#fff7f7', color: '#b91c1c' }}>{error}</div> : null}
          {liveMode ? <div className="summary">Live results loaded. Add your own recipe from the form below.</div> : null}
        </div>

        <div className="card">
          <h2>Create A Recipe</h2>
          <form onSubmit={createRecipe}>
            <div className="form-group"><label>Recipe Name</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Example: Tomato Basil Pasta" required />
            </div>
            <div className="form-group"><label>Ingredients (comma-separated)</label>
              <textarea value={ingredientsInput} onChange={(e) => setIngredientsInput(e.target.value)} placeholder="tomato, pasta, garlic, basil" required />
            </div>
            <div className="grid-small">
              <div className="form-group"><label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option>Quick</option>
                  <option>Vegan</option>
                  <option>Comfort</option>
                  <option>Breakfast</option>
                  <option>Sweet</option>
                </select>
              </div>
              <div className="form-group"><label>Difficulty</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>
            <button type="submit">Save Recipe</button>
          </form>
        </div>
      </div>

      <div className="main">
        <div className="card">
          <h2>Recipe Results</h2>
          <p style={{ margin: '8px 0 10px', color: '#475569' }}>Showing {filteredRecipes.length} recipes. Live mode: {liveMode ? 'ON' : 'OFF'}.</p>
          {filteredRecipes.length === 0 ? (
            <div className="empty">No matching recipes found. Change ingredients or use sample data.</div>
          ) : (
            filteredRecipes.map((recipe) => <RecipeCard key={`${recipe.id}-${recipe.name}`} recipe={recipe} onCook={handleCook} />)
          )}
        </div>
      </div>

      <div className="main grid-two">
        <div className="card">
          <h2>Insights</h2>
          <div className="badge">Recipes: {recipes.length}</div>
          <div className="badge">Categories: {uniqueCategories.length}</div>
          <div className="badge">Most used ingredient: {mostCommonIngredient}</div>
          <div className="summary">Cook actions this session: {successCount}.</div>
          <h3>Recent Cooked</h3>
          {cookHistory.length === 0 ? <div className="empty">No cooking actions yet.</div> : cookHistory.map((item) => <div className="badge" key={item.id}>{item.name} at {item.time}</div>)}
        </div>

        <div className="card">
          <h2>React Concepts Used</h2>
          <ul>
            <li><strong>State</strong>: Controlled form fields, API key, recipes, loading, errors.</li>
            <li><strong>Props</strong>: `RecipeCard` receives recipe data and callback.</li>
            <li><strong>Events</strong>: onChange, onSubmit, button clicks for live search and cook actions.</li>
            <li><strong>Forms</strong>: Input fields + controlled state for recipe creation and live search.</li>
            <li><strong>Effects</strong>: Live API call triggered by button event to fetch external data.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
