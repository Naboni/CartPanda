import type { NodeProps } from 'reactflow'

import type { FunnelNodeData } from '../../types'
import { BaseNode } from './BaseNode'

type FunnelNodeProps = NodeProps<FunnelNodeData>

export const nodeTypes = {
  sales: ({ data, id, selected }: FunnelNodeProps) => (
    <BaseNode id={id} data={data} accentColor="#2563eb" selected={selected} />
  ),
  order: ({ data, id, selected }: FunnelNodeProps) => (
    <BaseNode id={id} data={data} accentColor="#16a34a" selected={selected} />
  ),
  upsell: ({ data, id, selected }: FunnelNodeProps) => (
    <BaseNode id={id} data={data} accentColor="#f97316" selected={selected} />
  ),
  downsell: ({ data, id, selected }: FunnelNodeProps) => (
    <BaseNode id={id} data={data} accentColor="#db2777" selected={selected} />
  ),
  thankyou: ({ data, id, selected }: FunnelNodeProps) => (
    <BaseNode id={id} data={data} accentColor="#64748b" showSource={false} selected={selected} />
  ),
}
