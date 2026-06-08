import { useState, useEffect, useMemo } from 'react';
import type { DataSet, Domaine, ChartEntry, Filters } from '../types';

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

export function useFilteredDomaines(data: DataSet | null, filters: Filters) {
  return useMemo(() => {
    if (!data) return [];
    let domaines = data.domaines;

    if (filters.dateFrom) {
      domaines = domaines.filter((d) => d.dateMaj >= filters.dateFrom);
    }
    if (filters.dateTo) {
      const to = filters.dateTo + 'T23:59:59Z';
      domaines = domaines.filter((d) => d.dateMaj <= to);
    }
    if (filters.operateur) {
      domaines = domaines.filter((d) => d.operateur === filters.operateur);
    }
    if (filters.departement) {
      domaines = domaines.filter((d) => d.departement === filters.departement);
    }

    return domaines;
  }, [data, filters]);
}

export function useFilterOptions(data: DataSet | null) {
  return useMemo(() => {
    if (!data) return { operateurs: [], departements: [], dateMin: '', dateMax: '' };

    const opSet = new Set<string>();
    const depSet = new Set<string>();
    let dateMin = 'Z';
    let dateMax = '';

    for (const d of data.domaines) {
      if (d.operateur) opSet.add(d.operateur);
      if (d.departement) depSet.add(d.departement);
      if (d.dateMaj) {
        if (d.dateMaj < dateMin) dateMin = d.dateMaj;
        if (d.dateMaj > dateMax) dateMax = d.dateMaj;
      }
    }

    return {
      operateurs: Array.from(opSet).sort((a, b) => a.localeCompare(b, 'fr')),
      departements: Array.from(depSet).sort((a, b) => a.localeCompare(b, 'fr')),
      dateMin: dateMin.substring(0, 10),
      dateMax: dateMax.substring(0, 10),
    };
  }, [data]);
}

export function useStats(domaines: Domaine[], dateGeneration: string | null) {
  return useMemo(() => {
    if (!domaines.length) return null;

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
      dateGeneration: dateGeneration || '',
    };
  }, [domaines, dateGeneration]);
}
