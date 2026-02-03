import { CanvasArea } from './features/funnel/components/layout/CanvasArea'
import { Sidebar } from './features/funnel/components/layout/Sidebar'
import { TopNav } from './features/funnel/components/layout/TopNav'
import { useFunnelImportExport } from './features/funnel/hooks/useFunnelImportExport'
import { useFunnelPersistence } from './features/funnel/hooks/useFunnelPersistence'
import { useFunnelValidation } from './features/funnel/hooks/useFunnelValidation'
import { useFunnelStore } from './features/funnel/state/store'
import { STORAGE_KEY } from './features/funnel/utils/storage'
import './App.css'

function App() {
  const nodes = useFunnelStore((state) => state.nodes)
  const edges = useFunnelStore((state) => state.edges)
  const addNode = useFunnelStore((state) => state.addNode)
  const applyNodeChanges = useFunnelStore((state) => state.applyNodeChanges)
  const applyEdgeChanges = useFunnelStore((state) => state.applyEdgeChanges)
  const onConnect = useFunnelStore((state) => state.onConnect)
  const setState = useFunnelStore((state) => state.setState)
  const reset = useFunnelStore((state) => state.reset)
  const undo = useFunnelStore((state) => state.undo)
  const redo = useFunnelStore((state) => state.redo)
  const canUndo = useFunnelStore((state) => state.canUndo)
  const canRedo = useFunnelStore((state) => state.canRedo)
  const savePositionSnapshot = useFunnelStore((state) => state.savePositionSnapshot)

  const { errors, warnings, nodeById } = useFunnelValidation(nodes, edges)
  const { storageError } = useFunnelPersistence({ nodes, edges, setState, reset })
  const { handleExport, handleImport, importError } = useFunnelImportExport({
    nodes,
    edges,
    setState,
  })

  return (
    <div className="app">
      <div className="sidebar-column">
        <TopNav storageError={storageError} importError={importError} />
        <Sidebar validation={{ errors, warnings }} />
      </div>
      <CanvasArea
          nodes={nodes}
          edges={edges}
          nodeById={nodeById}
          addNode={addNode}
          applyNodeChanges={applyNodeChanges}
          applyEdgeChanges={applyEdgeChanges}
          onConnect={onConnect}
          savePositionSnapshot={savePositionSnapshot}
          onImport={handleImport}
          onExport={handleExport}
          onUndo={undo}
          onRedo={redo}
          onReset={() => {
            reset()
            localStorage.removeItem(STORAGE_KEY)
          }}
          canUndo={canUndo}
          canRedo={canRedo}
        />
    </div>
  )
}

export default App
