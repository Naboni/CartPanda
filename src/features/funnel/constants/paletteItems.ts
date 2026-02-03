import type { NodeType } from '../types'
import { nodeColors } from './nodeColors'

export const paletteItems: Array<{ type: NodeType; label: string; color: string }> = [
  { type: 'sales', label: 'Sales Page', color: nodeColors.sales },
  { type: 'order', label: 'Order Page', color: nodeColors.order },
  { type: 'upsell', label: 'Upsell', color: nodeColors.upsell },
  { type: 'downsell', label: 'Downsell', color: nodeColors.downsell },
  { type: 'thankyou', label: 'Thank You', color: nodeColors.thankyou },
]
