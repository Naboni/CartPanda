import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Cartpanda Funnel Builder</h1>
        <p className="app__subtitle">
          Project scaffold ready. Next step will introduce the builder layout.
        </p>
      </header>
      <main className="app__main">
        <div className="placeholder-card" role="status" aria-live="polite">
          <p className="placeholder-card__title">Placeholder UI</p>
          <p className="placeholder-card__body">
            The canvas and palette will appear here in Step 2.
          </p>
        </div>
      </main>
    </div>
  )
}

export default App
