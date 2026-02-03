import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useFunnelValidation } from './useFunnelValidation'
import type { FunnelNode, FunnelEdge } from '../types'

// Helper to create test nodes
const createNode = (
  id: string,
  type: 'sales' | 'order' | 'upsell' | 'downsell' | 'thankyou',
): FunnelNode => ({
  id,
  type,
  position: { x: 0, y: 0 },
  data: { type, title: `${type} node`, buttonLabel: 'Button' },
})

// Helper to create test edges
const createEdge = (source: string, target: string): FunnelEdge => ({
  id: `${source}-${target}`,
  source,
  target,
})

describe('useFunnelValidation', () => {
  describe('Thank You page validation', () => {
    it('should return error when Thank You page has outgoing connection', () => {
      const nodes = [createNode('1', 'thankyou'), createNode('2', 'order')]
      const edges = [createEdge('1', '2')]

      const { result } = renderHook(() => useFunnelValidation(nodes, edges))

      expect(result.current.errors).toContain(
        'Thank You pages cannot have outgoing connections.',
      )
    })

    it('should not return error when Thank You page has no outgoing connections', () => {
      const nodes = [createNode('1', 'sales'), createNode('2', 'thankyou')]
      const edges = [createEdge('1', '2')]

      const { result } = renderHook(() => useFunnelValidation(nodes, edges))

      expect(result.current.errors).not.toContain(
        'Thank You pages cannot have outgoing connections.',
      )
    })
  })

  describe('Sales page validation', () => {
    it('should return warning when Sales Page has no outgoing connections', () => {
      const nodes = [createNode('1', 'sales')]
      const edges: FunnelEdge[] = []

      const { result } = renderHook(() => useFunnelValidation(nodes, edges))

      expect(result.current.warnings).toContain(
        'Sales Page should have exactly one outgoing connection.',
      )
    })

    it('should return warning when Sales Page has multiple outgoing connections', () => {
      const nodes = [
        createNode('1', 'sales'),
        createNode('2', 'order'),
        createNode('3', 'order'),
      ]
      const edges = [createEdge('1', '2'), createEdge('1', '3')]

      const { result } = renderHook(() => useFunnelValidation(nodes, edges))

      expect(result.current.warnings).toContain(
        'Sales Page should have exactly one outgoing connection.',
      )
    })

    it('should return warning when Sales Page connects to non-Order page', () => {
      const nodes = [createNode('1', 'sales'), createNode('2', 'upsell')]
      const edges = [createEdge('1', '2')]

      const { result } = renderHook(() => useFunnelValidation(nodes, edges))

      expect(result.current.warnings).toContain(
        'Sales Page should connect to an Order Page.',
      )
    })

    it('should not return warnings when Sales Page correctly connects to Order page', () => {
      const nodes = [createNode('1', 'sales'), createNode('2', 'order')]
      const edges = [createEdge('1', '2')]

      const { result } = renderHook(() => useFunnelValidation(nodes, edges))

      expect(result.current.warnings).toHaveLength(0)
    })
  })

  describe('nodeById helper', () => {
    it('should create a lookup map of nodes by id', () => {
      const nodes = [
        createNode('a', 'sales'),
        createNode('b', 'order'),
        createNode('c', 'thankyou'),
      ]
      const edges: FunnelEdge[] = []

      const { result } = renderHook(() => useFunnelValidation(nodes, edges))

      expect(result.current.nodeById['a']).toBeDefined()
      expect(result.current.nodeById['b']).toBeDefined()
      expect(result.current.nodeById['c']).toBeDefined()
      expect(result.current.nodeById['a'].data.type).toBe('sales')
    })
  })

  describe('empty state', () => {
    it('should return no errors or warnings for empty canvas', () => {
      const nodes: FunnelNode[] = []
      const edges: FunnelEdge[] = []

      const { result } = renderHook(() => useFunnelValidation(nodes, edges))

      expect(result.current.errors).toHaveLength(0)
      expect(result.current.warnings).toHaveLength(0)
    })
  })
})
