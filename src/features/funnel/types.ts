import type { Edge, Node, XYPosition } from 'reactflow'

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
  addNode: (type: NodeType, position: XYPosition) => void
  updateNodePosition: (id: string, position: XYPosition) => void
  onConnect: (source: string, target: string) => void
  setState: (importedState: Pick<FunnelState, 'nodes' | 'edges'>) => void
  reset: () => void
}
