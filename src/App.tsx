import { useMemo, useState } from 'react'
import ReactFlow, { Background, type ReactFlowInstance } from 'reactflow'

import { nodeTypes } from './features/funnel/components/nodes/nodeTypes'
import { useFunnelStore } from './features/funnel/state/store'
import type { NodeType } from './features/funnel/types'
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

  const nodes = useFunnelStore((state) => state.nodes)
  const edges = useFunnelStore((state) => state.edges)
  const addNode = useFunnelStore((state) => state.addNode)
  const updateNodePosition = useFunnelStore((state) => state.updateNodePosition)
  const onConnect = useFunnelStore((state) => state.onConnect)

  const hasNodes = useMemo(() => nodes.length > 0, [nodes.length])

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
                onConnect(connection.source, connection.target)
              }
            }}
            onNodeDragStop={(_, node) => {
              updateNodePosition(node.id, node.position)
            }}
            panOnDrag
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
