import { useRef } from 'react'

type TopNavProps = {
  onImport: (file: File) => void
  onExport: () => void
  onUndo: () => void
  onRedo: () => void
  onReset: () => void
  canUndo: boolean
  canRedo: boolean
  storageError: string | null
  importError: string | null
}

export function TopNav({
  onImport,
  onExport,
  onUndo,
  onRedo,
  onReset,
  canUndo,
  canRedo,
  storageError,
  importError,
}: TopNavProps) {
  const importInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <header className="topbar">
      <div className="topbar__brand">
        <p className="topbar__eyebrow">Cartpanda</p>
        <h1 className="topbar__title">Funnel Builder</h1>
      </div>
      <div className="topbar__actions">
        <div className="topbar__row">
          <button
            type="button"
            className="action-button"
            onClick={() => importInputRef.current?.click()}
            aria-label="Import funnel JSON"
          >
            Import JSON
          </button>
          <button
            type="button"
            className="action-button"
            onClick={onExport}
            aria-label="Export funnel JSON"
          >
            Export JSON
          </button>
        </div>
        <div className="topbar__row">
          <button
            type="button"
            className="action-button"
            onClick={onUndo}
            disabled={!canUndo}
            aria-label="Undo last change"
          >
            Undo
          </button>
          <button
            type="button"
            className="action-button"
            onClick={onRedo}
            disabled={!canRedo}
            aria-label="Redo last change"
          >
            Redo
          </button>
          <button
            type="button"
            className="action-button action-button--danger"
            onClick={onReset}
            aria-label="Reset builder"
          >
            Reset
          </button>
        </div>
        <input
          ref={importInputRef}
          className="actions__file-input"
          type="file"
          accept="application/json"
          aria-label="Select JSON file to import"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) {
              onImport(file)
              event.target.value = ''
            }
          }}
        />
        {(storageError || importError) && (
          <p className="topbar__notice">{storageError ?? importError}</p>
        )}
      </div>
    </header>
  )
}
