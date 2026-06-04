import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { ChartEntry } from '../types';

const COLORS = [
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#14b8a6', '#06b6d4', '#0ea5e9', '#2563eb',
];

interface Props {
  data: ChartEntry[];
  top?: number;
}

export function OperateursChart({ data, top = 15 }: Props) {
  const sliced = data.slice(0, top);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Top {top} Opérateurs</h3>
      <p className="text-sm text-gray-500 mb-4">Nombre de domaines par opérateur MSSanté</p>
      <ResponsiveContainer width="100%" height={450}>
        <BarChart data={sliced} layout="vertical" margin={{ left: 20, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis
            dataKey="name"
            type="category"
            width={220}
            tick={{ fontSize: 11 }}
            tickFormatter={(v: string) => v.length > 30 ? v.slice(0, 28) + '…' : v}
          />
          <Tooltip
            formatter={(value) => [Number(value).toLocaleString('fr-FR'), 'Domaines']}
            contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {sliced.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
