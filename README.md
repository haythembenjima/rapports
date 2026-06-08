# Rapport d'Inspection — Gestion

[![Télécharger pour Windows](https://img.shields.io/badge/Télécharger-Windows%20(.exe)-1d4ed8?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/haythembenjima/rapports/releases/latest/download/Rapport-Inspection-Setup.exe)
[![Dernière version](https://img.shields.io/github/v/release/haythembenjima/rapports?style=for-the-badge&label=version)](https://github.com/haythembenjima/rapports/releases/latest)

> **⬇️ Télécharger l'application Windows :** [**Rapport Inspection — Installateur (.exe)**](https://github.com/haythembenjima/rapports/releases/latest/download/Rapport-Inspection-Setup.exe)
> &nbsp;·&nbsp; [Toutes les versions](https://github.com/haythembenjima/rapports/releases)
>
> Ce lien pointe toujours vers la **dernière version** publiée.

Application de rédaction des rapports d'évaluation d'inspection pédagogique
(discipline **Gestion**, modèle officiel du Ministère de l'Éducation tunisien).

![Aperçu de l'application](./docs/screenshot.png)

L'application est un **fichier unique** : [`index.html`](./index.html).
Elle fonctionne de trois façons :

| Usage | Comment |
|-------|---------|
| **Navigateur** | Ouvrir `index.html` (ou l'héberger sur un site statique). |
| **Application de bureau Windows (.exe)** | Voir ci-dessous. |
| **Hors ligne** | Les données sont stockées localement si Firebase est indisponible. |

## Fonctionnalités

- Grille d'évaluation officielle (6 compétences, 20 indicateurs, échelle 0–5).
- **Note /20 calculée automatiquement** selon l'échelle, **modifiable à la main**.
- Observations par compétence générées dans le jargon d'inspection.
- **Synthèse** automatique (règles) ou assistée par IA (Gemini), accordée au genre.
- Reformulation IA de la description de la séance.
- **Export PDF** et **export Word (.docx)**.
- **Historique** des rapports (Firebase ou local), recherche, statistiques, export CSV.
- **Import** d'un rapport au format `.json` (pour le retrouver dans l'historique).
- **Banque de phrases éditable** : le langage des *observations* et des *recommandations* est exportable/importable en JSON ; plusieurs variantes par niveau (0–5) sont tirées au hasard pour éviter les répétitions (onglet Historique → *Banque de phrases*).

## Construire l'application Windows (.exe)

### Option A — Automatique (GitHub Actions, recommandé)

À chaque push sur `main`, le workflow [`build-windows.yml`](./.github/workflows/build-windows.yml)
construit l'installateur sur une machine Windows et le publie comme **artifact**
téléchargeable depuis l'onglet **Actions** du dépôt. On peut aussi le lancer
manuellement (*Run workflow*).

### Option B — En local sur Windows

Prérequis : [Node.js](https://nodejs.org) installé.

```bash
npm install
npm run dist          # crée dist/Rapport-Inspection-Setup.exe (installateur)
# ou
npm run dist:portable # crée une version portable (.exe sans installation)
npm start             # lance l'app en mode développement
```

L'installateur généré (`dist/*.exe`) s'installe comme un logiciel Windows classique
(raccourci bureau + menu Démarrer).

> Remarque : certaines fonctions (synchronisation Firebase, IA Gemini, polices/CDN)
> nécessitent une connexion Internet. La saisie, le calcul de la note, l'export
> PDF/Word et l'historique local fonctionnent hors ligne.
