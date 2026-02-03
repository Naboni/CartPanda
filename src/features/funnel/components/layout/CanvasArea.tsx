import { useMemo, useRef, useState } from 'react'
import ReactFlow, { Background, MarkerType, type EdgeChange, type NodeChange, type ReactFlowInstance } from 'reactflow'

import { edgeTypes } from '../edges/edgeTypes'
import { nodeTypes } from '../nodes/nodeTypes'
import type { FunnelEdge, FunnelNode, FunnelState, NodeType } from '../../types'

type CanvasAreaProps = {
  nodes: FunnelNode[]
  edges: FunnelEdge[]
  nodeById: Record<string, FunnelNode>
  addNode: (type: NodeType, position: { x: number; y: number }) => void
  applyNodeChanges: (changes: NodeChange[]) => void
  applyEdgeChanges: (changes: EdgeChange[]) => void
  onConnect: (source: string, target: string) => void
  savePositionSnapshot: (snapshot: Pick<FunnelState, 'nodes' | 'edges'>) => void
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
}: CanvasAreaProps) {
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const hasNodes = useMemo(() => nodes.length > 0, [nodes.length])
  const dragSnapshotRef = useRef<Pick<FunnelState, 'nodes' | 'edges'> | null>(null)

  return (
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
