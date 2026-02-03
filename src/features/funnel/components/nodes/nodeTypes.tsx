import type { NodeProps } from 'reactflow'

import type { FunnelNodeData } from '../../types'
import { BaseNode } from './BaseNode'

type FunnelNodeProps = NodeProps<FunnelNodeData>

export const nodeTypes = {
  sales: ({ data }: FunnelNodeProps) => <BaseNode data={data} accentColor="#2563eb" />,
  order: ({ data }: FunnelNodeProps) => <BaseNode data={data} accentColor="#16a34a" />,
  upsell: ({ data }: FunnelNodeProps) => <BaseNode data={data} accentColor="#f97316" />,
  downsell: ({ data }: FunnelNodeProps) => <BaseNode data={data} accentColor="#db2777" />,
  thankyou: ({ data }: FunnelNodeProps) => (
    <BaseNode data={data} accentColor="#64748b" showSource={false} />
  ),
}
