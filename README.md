# Liste Blanche Opérateur MSSanté

Dashboard interactif de visualisation de la **liste blanche MSSanté** (espace de confiance de la messagerie sécurisée de santé).

**[Voir le dashboard en ligne](https://liste-blanche-mssante.netlify.app)**

## Source des données

Les données proviennent du fichier XML officiel publié par l'ANS (Agence du Numérique en Santé) :
- https://espacedeconfiance.mssante.fr/listeblanchemssante.xml

## Fonctionnalités

- **Vue d'ensemble** : KPIs, top opérateurs, répartition par département, timelines
- **Opérateurs** : tableau complet et graphique des 321 opérateurs
- **Départements** : carte de France choroplèthe + tableau détaillé
- **Timeline** : évolution annuelle et mensuelle des mises à jour
- **Explorer** : recherche, tri et filtrage sur les 8 655 entrées
- **Filtres globaux** : plage de dates, opérateur, département (appliqués sur tous les onglets)

## Analyse : le pic d'avril-mai 2026

L'évolution mensuelle montre un pic massif au Q2 2026 : **2 729 entrées mises à jour** (31% du total), contre ~100/mois habituellement. Ce pic s'explique par **3 événements distincts** :

### 1. Migration GCS PLATEFORME SISRA vers GCS SARA (20 avril, 1 027 entrées)

Le GCS SARA (Santé Auvergne-Rhône-Alpes) a remplacé le GCS PLATEFORME SISRA en tant qu'opérateur MSSanté régional :

- Les 241 domaines SISRA (tous en `.aura.mssante.fr`) se retrouvent identiques chez SARA
- L'ancien certificat unique `smtpmss.sante-ra.fr` est remplacé par deux nouveaux (`smtpmss.sante-ra.fr` + `smtpmssv2.sante-ra.fr`)
- 103 nouveaux domaines `.aura.` sont ajoutés en plus des 241 migrés
- 0 entrée SARA avant le 20 avril 2026 : apparition en bloc

### 2. Intégration d'ENOVACOM (14 avril, 370 entrées)

368 domaines enregistrés en une journée via le certificat `mss.enovacom.fr` (Bouches-du-Rhône). Onboarding initial ou renouvellement de certificat opérateur.

### 3. Intégration de WRAPTOR LABORATORIES (mai 2026, 890 entrées)

Pattern identique : 0 entrée avant mai 2026, puis 890 entrées d'un coup, toutes Bouches-du-Rhône, via deux certificats `mssante.jeebop.fr` / `mssante2.jeebop.fr`.

### Conclusion

Le pic n'est pas une hausse organique de création de domaines de santé. C'est la conjonction d'une **migration institutionnelle** (SISRA vers SARA en Auvergne-Rhône-Alpes) et de **l'intégration de 2 nouveaux opérateurs** (Enovacom, Wraptor) qui enregistrent leurs domaines en lot.

## Stack technique

- React + TypeScript + Vite
- Tailwind CSS v4
- Recharts (graphiques)
- d3-geo (carte de France)
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
