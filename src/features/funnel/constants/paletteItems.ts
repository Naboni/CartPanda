import type { NodeType } from '../types'

export const paletteItems: Array<{ type: NodeType; label: string }> = [
  { type: 'sales', label: 'Sales Page' },
  { type: 'order', label: 'Order Page' },
  { type: 'upsell', label: 'Upsell' },
  { type: 'downsell', label: 'Downsell' },
  { type: 'thankyou', label: 'Thank You' },
]
