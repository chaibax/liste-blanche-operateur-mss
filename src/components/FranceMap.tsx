import { useState, useEffect, useMemo, useCallback } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import type { FeatureCollection, Feature, Geometry } from 'geojson';

interface DeptProperties {
  code: string;
  nom: string;
}

interface Props {
  data: Map<string, number>;
}

const WIDTH = 550;
const HEIGHT = 580;

const COLOR_SCALE = [
  '#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa',
  '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a',
];

const DOM_NAMES: Record<string, string> = {
  '971': 'Guadeloupe',
  '972': 'Martinique',
  '973': 'Guyane',
  '974': 'La Réunion',
  '976': 'Mayotte',
};

function getColor(value: number, maxLog: number): string {
  if (value === 0) return '#f1f5f9';
  const logVal = Math.log10(value + 1);
  const idx = Math.min(Math.floor((logVal / maxLog) * (COLOR_SCALE.length - 1)), COLOR_SCALE.length - 1);
  return COLOR_SCALE[idx];
}

export function FranceMap({ data }: Props) {
  const [geo, setGeo] = useState<FeatureCollection | null>(null);
  const [hoveredDept, setHoveredDept] = useState<{ code: string; nom: string; count: number; x: number; y: number } | null>(null);

  useEffect(() => {
    fetch('/data/departements-france.geojson')
      .then((r) => r.json())
      .then(setGeo);
  }, []);

  const max = useMemo(() => Math.max(...data.values(), 1), [data]);
  const maxLog = useMemo(() => Math.log10(max + 1), [max]);

  const projection = useMemo(() => {
    if (!geo) return null;
    return geoMercator().fitSize([WIDTH, HEIGHT], geo);
  }, [geo]);

  const pathGenerator = useMemo(() => {
    if (!projection) return null;
    return geoPath().projection(projection);
  }, [projection]);

  const deptNameLookup = useMemo(() => {
    const lookup = new Map<string, string>(Object.entries(DOM_NAMES));
    if (geo) {
      for (const f of geo.features) {
        const props = (f as Feature<Geometry, DeptProperties>).properties;
        lookup.set(props.code, props.nom);
      }
    }
    return lookup;
  }, [geo]);

  const handleMouseEnter = useCallback((e: React.MouseEvent, feature: Feature<Geometry, DeptProperties>) => {
    const rect = (e.currentTarget as SVGElement).closest('svg')!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const code = feature.properties.code;
    setHoveredDept({
      code,
      nom: feature.properties.nom,
      count: data.get(code) || 0,
      x,
      y,
    });
  }, [data]);

  const handleMouseLeave = useCallback(() => {
    setHoveredDept(null);
  }, []);

  if (!geo || !pathGenerator) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-center h-[650px]">
        <span className="text-gray-400">Chargement de la carte...</span>
      </div>
    );
  }

  const legendSteps = [1, 10, 50, 100, 500, 1000, max];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Carte de France</h3>
      <p className="text-sm text-gray-500 mb-4">Nombre d'entrées par département d'implantation des opérateurs</p>

      <div className="flex flex-col lg:flex-row items-start gap-6">
        <div className="relative flex-shrink-0">
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width={WIDTH} height={HEIGHT} className="max-w-full h-auto">
            {geo.features.map((feature) => {
              const f = feature as Feature<Geometry, DeptProperties>;
              const code = f.properties.code;
              const count = data.get(code) || 0;
              const d = pathGenerator(f);
              if (!d) return null;
              return (
                <path
                  key={code}
                  d={d}
                  fill={getColor(count, maxLog)}
                  stroke="#fff"
                  strokeWidth={0.8}
                  className="transition-opacity duration-150 cursor-pointer hover:opacity-80"
                  onMouseEnter={(e) => handleMouseEnter(e, f)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })}
          </svg>

          {hoveredDept && (
            <div
              className="absolute pointer-events-none bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg z-10"
              style={{
                left: hoveredDept.x + 12,
                top: hoveredDept.y - 10,
                transform: hoveredDept.x > WIDTH / 2 ? 'translateX(-110%)' : 'none',
              }}
            >
              <p className="font-semibold">{hoveredDept.nom} ({hoveredDept.code})</p>
              <p>{hoveredDept.count.toLocaleString('fr-FR')} entrée{hoveredDept.count > 1 ? 's' : ''}</p>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-[200px]">
          <p className="text-xs font-medium text-gray-500 uppercase mb-3">Légende (échelle log)</p>
          <div className="flex items-center gap-1 mb-2">
            <div className="flex h-3 flex-1 rounded overflow-hidden">
              {COLOR_SCALE.map((color, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mb-5">
            {legendSteps.filter((_, i, arr) => i === 0 || i === arr.length - 1 || i % 2 === 0).map((v) => (
              <span key={v}>{v.toLocaleString('fr-FR')}</span>
            ))}
          </div>

          <p className="text-xs font-medium text-gray-500 uppercase mb-2">Top départements</p>
          <div className="space-y-1.5">
            {Array.from(data.entries())
              .sort((a, b) => b[1] - a[1])
              .slice(0, 12)
              .map(([code, count]) => (
                <div key={code} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: getColor(count, maxLog) }} />
                  <span className="text-sm text-gray-700 flex-1 truncate">
                    {deptNameLookup.get(code) || code} ({code})
                  </span>
                  <span className="text-sm font-mono text-gray-900">{count.toLocaleString('fr-FR')}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
