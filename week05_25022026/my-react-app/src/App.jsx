import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  return (
    <div className="app">
      <h1>🚀 My First React App</h1>
      <h2>Welcome to Week 05 - {new Date().toLocaleDateString()}</h2>
      
      <div className="greeting">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {name && <p>Hello, <strong>{name}</strong>! 👋</p>}
      </div>

      <div className="counter">
        <h3>Counter: {count}</h3>
        <div className="button-group">
          <button onClick={() => setCount(count - 1)}>-</button>
          <button onClick={() => setCount(0)}>Reset</button>
          <button onClick={() => setCount(count + 1)}>+</button>
        </div>
      </div>

      <div className="info">
        <p>Today's date: {new Date().toDateString()}</p>
        <p>Folder: week05_25022026</p>
      </div>
    </div>
  )
}

export default App