import { useMemo } from 'react'

import type { FunnelEdge, FunnelNode } from '../types'

export function useFunnelValidation(nodes: FunnelNode[], edges: FunnelEdge[]) {
  return useMemo(() => {
    const errors: string[] = []
    const warnings: string[] = []

    const nodeById = nodes.reduce<Record<string, FunnelNode>>((acc, node) => {
      acc[node.id] = node
      return acc
    }, {})

    edges.forEach((edge) => {
      const sourceNode = nodeById[edge.source]
      if (sourceNode?.data.type === 'thankyou') {
        errors.push('Thank You pages cannot have outgoing connections.')
      }
    })

    const salesNode = nodes.find((node) => node.data.type === 'sales')
    if (salesNode) {
      const salesEdges = edges.filter((edge) => edge.source === salesNode.id)
      if (salesEdges.length !== 1) {
        warnings.push('Sales Page should have exactly one outgoing connection.')
      } else {
        const targetNode = nodeById[salesEdges[0]?.target]
        if (targetNode?.data.type !== 'order') {
          warnings.push('Sales Page should connect to an Order Page.')
        }
      }
    }

    return { errors, warnings, nodeById }
  }, [edges, nodes])
}
