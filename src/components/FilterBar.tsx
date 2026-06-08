import { Calendar, Building2, MapPin, X, FilterX } from 'lucide-react';
import type { Filters } from '../types';

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  operateurs: string[];
  departements: string[];
  dateMin: string;
  dateMax: string;
  filteredCount: number;
  totalCount: number;
}

export function FilterBar({
  filters,
  onChange,
  operateurs,
  departements,
  dateMin,
  dateMax,
  filteredCount,
  totalCount,
}: Props) {
  const hasFilters = filters.dateFrom || filters.dateTo || filters.operateur || filters.departement;

  function reset() {
    onChange({ dateFrom: '', dateTo: '', operateur: '', departement: '' });
  }

  function set(key: keyof Filters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex flex-wrap items-end gap-3">
        {/* Date range */}
        <div className="flex items-end gap-2">
          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
              <Calendar size={12} />
              Du
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              min={dateMin}
              max={dateMax}
              onChange={(e) => set('dateFrom', e.target.value)}
              className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
              Au
            </label>
            <input
              type="date"
              value={filters.dateTo}
              min={dateMin}
              max={dateMax}
              onChange={(e) => set('dateTo', e.target.value)}
              className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
        </div>

        {/* Operator */}
        <div>
          <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
            <Building2 size={12} />
            Opérateur
          </label>
          <select
            value={filters.operateur}
            onChange={(e) => set('operateur', e.target.value)}
            className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white max-w-[220px]"
          >
            <option value="">Tous ({operateurs.length})</option>
            {operateurs.map((op) => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>
        </div>

        {/* Department */}
        <div>
          <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
            <MapPin size={12} />
            Département
          </label>
          <select
            value={filters.departement}
            onChange={(e) => set('departement', e.target.value)}
            className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white max-w-[220px]"
          >
            <option value="">Tous ({departements.length})</option>
            {departements.map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>

        {/* Quick presets */}
        <div className="flex items-end gap-1.5">
          {[
            { label: '2024', from: '2024-01-01', to: '2024-12-31' },
            { label: '2025', from: '2025-01-01', to: '2025-12-31' },
            { label: '2026', from: '2026-01-01', to: '2026-12-31' },
            { label: '12 derniers mois', from: getMonthsAgo(12), to: dateMax },
          ].map((p) => (
            <button
              key={p.label}
              onClick={() => onChange({ ...filters, dateFrom: p.from, dateTo: p.to })}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                filters.dateFrom === p.from && filters.dateTo === p.to
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Reset */}
        {hasFilters && (
          <button
            onClick={reset}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
          >
            <X size={12} />
            Réinitialiser
          </button>
        )}
      </div>

      {/* Active filters summary */}
      {hasFilters && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap">
          <FilterX size={14} className="text-gray-400" />
          <span className="text-xs text-gray-500">
            <span className="font-semibold text-gray-700">{filteredCount.toLocaleString('fr-FR')}</span>
            {' '}entrée{filteredCount > 1 ? 's' : ''} sur {totalCount.toLocaleString('fr-FR')}
            {' '}({((filteredCount / totalCount) * 100).toFixed(1)}%)
          </span>

          {filters.dateFrom && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
              Depuis {filters.dateFrom}
              <button onClick={() => set('dateFrom', '')} className="hover:text-blue-900"><X size={10} /></button>
            </span>
          )}
          {filters.dateTo && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
              Jusqu'au {filters.dateTo}
              <button onClick={() => set('dateTo', '')} className="hover:text-blue-900"><X size={10} /></button>
            </span>
          )}
          {filters.operateur && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-700">
              {filters.operateur}
              <button onClick={() => set('operateur', '')} className="hover:text-indigo-900"><X size={10} /></button>
            </span>
          )}
          {filters.departement && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-700">
              {filters.departement}
              <button onClick={() => set('departement', '')} className="hover:text-amber-900"><X size={10} /></button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function getMonthsAgo(n: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toISOString().substring(0, 10);
}
