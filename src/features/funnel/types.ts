import type { Edge, EdgeChange, Node, NodeChange, XYPosition } from 'reactflow'

export type NodeType = 'sales' | 'order' | 'upsell' | 'downsell' | 'thankyou'

export type FunnelNodeData = {
  type: NodeType
  title: string
  buttonLabel: string
  index?: number
}

export type FunnelNode = Node<FunnelNodeData>
export type FunnelEdge = Edge

export type FunnelState = {
  nodes: FunnelNode[]
  edges: FunnelEdge[]
  applyNodeChanges: (changes: NodeChange[]) => void
  applyEdgeChanges: (changes: EdgeChange[]) => void
  removeNode: (id: string) => void
  removeEdge: (id: string) => void
  addNode: (type: NodeType, position: XYPosition) => void
  updateNodePosition: (id: string, position: XYPosition) => void
  onConnect: (source: string, target: string) => void
  setState: (importedState: Pick<FunnelState, 'nodes' | 'edges'>) => void
  reset: () => void
}
