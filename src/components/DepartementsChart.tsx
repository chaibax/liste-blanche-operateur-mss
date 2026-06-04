import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
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

export function DepartementsChart({ data, top = 10 }: Props) {
  const topItems = data.slice(0, top);
  const otherTotal = data.slice(top).reduce((s, d) => s + d.value, 0);
  const total = data.reduce((s, d) => s + d.value, 0);
  const chartData = otherTotal > 0
    ? [...topItems, { name: `Autres (${data.length - top})`, value: otherTotal }]
    : topItems;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Répartition par Département</h3>
      <p className="text-sm text-gray-500 mb-4">Localisation des opérateurs de messagerie</p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <ResponsiveContainer width="100%" height={300} className="sm:max-w-[300px]">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={55}
              dataKey="value"
              nameKey="name"
              paddingAngle={1}
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [Number(value).toLocaleString('fr-FR'), 'Entrées']}
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex-1 min-w-0 space-y-1.5 w-full">
          {chartData.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2 text-sm">
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-gray-700 truncate flex-1">{d.name}</span>
              <span className="font-mono text-gray-900 tabular-nums">{d.value.toLocaleString('fr-FR')}</span>
              <span className="text-gray-400 text-xs w-10 text-right">{((d.value / total) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
