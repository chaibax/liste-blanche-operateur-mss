import { useState, useEffect, useMemo } from 'react';
import type { DataSet, Domaine, ChartEntry } from '../types';

export function useData() {
  const [data, setData] = useState<DataSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/domaines.json')
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

function countBy(items: Domaine[], key: keyof Domaine): ChartEntry[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const val = item[key] || 'Non renseigné';
    map.set(val, (map.get(val) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function useStats(data: DataSet | null) {
  return useMemo(() => {
    if (!data) return null;

    const domaines = data.domaines;
    const uniqueDomains = new Set(domaines.map((d) => d.nom)).size;

    const operateurs = countBy(domaines, 'operateur');
    const departements = countBy(domaines, 'departement');

    const timelineMap = new Map<string, number>();
    for (const d of domaines) {
      if (d.dateMaj) {
        const year = d.dateMaj.substring(0, 4);
        timelineMap.set(year, (timelineMap.get(year) || 0) + 1);
      }
    }
    const timeline = Array.from(timelineMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const monthlyMap = new Map<string, number>();
    for (const d of domaines) {
      if (d.dateMaj) {
        const month = d.dateMaj.substring(0, 7);
        monthlyMap.set(month, (monthlyMap.get(month) || 0) + 1);
      }
    }
    const monthly = Array.from(monthlyMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const latestUpdate = domaines.reduce((latest, d) => {
      return d.dateMaj > latest ? d.dateMaj : latest;
    }, '');

    const deptByCode = new Map<string, number>();
    for (const d of domaines) {
      if (d.codeDepartement) {
        deptByCode.set(d.codeDepartement, (deptByCode.get(d.codeDepartement) || 0) + 1);
      }
    }

    return {
      totalEntries: domaines.length,
      uniqueDomains,
      operateurs,
      departements,
      deptByCode,
      timeline,
      monthly,
      nbOperateurs: operateurs.length,
      nbDepartements: departements.length,
      latestUpdate,
      dateGeneration: data.dateGeneration,
    };
  }, [data]);
}
