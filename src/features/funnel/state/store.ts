import { addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow'
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

const createNode = (
  type: NodeType,
  position: { x: number; y: number },
  index?: number,
): FunnelNode => {
  const id = `node_${idCounter++}`
  const title =
    type === 'upsell'
      ? `${typeTitles[type]} ${index ?? 1}`
      : type === 'downsell'
        ? `${typeTitles[type]} ${index ?? 1}`
        : typeTitles[type]
  const data: FunnelNodeData = {
    type,
    title,
    buttonLabel: buttonLabels[type],
    index,
  }

  return {
    id,
    type,
    position,
    data,
  }
}

const initialState: Pick<FunnelState, 'nodes' | 'edges'> = {
  nodes: [],
  edges: [],
}

const MAX_HISTORY = 50

type HistoryState = {
  past: Array<Pick<FunnelState, 'nodes' | 'edges'>>
  future: Array<Pick<FunnelState, 'nodes' | 'edges'>>
}

const historyState: HistoryState = {
  past: [],
  future: [],
}

const pushHistory = (
  prev: Pick<FunnelState, 'nodes' | 'edges'>,
  next: Pick<FunnelState, 'nodes' | 'edges'>,
  history: HistoryState,
) => {
  const updatedPast = [...history.past, prev].slice(-MAX_HISTORY)
  return {
    past: updatedPast,
    future: [],
    next,
  }
}

export const useFunnelStore = create<FunnelState>((set) => ({
  ...initialState,
  canUndo: false,
  canRedo: false,
  applyNodeChanges: (changes) =>
    set((state) => {
      const removedIds = changes
        .filter((change) => change.type === 'remove')
        .map((change) => change.id)
      const nextNodes = applyNodeChanges(changes, state.nodes)
      const nextEdges =
        removedIds.length > 0
          ? state.edges.filter(
              (edge) => !removedIds.includes(edge.source) && !removedIds.includes(edge.target),
            )
          : state.edges
      const historyUpdate = pushHistory(
        { nodes: state.nodes, edges: state.edges },
        { nodes: nextNodes, edges: nextEdges },
        historyState,
      )
      historyState.past = historyUpdate.past
      historyState.future = historyUpdate.future

      return {
        nodes: historyUpdate.next.nodes,
        edges: historyUpdate.next.edges,
        canUndo: historyState.past.length > 0,
        canRedo: historyState.future.length > 0,
      }
    }),
  applyEdgeChanges: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
      canUndo: historyState.past.length > 0,
      canRedo: historyState.future.length > 0,
    })),
  removeNode: (id) =>
    set((state) => {
      const next = {
        nodes: state.nodes.filter((node) => node.id !== id),
        edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
      }
      const historyUpdate = pushHistory(
        { nodes: state.nodes, edges: state.edges },
        next,
        historyState,
      )
      historyState.past = historyUpdate.past
      historyState.future = historyUpdate.future

      return {
        ...next,
        canUndo: historyState.past.length > 0,
        canRedo: historyState.future.length > 0,
      }
    }),
  removeEdge: (id) =>
    set((state) => {
      const next = {
        nodes: state.nodes,
        edges: state.edges.filter((edge) => edge.id !== id),
      }
      const historyUpdate = pushHistory(
        { nodes: state.nodes, edges: state.edges },
        next,
        historyState,
      )
      historyState.past = historyUpdate.past
      historyState.future = historyUpdate.future

      return {
        ...next,
        canUndo: historyState.past.length > 0,
        canRedo: historyState.future.length > 0,
      }
    }),
  addNode: (type, position) =>
    set((state) => {
      const nextIndex =
        type === 'upsell' || type === 'downsell'
          ? state.nodes.filter((node) => node.data.type === type).length + 1
          : undefined
      const next = {
        nodes: [...state.nodes, createNode(type, position, nextIndex)],
        edges: state.edges,
      }
      const historyUpdate = pushHistory(
        { nodes: state.nodes, edges: state.edges },
        next,
        historyState,
      )
      historyState.past = historyUpdate.past
      historyState.future = historyUpdate.future

      return {
        ...next,
        canUndo: historyState.past.length > 0,
        canRedo: historyState.future.length > 0,
      }
    }),
  updateNodePosition: (id, position) =>
    set((state) => {
      const next = {
        nodes: state.nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                position,
              }
            : node,
        ),
        edges: state.edges,
      }
      const historyUpdate = pushHistory(
        { nodes: state.nodes, edges: state.edges },
        next,
        historyState,
      )
      historyState.past = historyUpdate.past
      historyState.future = historyUpdate.future

      return {
        ...next,
        canUndo: historyState.past.length > 0,
        canRedo: historyState.future.length > 0,
      }
    }),
  onConnect: (source, target) =>
    set((state) => {
      const next = {
        nodes: state.nodes,
        edges: addEdge({ source, target }, state.edges),
      }
      const historyUpdate = pushHistory(
        { nodes: state.nodes, edges: state.edges },
        next,
        historyState,
      )
      historyState.past = historyUpdate.past
      historyState.future = historyUpdate.future

      return {
        ...next,
        canUndo: historyState.past.length > 0,
        canRedo: historyState.future.length > 0,
      }
    }),
  undo: () =>
    set((state) => {
      const previous = historyState.past[historyState.past.length - 1]
      if (!previous) {
        return state
      }
      historyState.past = historyState.past.slice(0, -1)
      historyState.future = [{ nodes: state.nodes, edges: state.edges }, ...historyState.future]
      return {
        ...previous,
        canUndo: historyState.past.length > 0,
        canRedo: historyState.future.length > 0,
      }
    }),
  redo: () =>
    set((state) => {
      const next = historyState.future[0]
      if (!next) {
        return state
      }
      historyState.future = historyState.future.slice(1)
      historyState.past = [...historyState.past, { nodes: state.nodes, edges: state.edges }].slice(
        -MAX_HISTORY,
      )
      return {
        ...next,
        canUndo: historyState.past.length > 0,
        canRedo: historyState.future.length > 0,
      }
    }),
  setState: (importedState) =>
    set(() => {
      historyState.past = []
      historyState.future = []
      return {
        nodes: importedState.nodes,
        edges: importedState.edges,
        canUndo: false,
        canRedo: false,
      }
    }),
  reset: () =>
    set(() => {
      historyState.past = []
      historyState.future = []
      return {
        ...initialState,
        canUndo: false,
        canRedo: false,
      }
    }),
}))
