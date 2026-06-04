import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartEntry } from '../types';

interface Props {
  data: ChartEntry[];
  monthly: ChartEntry[];
}

export function TimelineChart({ data, monthly }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Évolution par année</h3>
        <p className="text-sm text-gray-500 mb-4">Date de dernière mise à jour des domaines</p>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorYear" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number) => [value.toLocaleString('fr-FR'), 'Domaines']}
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
            />
            <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="url(#colorYear)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Évolution mensuelle</h3>
        <p className="text-sm text-gray-500 mb-4">Granularité mois par mois</p>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthly}>
            <defs>
              <linearGradient id="colorMonth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={Math.floor(monthly.length / 12)} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number) => [value.toLocaleString('fr-FR'), 'Domaines']}
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
            />
            <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="url(#colorMonth)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
