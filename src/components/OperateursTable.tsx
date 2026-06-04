import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartEntry } from '../types';

interface Props {
  data: ChartEntry[];
}

export function OperateursTable({ data }: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Tous les opérateurs</h3>
      <p className="text-sm text-gray-500 mb-4">{data.length} opérateurs identifiés</p>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="overflow-y-auto max-h-[500px]">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Opérateur</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Domaines</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((d, i) => (
                <tr key={d.name} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-3 py-2 text-gray-700 font-medium">{d.name}</td>
                  <td className="px-3 py-2 text-right font-mono text-gray-900">{d.value.toLocaleString('fr-FR')}</td>
                  <td className="px-3 py-2 text-right text-gray-500">{((d.value / total) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={data.slice(0, 20)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-45} textAnchor="end" height={100} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [value.toLocaleString('fr-FR'), 'Domaines']}
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
