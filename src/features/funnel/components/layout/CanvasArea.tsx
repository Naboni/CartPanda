import { useMemo, useRef, useState } from 'react'
import ReactFlow, { Background, MarkerType, type EdgeChange, type NodeChange, type ReactFlowInstance } from 'reactflow'

import { edgeTypes } from '../edges/edgeTypes'
import { nodeTypes } from '../nodes/nodeTypes'
import type { FunnelEdge, FunnelNode, FunnelState, NodeType } from '../../types'

import importIcon from '../../../../assets/import.png'
import exportIcon from '../../../../assets/export.png'
import undoIcon from '../../../../assets/undo.png'
import redoIcon from '../../../../assets/redo.png'
import resetIcon from '../../../../assets/reset.png'

type CanvasAreaProps = {
  nodes: FunnelNode[]
  edges: FunnelEdge[]
  nodeById: Record<string, FunnelNode>
  addNode: (type: NodeType, position: { x: number; y: number }) => void
  applyNodeChanges: (changes: NodeChange[]) => void
  applyEdgeChanges: (changes: EdgeChange[]) => void
  onConnect: (source: string, target: string) => void
  savePositionSnapshot: (snapshot: Pick<FunnelState, 'nodes' | 'edges'>) => void
  onImport: (file: File) => void
  onExport: () => void
  onUndo: () => void
  onRedo: () => void
  onReset: () => void
  canUndo: boolean
  canRedo: boolean
}

export function CanvasArea({
  nodes,
  edges,
  nodeById,
  addNode,
  applyNodeChanges,
  applyEdgeChanges,
  onConnect,
  savePositionSnapshot,
  onImport,
  onExport,
  onUndo,
  onRedo,
  onReset,
  canUndo,
  canRedo,
}: CanvasAreaProps) {
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const hasNodes = useMemo(() => nodes.length > 0, [nodes.length])
  const dragSnapshotRef = useRef<Pick<FunnelState, 'nodes' | 'edges'> | null>(null)
  const importInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <main className="canvas" aria-label="Funnel canvas">
      <div className="canvas__header">
        <div className="canvas__header-left">
          <h2 className="canvas__title">Canvas</h2>
          <p className="canvas__subtitle">
            The drag-and-drop flow editor will live in this area.
          </p>
        </div>
        <div className="canvas__actions">
          <button
            type="button"
            className="icon-button"
            onClick={() => importInputRef.current?.click()}
            title="Import JSON"
            aria-label="Import funnel JSON"
          >
            <img src={importIcon} alt="" aria-hidden />
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={onExport}
            title="Export JSON"
            aria-label="Export funnel JSON"
          >
            <img src={exportIcon} alt="" aria-hidden />
          </button>
          <span className="canvas__actions-divider" aria-hidden />
          <button
            type="button"
            className="icon-button"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo"
            aria-label="Undo last change"
          >
            <img src={undoIcon} alt="" aria-hidden />
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo"
            aria-label="Redo last change"
          >
            <img src={redoIcon} alt="" aria-hidden />
          </button>
          <span className="canvas__actions-divider" aria-hidden />
          <button
            type="button"
            className="icon-button icon-button--danger"
            onClick={onReset}
            title="Reset"
            aria-label="Reset builder"
          >
            <img src={resetIcon} alt="" aria-hidden />
          </button>
          <input
            ref={importInputRef}
            className="visually-hidden"
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
        </div>
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
          edgeTypes={edgeTypes}
          onInit={setReactFlowInstance}
          onNodesChange={applyNodeChanges}
          onEdgesChange={applyEdgeChanges}
          onNodeDragStart={() => {
            // Capture snapshot before drag starts
            dragSnapshotRef.current = {
              nodes: JSON.parse(JSON.stringify(nodes)),
              edges: JSON.parse(JSON.stringify(edges)),
            }
          }}
          onNodeDragStop={() => {
            // Save the snapshot to history when drag ends
            if (dragSnapshotRef.current) {
              savePositionSnapshot(dragSnapshotRef.current)
              dragSnapshotRef.current = null
            }
          }}
          onConnect={(connection) => {
            if (connection.source && connection.target) {
              const sourceNode = nodeById[connection.source]
              if (sourceNode?.data.type === 'thankyou') {
                return
              }
              onConnect(connection.source, connection.target)
            }
          }}
          panOnDrag
          defaultEdgeOptions={{
            type: 'deletable',
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
  )
}
