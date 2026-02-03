import { useEffect, useMemo, useRef, useState } from 'react'
import ReactFlow, { Background, MarkerType, type ReactFlowInstance } from 'reactflow'

import { nodeTypes } from './features/funnel/components/nodes/nodeTypes'
import { funnelStateSchema } from './features/funnel/schema/funnelSchema'
import { useFunnelStore } from './features/funnel/state/store'
import type { FunnelEdge, FunnelNode, NodeType } from './features/funnel/types'
import { STORAGE_KEY } from './features/funnel/utils/storage'
import './App.css'

const paletteItems: Array<{ type: NodeType; label: string }> = [
  { type: 'sales', label: 'Sales Page' },
  { type: 'order', label: 'Order Page' },
  { type: 'upsell', label: 'Upsell' },
  { type: 'downsell', label: 'Downsell' },
  { type: 'thankyou', label: 'Thank You' },
]

function App() {
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const [storageError, setStorageError] = useState<string | null>(null)
  const hasLoadedRef = useRef(false)
  const saveTimeoutRef = useRef<number | null>(null)

  const nodes = useFunnelStore((state) => state.nodes)
  const edges = useFunnelStore((state) => state.edges)
  const addNode = useFunnelStore((state) => state.addNode)
  const updateNodePosition = useFunnelStore((state) => state.updateNodePosition)
  const onConnect = useFunnelStore((state) => state.onConnect)
  const setState = useFunnelStore((state) => state.setState)
  const reset = useFunnelStore((state) => state.reset)

  const hasNodes = useMemo(() => nodes.length > 0, [nodes.length])
  const nodeById = useMemo(() => {
    return nodes.reduce<Record<string, FunnelNode>>((acc, node) => {
      acc[node.id] = node
      return acc
    }, {})
  }, [nodes])

  const validation = useMemo(() => {
    const errors: string[] = []
    const warnings: string[] = []

    edges.forEach((edge) => {
      const sourceNode = nodeById[edge.source]
      if (sourceNode?.data.type === 'thankyou') {
        errors.push('Thank You pages cannot have outgoing connections.')
      }
    })

    const salesNode = nodes.find((node) => node.data.type === 'sales')
    if (salesNode) {
      const salesEdges = edges.filter((edge) => edge.source === salesNode.id)
      if (salesEdges.length !== 1) {
        warnings.push('Sales Page should have exactly one outgoing connection.')
      } else {
        const targetNode = nodeById[salesEdges[0]?.target]
        if (targetNode?.data.type !== 'order') {
          warnings.push('Sales Page should connect to an Order Page.')
        }
      }
    }

    return { errors, warnings }
  }, [edges, nodeById, nodes])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      hasLoadedRef.current = true
      return
    }
    try {
      const parsed = JSON.parse(stored)
      const result = funnelStateSchema.safeParse(parsed)
      if (result.success) {
        setState(result.data)
        setStorageError(null)
      } else {
        setStorageError('Saved data was invalid and has been reset.')
        reset()
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      setStorageError('Saved data could not be parsed and has been reset.')
      reset()
      localStorage.removeItem(STORAGE_KEY)
    } finally {
      hasLoadedRef.current = true
    }
  }, [reset, setState])

  useEffect(() => {
    if (!hasLoadedRef.current) {
      return
    }
    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current)
    }
    saveTimeoutRef.current = window.setTimeout(() => {
      const payload: Pick<ReturnType<typeof useFunnelStore.getState>, 'nodes' | 'edges'> = {
        nodes,
        edges,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    }, 250)
    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [edges, nodes])

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
          <div className="palette" role="list">
            {paletteItems.map((item) => (
              <button
                key={item.type}
                className="palette__item"
                type="button"
                draggable
                role="listitem"
                aria-label={`Drag ${item.label} node`}
                onDragStart={(event) => {
                  event.dataTransfer.setData('application/reactflow', item.type)
                  event.dataTransfer.effectAllowed = 'move'
                }}
              >
                <span className="palette__dot" aria-hidden />
                {item.label}
              </button>
            ))}
          </div>
        </section>
        <section className="sidebar__section" aria-label="Actions">
          <h2 className="sidebar__section-title">Actions</h2>
          <p className="sidebar__section-body">
            Save, import, and export actions live here.
          </p>
          <div className="actions">
            <button
              type="button"
              className="action-button"
              onClick={() => {
                reset()
                localStorage.removeItem(STORAGE_KEY)
              }}
            >
              Reset builder
            </button>
            {storageError && <p className="actions__notice">{storageError}</p>}
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
      <main className="canvas" aria-label="Funnel canvas">
        <div className="canvas__header">
          <h2 className="canvas__title">Canvas</h2>
          <p className="canvas__subtitle">
            The drag-and-drop flow editor will live in this area.
          </p>
        </div>
        <div
          className="canvas__flow"
          onDragOver={(event) => {
            event.preventDefault()
            event.dataTransfer.dropEffect = 'move'
          }}
          onDrop={(event) => {
            event.preventDefault()
            const type = event.dataTransfer.getData('application/reactflow') as NodeType
            if (!type || !reactFlowInstance) {
              return
            }
            const position = reactFlowInstance.screenToFlowPosition({
              x: event.clientX,
              y: event.clientY,
            })
            addNode(type, position)
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            onConnect={(connection) => {
              if (connection.source && connection.target) {
                const sourceNode = nodeById[connection.source]
                if (sourceNode?.data.type === 'thankyou') {
                  return
                }
                onConnect(connection.source, connection.target)
              }
            }}
            onNodeDragStop={(_, node) => {
              updateNodePosition(node.id, node.position)
            }}
            panOnDrag
            defaultEdgeOptions={{
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#111827',
              },
              style: { strokeWidth: 2, stroke: '#111827' },
            }}
            fitView
          >
            <Background gap={20} size={1} color="#e5e7eb" />
          </ReactFlow>
          {!hasNodes && (
            <div className="canvas__empty-state" role="status" aria-live="polite">
              <p className="canvas__empty-title">No nodes yet</p>
              <p className="canvas__empty-body">
                Start by dragging a page type from the palette into the canvas.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
