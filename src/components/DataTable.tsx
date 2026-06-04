import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import type { Domaine } from '../types';

interface Props {
  domaines: Domaine[];
}

const PAGE_SIZE = 25;

type SortKey = 'nom' | 'description' | 'operateur' | 'departement' | 'dateMaj';

export function DataTable({ domaines }: Props) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>('nom');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [operateurFilter, setOperateurFilter] = useState('');

  const operateurs = useMemo(() => {
    const set = new Set(domaines.map((d) => d.operateur));
    return Array.from(set).sort();
  }, [domaines]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = domaines;

    if (operateurFilter) {
      result = result.filter((d) => d.operateur === operateurFilter);
    }

    if (q) {
      result = result.filter(
        (d) =>
          d.nom.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.operateur.toLowerCase().includes(q) ||
          d.departement.toLowerCase().includes(q)
      );
    }

    result = [...result].sort((a, b) => {
      const av = a[sortKey] || '';
      const bv = b[sortKey] || '';
      const cmp = av.localeCompare(bv, 'fr');
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [domaines, search, operateurFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(0);
  }

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
      onClick={() => toggleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown size={12} className={sortKey === field ? 'text-blue-500' : 'text-gray-300'} />
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Explorateur de domaines</h3>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un domaine, opérateur, description..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={operateurFilter}
          onChange={(e) => { setOperateurFilter(e.target.value); setPage(0); }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Tous les opérateurs</option>
          {operateurs.map((op) => (
            <option key={op} value={op}>{op}</option>
          ))}
        </select>
      </div>

      <p className="text-sm text-gray-500 mb-3">
        {filtered.length.toLocaleString('fr-FR')} résultat{filtered.length > 1 ? 's' : ''}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <SortHeader label="Domaine" field="nom" />
              <SortHeader label="Description" field="description" />
              <SortHeader label="Opérateur" field="operateur" />
              <SortHeader label="Département" field="departement" />
              <SortHeader label="Mise à jour" field="dateMaj" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pageData.map((d, i) => (
              <tr key={`${d.nom}-${d.dnBrut}-${i}`} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-blue-600">{d.nom}</td>
                <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{d.description}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                    {d.operateur}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">{d.departement}{d.codeDepartement ? ` (${d.codeDepartement})` : ''}</td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                  {d.dateMaj ? new Date(d.dateMaj).toLocaleDateString('fr-FR') : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} /> Précédent
          </button>
          <span className="text-sm text-gray-500">
            Page {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Suivant <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
