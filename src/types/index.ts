export interface Domaine {
  nom: string;
  description: string;
  operateur: string;
  cn: string;
  ou: string;
  departement: string;
  codeDepartement: string;
  pays: string;
  responsableContact: string;
  supportContact: string;
  dateMaj: string;
  dnBrut: string;
}

export interface DataSet {
  dateGeneration: string;
  totalDomaines: number;
  domaines: Domaine[];
}

export interface ChartEntry {
  name: string;
  value: number;
}

export interface Filters {
  dateFrom: string;
  dateTo: string;
  operateur: string;
  departement: string;
}

export type TabId = 'overview' | 'operateurs' | 'departements' | 'timeline' | 'explorer';
