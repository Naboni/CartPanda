import { describe, it, expect } from 'vitest'
import { funnelStateSchema } from './funnelSchema'

describe('funnelStateSchema', () => {
  describe('valid data', () => {
    it('should accept valid funnel state', () => {
      const validState = {
        nodes: [
          {
            id: 'node_1',
            type: 'sales',
            position: { x: 100, y: 200 },
            data: {
              type: 'sales',
              title: 'Sales Page',
              buttonLabel: 'View Offer',
            },
          },
        ],
        edges: [
          {
            id: 'edge_1',
            source: 'node_1',
            target: 'node_2',
          },
        ],
      }

      const result = funnelStateSchema.safeParse(validState)
      expect(result.success).toBe(true)
    })

    it('should accept empty state', () => {
      const emptyState = {
        nodes: [],
        edges: [],
      }

      const result = funnelStateSchema.safeParse(emptyState)
      expect(result.success).toBe(true)
    })

    it('should accept all node types', () => {
      const nodeTypes = ['sales', 'order', 'upsell', 'downsell', 'thankyou']
      
      nodeTypes.forEach((type) => {
        const state = {
          nodes: [
            {
              id: `node_${type}`,
              type,
              position: { x: 0, y: 0 },
              data: { type, title: `${type} Page`, buttonLabel: 'Button' },
            },
          ],
          edges: [],
        }

        const result = funnelStateSchema.safeParse(state)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('invalid data', () => {
    it('should reject invalid node type', () => {
      const invalidState = {
        nodes: [
          {
            id: 'node_1',
            type: 'invalid_type',
            position: { x: 0, y: 0 },
            data: { type: 'invalid_type', title: 'Bad', buttonLabel: 'Button' },
          },
        ],
        edges: [],
      }

      const result = funnelStateSchema.safeParse(invalidState)
      expect(result.success).toBe(false)
    })

    it('should reject missing required fields', () => {
      const missingFields = {
        nodes: [
          {
            id: 'node_1',
            // missing type, position, data
          },
        ],
        edges: [],
      }

      const result = funnelStateSchema.safeParse(missingFields)
      expect(result.success).toBe(false)
    })

    it('should reject invalid position format', () => {
      const invalidPosition = {
        nodes: [
          {
            id: 'node_1',
            type: 'sales',
            position: { x: 'not a number', y: 0 },
            data: { type: 'sales', title: 'Sales', buttonLabel: 'Button' },
          },
        ],
        edges: [],
      }

      const result = funnelStateSchema.safeParse(invalidPosition)
      expect(result.success).toBe(false)
    })

    it('should reject non-object input', () => {
      expect(funnelStateSchema.safeParse(null).success).toBe(false)
      expect(funnelStateSchema.safeParse(undefined).success).toBe(false)
      expect(funnelStateSchema.safeParse('string').success).toBe(false)
      expect(funnelStateSchema.safeParse(123).success).toBe(false)
    })

    it('should reject missing nodes or edges arrays', () => {
      expect(funnelStateSchema.safeParse({ nodes: [] }).success).toBe(false)
      expect(funnelStateSchema.safeParse({ edges: [] }).success).toBe(false)
      expect(funnelStateSchema.safeParse({}).success).toBe(false)
    })
  })
})
