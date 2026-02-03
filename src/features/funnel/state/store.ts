import { addEdge } from 'reactflow'
import { create } from 'zustand'

import type { FunnelEdge, FunnelNode, FunnelNodeData, FunnelState, NodeType } from '../types'

let idCounter = 1

const typeTitles: Record<NodeType, string> = {
  sales: 'Sales Page',
  order: 'Order Page',
  upsell: 'Upsell',
  downsell: 'Downsell',
  thankyou: 'Thank You',
}

const buttonLabels: Record<NodeType, string> = {
  sales: 'View Offer',
  order: 'Complete Order',
  upsell: 'Add Upsell',
  downsell: 'Accept Offer',
  thankyou: 'Done',
}

const createNode = (type: NodeType, position: { x: number; y: number }): FunnelNode => {
  const id = `node_${idCounter++}`
  const data: FunnelNodeData = {
    type,
    title: typeTitles[type],
    buttonLabel: buttonLabels[type],
  }

  return {
    id,
    type,
    position,
    data,
  }
}

const initialState: Pick<FunnelState, 'nodes' | 'edges'> = {
  nodes: [createNode('sales', { x: 80, y: 120 }), createNode('order', { x: 380, y: 120 })],
  edges: [],
}

export const useFunnelStore = create<FunnelState>((set) => ({
  ...initialState,
  addNode: (type, position) =>
    set((state) => ({
      nodes: [...state.nodes, createNode(type, position)],
    })),
  updateNodePosition: (id, position) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              position,
            }
          : node,
      ),
    })),
  onConnect: (source, target) =>
    set((state) => ({
      edges: addEdge({ source, target }, state.edges),
    })),
  setState: (importedState) =>
    set(() => ({
      nodes: importedState.nodes,
      edges: importedState.edges,
    })),
  reset: () =>
    set(() => ({
      ...initialState,
    })),
}))
