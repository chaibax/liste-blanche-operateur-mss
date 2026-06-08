import { useState } from 'react';
import { Shield, BarChart3, Building2, MapPin, Clock, Table2, Loader2 } from 'lucide-react';
import { useData, useFilteredDomaines, useFilterOptions, useStats } from './hooks/useData';
import { FilterBar } from './components/FilterBar';
import { KpiCards } from './components/KpiCards';
import { OperateursChart } from './components/OperateursChart';
import { OperateursTable } from './components/OperateursTable';
import { DepartementsChart } from './components/DepartementsChart';
import { DepartementsTable } from './components/DepartementsTable';
import { TimelineChart } from './components/TimelineChart';
import { DataTable } from './components/DataTable';
import { FranceMap } from './components/FranceMap';
import type { TabId, Filters } from './types';

const tabs: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
  { id: 'operateurs', label: 'Opérateurs', icon: Building2 },
  { id: 'departements', label: 'Départements', icon: MapPin },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'explorer', label: 'Explorer', icon: Table2 },
];

const EMPTY_FILTERS: Filters = { dateFrom: '', dateTo: '', operateur: '', departement: '' };

function App() {
  const { data, loading, error } = useData();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const filterOptions = useFilterOptions(data);
  const filtered = useFilteredDomaines(data, filters);
  const stats = useStats(filtered, data?.dateGeneration ?? null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="animate-spin" size={24} />
          <span className="text-lg">Chargement des données MSSanté...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Erreur</p>
          <p>{error || 'Données non disponibles'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Liste Blanche MSSanté</h1>
                <p className="text-xs text-gray-500">
                  Espace de confiance — Généré le{' '}
                  {data.dateGeneration
                    ? new Date(data.dateGeneration).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                    : '-'}
                </p>
              </div>
            </div>
            <a
              href="https://espacedeconfiance.mssante.fr/listeblanchemssante.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Source XML
            </a>
          </div>
        </div>

        <nav className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto pb-px -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    active
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          operateurs={filterOptions.operateurs}
          departements={filterOptions.departements}
          dateMin={filterOptions.dateMin}
          dateMax={filterOptions.dateMax}
          filteredCount={filtered.length}
          totalCount={data.totalDomaines}
        />

        {stats ? (
          <>
            {activeTab === 'overview' && (
              <>
                <KpiCards
                  totalEntries={stats.totalEntries}
                  uniqueDomains={stats.uniqueDomains}
                  nbOperateurs={stats.nbOperateurs}
                  nbDepartements={stats.nbDepartements}
                  latestUpdate={stats.latestUpdate}
                />
                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                  <OperateursChart data={stats.operateurs} top={10} />
                  <DepartementsChart data={stats.departements} top={10} />
                </div>
                <TimelineChart data={stats.timeline} monthly={stats.monthly} />
              </>
            )}

            {activeTab === 'operateurs' && <OperateursTable data={stats.operateurs} />}
            {activeTab === 'departements' && (
              <div className="space-y-6">
                <FranceMap data={stats.deptByCode} />
                <DepartementsTable data={stats.departements} />
              </div>
            )}
            {activeTab === 'timeline' && <TimelineChart data={stats.timeline} monthly={stats.monthly} />}
            {activeTab === 'explorer' && <DataTable domaines={filtered} />}
          </>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">Aucun résultat pour ces filtres</p>
            <button
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-gray-400">
          Données issues de l'espace de confiance MSSanté — ANS (Agence du Numérique en Santé)
        </div>
      </footer>
    </div>
  );
}

export default App;
