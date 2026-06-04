import { Globe, Building2, MapPin, CalendarClock } from 'lucide-react';

interface Props {
  totalEntries: number;
  uniqueDomains: number;
  nbOperateurs: number;
  nbDepartements: number;
  latestUpdate: string;
}

const cards = [
  { key: 'entries', label: 'Entrées totales', icon: Globe, color: 'bg-blue-500' },
  { key: 'domains', label: 'Domaines uniques', icon: Globe, color: 'bg-indigo-500' },
  { key: 'ops', label: 'Opérateurs', icon: Building2, color: 'bg-emerald-500' },
  { key: 'deps', label: 'Départements', icon: MapPin, color: 'bg-amber-500' },
] as const;

export function KpiCards({ totalEntries, uniqueDomains, nbOperateurs, nbDepartements, latestUpdate }: Props) {
  const values: Record<string, string> = {
    entries: totalEntries.toLocaleString('fr-FR'),
    domains: uniqueDomains.toLocaleString('fr-FR'),
    ops: nbOperateurs.toLocaleString('fr-FR'),
    deps: nbDepartements.toLocaleString('fr-FR'),
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.key} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className={`${c.color} p-3 rounded-lg text-white`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{values[c.key]}</p>
              <p className="text-sm text-gray-500">{c.label}</p>
            </div>
          </div>
        );
      })}
      <div className="sm:col-span-2 lg:col-span-4 bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex items-center gap-3">
        <CalendarClock size={16} className="text-gray-400" />
        <span className="text-sm text-gray-500">
          Dernière mise à jour :{' '}
          <span className="font-medium text-gray-700">
            {latestUpdate ? new Date(latestUpdate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
          </span>
        </span>
      </div>
    </div>
  );
}
