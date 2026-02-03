type TopNavProps = {
  storageError: string | null
  importError: string | null
}

export function TopNav({ storageError, importError }: TopNavProps) {
  return (
    <header className="topbar">
      <div className="topbar__brand">
        <p className="topbar__eyebrow">Cartpanda</p>
        <h1 className="topbar__title">Funnel Builder</h1>
      </div>
      {(storageError || importError) && (
        <p className="topbar__notice">{storageError ?? importError}</p>
      )}
    </header>
  )
}
