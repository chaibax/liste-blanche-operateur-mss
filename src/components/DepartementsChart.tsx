import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ChartEntry } from '../types';

const COLORS = [
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#14b8a6', '#06b6d4', '#0ea5e9', '#64748b',
];

interface Props {
  data: ChartEntry[];
  top?: number;
}

export function DepartementsChart({ data, top = 12 }: Props) {
  const topItems = data.slice(0, top);
  const otherTotal = data.slice(top).reduce((s, d) => s + d.value, 0);
  const chartData = otherTotal > 0
    ? [...topItems, { name: `Autres (${data.length - top})`, value: otherTotal }]
    : topItems;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Répartition par Département</h3>
      <p className="text-sm text-gray-500 mb-4">Localisation des opérateurs de messagerie</p>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={140}
            innerRadius={60}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) =>
              `${name.length > 15 ? name.slice(0, 13) + '…' : name} (${(percent * 100).toFixed(0)}%)`
            }
            labelLine={true}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [value.toLocaleString('fr-FR'), 'Entrées']}
            contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
