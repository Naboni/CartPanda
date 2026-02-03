import { z } from 'zod'

const nodeTypeSchema = z.enum(['sales', 'order', 'upsell', 'downsell', 'thankyou'])

const nodeDataSchema = z
  .object({
    type: nodeTypeSchema,
    title: z.string(),
    buttonLabel: z.string(),
    index: z.number().optional(),
  })
  .passthrough()

const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
})

const nodeSchema = z
  .object({
    id: z.string(),
    type: nodeTypeSchema,
    position: positionSchema,
    data: nodeDataSchema,
  })
  .passthrough()

const edgeSchema = z
  .object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
  })
  .passthrough()

export const funnelStateSchema = z.object({
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
})
