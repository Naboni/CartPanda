import './App.css'

function App() {
  return (
    <div className="app">
      <aside className="sidebar" aria-label="Funnel controls">
        <header className="sidebar__header">
          <p className="sidebar__eyebrow">Cartpanda</p>
          <h1 className="sidebar__title">Funnel Builder</h1>
        </header>
        <section className="sidebar__section" aria-label="Palette">
          <h2 className="sidebar__section-title">Palette</h2>
          <p className="sidebar__section-body">
            Drag nodes into the canvas to build your funnel.
          </p>
        </section>
        <section className="sidebar__section" aria-label="Actions">
          <h2 className="sidebar__section-title">Actions</h2>
          <p className="sidebar__section-body">
            Import, export, and validation will appear here.
          </p>
        </section>
      </aside>
      <main className="canvas" aria-label="Funnel canvas">
        <div className="canvas__header">
          <h2 className="canvas__title">Canvas</h2>
          <p className="canvas__subtitle">
            The drag-and-drop flow editor will live in this area.
          </p>
        </div>
        <div className="canvas__empty-state" role="status" aria-live="polite">
          <p className="canvas__empty-title">No nodes yet</p>
          <p className="canvas__empty-body">
            Start by dragging a page type from the palette into the canvas.
          </p>
        </div>
      </main>
    </div>
  )
}

export default App
