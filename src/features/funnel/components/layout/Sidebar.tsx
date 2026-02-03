import { paletteItems } from '../../constants/paletteItems'

type SidebarProps = {
  validation: {
    errors: string[]
    warnings: string[]
  }
}

export function Sidebar({ validation }: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="Funnel controls">
      <section className="sidebar__section" aria-label="Palette">
        <h2 className="sidebar__section-title">Palette</h2>
        <p className="sidebar__section-body">
          Drag nodes into the canvas to build your funnel.
        </p>
        <div className="palette" role="list">
          {paletteItems.map((item) => (
            <button
              key={item.type}
              className="palette__item"
              type="button"
              draggable
              role="listitem"
              aria-label={`Drag ${item.label} node`}
              style={{ borderLeftColor: item.color }}
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow', item.type)
                event.dataTransfer.effectAllowed = 'move'
              }}
            >
              <span 
                className="palette__dot" 
                style={{ backgroundColor: item.color }} 
                aria-hidden 
              />
              {item.label}
            </button>
          ))}
        </div>
      </section>
      <section className="sidebar__section" aria-label="Validation">
        <h2 className="sidebar__section-title">Validation</h2>
        <div className="validation">
          {validation.errors.length === 0 && validation.warnings.length === 0 && (
            <p className="validation__empty">No issues detected yet.</p>
          )}
          {validation.errors.map((error, index) => (
            <div className="validation__item validation__item--error" key={`error-${index}`}>
              <span className="validation__badge">Error</span>
              <span>{error}</span>
            </div>
          ))}
          {validation.warnings.map((warning, index) => (
            <div className="validation__item validation__item--warning" key={`warn-${index}`}>
              <span className="validation__badge">Warning</span>
              <span>{warning}</span>
            </div>
          ))}
        </div>
      </section>
    </aside>
  )
}
