import { describe, it, expect, beforeEach } from 'vitest'
import { useFunnelStore } from './store'

describe('Funnel Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useFunnelStore.getState().reset()
  })

  describe('addNode', () => {
    it('should add a node to the store', () => {
      const { addNode } = useFunnelStore.getState()
      
      addNode('sales', { x: 100, y: 200 })
      
      const { nodes } = useFunnelStore.getState()
      expect(nodes).toHaveLength(1)
      expect(nodes[0].data.type).toBe('sales')
      expect(nodes[0].data.title).toBe('Sales Page')
      expect(nodes[0].position).toEqual({ x: 100, y: 200 })
    })

    it('should auto-increment upsell titles', () => {
      const { addNode } = useFunnelStore.getState()
      
      addNode('upsell', { x: 0, y: 0 })
      addNode('upsell', { x: 100, y: 0 })
      addNode('upsell', { x: 200, y: 0 })
      
      const { nodes } = useFunnelStore.getState()
      expect(nodes[0].data.title).toBe('Upsell 1')
      expect(nodes[1].data.title).toBe('Upsell 2')
      expect(nodes[2].data.title).toBe('Upsell 3')
    })

    it('should auto-increment downsell titles', () => {
      const { addNode } = useFunnelStore.getState()
      
      addNode('downsell', { x: 0, y: 0 })
      addNode('downsell', { x: 100, y: 0 })
      
      const { nodes } = useFunnelStore.getState()
      expect(nodes[0].data.title).toBe('Downsell 1')
      expect(nodes[1].data.title).toBe('Downsell 2')
    })

    it('should enable undo after adding node', () => {
      const { addNode } = useFunnelStore.getState()
      
      expect(useFunnelStore.getState().canUndo).toBe(false)
      addNode('sales', { x: 0, y: 0 })
      expect(useFunnelStore.getState().canUndo).toBe(true)
    })
  })

  describe('removeNode', () => {
    it('should remove a node from the store', () => {
      const { addNode, removeNode } = useFunnelStore.getState()
      
      addNode('sales', { x: 0, y: 0 })
      const nodeId = useFunnelStore.getState().nodes[0].id
      
      removeNode(nodeId)
      
      expect(useFunnelStore.getState().nodes).toHaveLength(0)
    })

    it('should remove connected edges when node is removed', () => {
      const { addNode, onConnect, removeNode } = useFunnelStore.getState()
      
      addNode('sales', { x: 0, y: 0 })
      addNode('order', { x: 200, y: 0 })
      
      const nodes = useFunnelStore.getState().nodes
      onConnect(nodes[0].id, nodes[1].id)
      
      expect(useFunnelStore.getState().edges).toHaveLength(1)
      
      removeNode(nodes[0].id)
      
      expect(useFunnelStore.getState().edges).toHaveLength(0)
    })
  })

  describe('updateNodeTitle', () => {
    it('should update a node title', () => {
      const { addNode, updateNodeTitle } = useFunnelStore.getState()
      
      addNode('sales', { x: 0, y: 0 })
      const nodeId = useFunnelStore.getState().nodes[0].id
      
      updateNodeTitle(nodeId, 'My Custom Title')
      
      expect(useFunnelStore.getState().nodes[0].data.title).toBe('My Custom Title')
    })
  })

  describe('onConnect', () => {
    it('should create an edge between two nodes', () => {
      const { addNode, onConnect } = useFunnelStore.getState()
      
      addNode('sales', { x: 0, y: 0 })
      addNode('order', { x: 200, y: 0 })
      
      const nodes = useFunnelStore.getState().nodes
      onConnect(nodes[0].id, nodes[1].id)
      
      const { edges } = useFunnelStore.getState()
      expect(edges).toHaveLength(1)
      expect(edges[0].source).toBe(nodes[0].id)
      expect(edges[0].target).toBe(nodes[1].id)
    })
  })

  describe('undo/redo', () => {
    it('should undo adding a node', () => {
      const { addNode, undo } = useFunnelStore.getState()
      
      addNode('sales', { x: 0, y: 0 })
      expect(useFunnelStore.getState().nodes).toHaveLength(1)
      
      undo()
      expect(useFunnelStore.getState().nodes).toHaveLength(0)
    })

    it('should redo after undo', () => {
      const { addNode, undo, redo } = useFunnelStore.getState()
      
      addNode('sales', { x: 0, y: 0 })
      undo()
      expect(useFunnelStore.getState().nodes).toHaveLength(0)
      
      redo()
      expect(useFunnelStore.getState().nodes).toHaveLength(1)
    })

    it('should track canUndo and canRedo correctly', () => {
      const { addNode, undo, redo } = useFunnelStore.getState()
      
      expect(useFunnelStore.getState().canUndo).toBe(false)
      expect(useFunnelStore.getState().canRedo).toBe(false)
      
      addNode('sales', { x: 0, y: 0 })
      expect(useFunnelStore.getState().canUndo).toBe(true)
      expect(useFunnelStore.getState().canRedo).toBe(false)
      
      undo()
      expect(useFunnelStore.getState().canUndo).toBe(false)
      expect(useFunnelStore.getState().canRedo).toBe(true)
      
      redo()
      expect(useFunnelStore.getState().canUndo).toBe(true)
      expect(useFunnelStore.getState().canRedo).toBe(false)
    })

    it('should clear future history when new action is performed after undo', () => {
      const { addNode, undo } = useFunnelStore.getState()
      
      addNode('sales', { x: 0, y: 0 })
      addNode('order', { x: 200, y: 0 })
      
      undo()
      expect(useFunnelStore.getState().canRedo).toBe(true)
      
      addNode('upsell', { x: 400, y: 0 })
      expect(useFunnelStore.getState().canRedo).toBe(false)
    })
  })

  describe('setState', () => {
    it('should set state from imported data', () => {
      const { setState } = useFunnelStore.getState()
      
      const importedState = {
        nodes: [
          {
            id: 'node_1',
            type: 'sales' as const,
            position: { x: 50, y: 100 },
            data: { type: 'sales' as const, title: 'Imported Sales', buttonLabel: 'Buy Now' },
          },
        ],
        edges: [],
      }
      
      setState(importedState)
      
      const { nodes } = useFunnelStore.getState()
      expect(nodes).toHaveLength(1)
      expect(nodes[0].data.title).toBe('Imported Sales')
    })

    it('should clear history when setting state', () => {
      const { addNode, setState } = useFunnelStore.getState()
      
      addNode('sales', { x: 0, y: 0 })
      expect(useFunnelStore.getState().canUndo).toBe(true)
      
      setState({ nodes: [], edges: [] })
      expect(useFunnelStore.getState().canUndo).toBe(false)
    })
  })

  describe('reset', () => {
    it('should reset to initial state', () => {
      const { addNode, reset } = useFunnelStore.getState()
      
      addNode('sales', { x: 0, y: 0 })
      addNode('order', { x: 200, y: 0 })
      
      reset()
      
      const { nodes, edges, canUndo, canRedo } = useFunnelStore.getState()
      expect(nodes).toHaveLength(0)
      expect(edges).toHaveLength(0)
      expect(canUndo).toBe(false)
      expect(canRedo).toBe(false)
    })
  })
})
