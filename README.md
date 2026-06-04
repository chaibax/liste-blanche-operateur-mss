# Liste Blanche Opérateur MSSanté

Dashboard interactif de visualisation de la **liste blanche MSSanté** (espace de confiance de la messagerie sécurisée de santé).

## Source des données

Les données proviennent du fichier XML officiel publié par l'ANS (Agence du Numérique en Santé) :
- https://espacedeconfiance.mssante.fr/listeblanchemssante.xml

## Fonctionnalités

- **Vue d'ensemble** : KPIs, top opérateurs, répartition par département
- **Opérateurs** : tableau complet et graphique des 321 opérateurs
- **Départements** : répartition géographique des opérateurs
- **Timeline** : évolution annuelle et mensuelle des mises à jour
- **Explorer** : recherche, tri et filtrage sur les 8 655 entrées

## Stack technique

- React + TypeScript + Vite
- Tailwind CSS v4
- Recharts (graphiques)
- Lucide React (icônes)

## Installation

```bash
npm install
node scripts/convert-xml.mjs  # télécharge et convertit le XML en JSON
npm run dev
```

## Mise à jour des données

```bash
node scripts/convert-xml.mjs
```

Ce script télécharge la dernière version du XML et régénère le fichier JSON utilisé par le front.
