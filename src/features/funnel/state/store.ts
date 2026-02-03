import { addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow'
import { create } from 'zustand'

import type { FunnelNode, FunnelNodeData, FunnelState, NodeType } from '../types'

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

const MAX_HISTORY = 50

type Snapshot = { nodes: FunnelNode[]; edges: FunnelState['edges'] }

type StoreState = FunnelState & {
  past: Snapshot[]
  future: Snapshot[]
}

const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))

const takeSnapshot = (state: StoreState): Snapshot => ({
  nodes: deepClone(state.nodes),
  edges: deepClone(state.edges),
})

const initialState = {
  nodes: [] as FunnelNode[],
  edges: [] as FunnelState['edges'],
  past: [] as Snapshot[],
  future: [] as Snapshot[],
  canUndo: false,
  canRedo: false,
}

export const useFunnelStore = create<StoreState>((set, get) => ({
  ...initialState,

  applyNodeChanges: (changes) => {
    const state = get()
    const removedIds = changes
      .filter((change) => change.type === 'remove')
      .map((change) => change.id)

    // If there are removals (e.g., from backspace key), create history
    if (removedIds.length > 0) {
      const snapshot = takeSnapshot(state)
      const nextNodes = applyNodeChanges(changes, state.nodes)
      const nextEdges = state.edges.filter(
        (edge) => !removedIds.includes(edge.source) && !removedIds.includes(edge.target),
      )
      const newPast = [...state.past, snapshot].slice(-MAX_HISTORY)

      set({
        nodes: nextNodes,
        edges: nextEdges,
        past: newPast,
        future: [],
        canUndo: newPast.length > 0,
        canRedo: false,
      })
      return
    }

    // For non-removal changes (drag, select, etc.), just apply without history
    const nextNodes = applyNodeChanges(changes, state.nodes)
    set({
      nodes: nextNodes,
    })
  },

  applyEdgeChanges: (changes) => {
    const state = get()
    const hasRemoval = changes.some((change) => change.type === 'remove')

    // If there are removals (e.g., from backspace key), create history
    if (hasRemoval) {
      const snapshot = takeSnapshot(state)
      const nextEdges = applyEdgeChanges(changes, state.edges)
      const newPast = [...state.past, snapshot].slice(-MAX_HISTORY)

      set({
        edges: nextEdges,
        past: newPast,
        future: [],
        canUndo: newPast.length > 0,
        canRedo: false,
      })
      return
    }

    // For non-removal changes, just apply without history
    const nextEdges = applyEdgeChanges(changes, state.edges)
    set({
      edges: nextEdges,
    })
  },

  removeNode: (id) => {
    const state = get()
    const snapshot = takeSnapshot(state)
    const nextNodes = state.nodes.filter((node) => node.id !== id)
    const nextEdges = state.edges.filter(
      (edge) => edge.source !== id && edge.target !== id,
    )
    const newPast = [...state.past, snapshot].slice(-MAX_HISTORY)

    set({
      nodes: nextNodes,
      edges: nextEdges,
      past: newPast,
      future: [],
      canUndo: newPast.length > 0,
      canRedo: false,
    })
  },

  removeEdge: (id) => {
    const state = get()
    const snapshot = takeSnapshot(state)
    const nextEdges = state.edges.filter((edge) => edge.id !== id)
    const newPast = [...state.past, snapshot].slice(-MAX_HISTORY)

    set({
      edges: nextEdges,
      past: newPast,
      future: [],
      canUndo: newPast.length > 0,
      canRedo: false,
    })
  },

  addNode: (type, position) => {
    const state = get()
    const snapshot = takeSnapshot(state)
    const nextIndex =
      type === 'upsell' || type === 'downsell'
        ? state.nodes.filter((node) => node.data.type === type).length + 1
        : undefined
    const newNode = createNode(type, position, nextIndex)
    const newPast = [...state.past, snapshot].slice(-MAX_HISTORY)

    set({
      nodes: [...state.nodes, newNode],
      past: newPast,
      future: [],
      canUndo: newPast.length > 0,
      canRedo: false,
    })
  },

  updateNodePosition: (id, position) => {
    const state = get()
    set({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, position } : node,
      ),
    })
  },

  updateNodeTitle: (id, title) => {
    const state = get()
    const snapshot = takeSnapshot(state)
    const nextNodes = state.nodes.map((node) =>
      node.id === id
        ? { ...node, data: { ...node.data, title } }
        : node,
    )
    const newPast = [...state.past, snapshot].slice(-MAX_HISTORY)

    set({
      nodes: nextNodes,
      past: newPast,
      future: [],
      canUndo: newPast.length > 0,
      canRedo: false,
    })
  },

  onConnect: (source, target) => {
    const state = get()
    const snapshot = takeSnapshot(state)
    const nextEdges = addEdge(
      { source, target, sourceHandle: null, targetHandle: null },
      state.edges,
    )
    const newPast = [...state.past, snapshot].slice(-MAX_HISTORY)

    set({
      edges: nextEdges,
      past: newPast,
      future: [],
      canUndo: newPast.length > 0,
      canRedo: false,
    })
  },

  undo: () => {
    const state = get()
    if (state.past.length === 0) return

    const previous = state.past[state.past.length - 1]
    const newPast = state.past.slice(0, -1)
    const snapshot = takeSnapshot(state)

    set({
      nodes: deepClone(previous.nodes),
      edges: deepClone(previous.edges),
      past: newPast,
      future: [snapshot, ...state.future],
      canUndo: newPast.length > 0,
      canRedo: true,
    })
  },

  redo: () => {
    const state = get()
    if (state.future.length === 0) return

    const next = state.future[0]
    const newFuture = state.future.slice(1)
    const snapshot = takeSnapshot(state)
    const newPast = [...state.past, snapshot].slice(-MAX_HISTORY)

    set({
      nodes: deepClone(next.nodes),
      edges: deepClone(next.edges),
      past: newPast,
      future: newFuture,
      canUndo: newPast.length > 0,
      canRedo: newFuture.length > 0,
    })
  },

  setState: (importedState) => {
    // Update idCounter based on imported nodes
    const maxId = importedState.nodes.reduce((max, node) => {
      const match = node.id.match(/node_(\d+)/)
      return match ? Math.max(max, parseInt(match[1], 10)) : max
    }, 0)
    idCounter = maxId + 1

    set({
      nodes: deepClone(importedState.nodes),
      edges: deepClone(importedState.edges),
      past: [],
      future: [],
      canUndo: false,
      canRedo: false,
    })
  },

  reset: () => {
    idCounter = 1
    set({
      ...initialState,
    })
  },

  savePositionSnapshot: (snapshotBefore) => {
    const state = get()
    // Only save if something actually changed
    const positionsChanged = snapshotBefore.nodes.some((oldNode) => {
      const newNode = state.nodes.find((n) => n.id === oldNode.id)
      if (!newNode) return true
      return (
        oldNode.position.x !== newNode.position.x ||
        oldNode.position.y !== newNode.position.y
      )
    })

    if (!positionsChanged) return

    const newPast = [...state.past, deepClone(snapshotBefore)].slice(-MAX_HISTORY)

    set({
      past: newPast,
      future: [],
      canUndo: newPast.length > 0,
      canRedo: false,
    })
  },
}))
