# Rapport d'Inspection — Gestion

[![Télécharger pour Windows](https://img.shields.io/badge/Télécharger-Windows%20(.exe)-1d4ed8?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/haythembenjima/rapports/releases/latest/download/Rapport-Inspection-Setup.exe)
[![Télécharger pour Android](https://img.shields.io/badge/Télécharger-Android%20(.apk)-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://github.com/haythembenjima/rapports/releases/download/android-v1.7.17/Rapport-Inspection.apk)

> **⬇️ Windows :** [**Installateur (.exe)**](https://github.com/haythembenjima/rapports/releases/latest/download/Rapport-Inspection-Setup.exe) — lien toujours à jour (dernière version).
> **📱 Android :** [**Application (.apk)**](https://github.com/haythembenjima/rapports/releases/download/android-v1.7.17/Rapport-Inspection.apk) — installez puis autorisez les « sources inconnues ».
> &nbsp;·&nbsp; [Toutes les versions](https://github.com/haythembenjima/rapports/releases)

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
- **Export par lot** : un bouton « Tout » génère un **seul fichier Word** regroupant tous les rapports affichés (un par page).
- **Import** d'un rapport au format `.json` (pour le retrouver dans l'historique).
- **Banque de phrases éditable** : le langage des *observations* et des *recommandations* est exportable/importable en JSON ; plusieurs variantes par niveau (0–5) sont tirées au hasard pour éviter les répétitions (onglet Historique → *Banque de phrases*).
- **Notes manuscrites → rapport** : **Prendre une photo** (mobile), **charger des images** ou **charger un PDF** (notes scannées — chaque page est convertie en image) des prises de notes de la visite.
  - **En ligne** : l'IA multimodale (Gemini) lit les images et pré-remplit description, observations par compétence, **note /20 proposée** et synthèse.
  - **Hors ligne** : reconnaissance du texte sur l'appareil (OCR), puis génération **à partir de la banque de jargon** (observations, **note /20 estimée**, synthèse) — fonctionne aussi sur du texte saisi/corrigé à la main. Dans l'**installateur Windows**, le moteur OCR (Tesseract + données françaises) est **embarqué** → reconnaissance **100 % hors-ligne** dès l'installation. *(En version navigateur, l'OCR se télécharge une fois depuis le CDN puis est mis en cache.)*

## Base des enseignants — fiche en ligne ([`enseignants.html`](./enseignants.html))

Site compagnon pour constituer une **base de données des enseignants** de la discipline :
chaque enseignant ouvre le lien et remplit sa fiche — état civil (nom, naissance, téléphone,
e-mail), conjoint et sa profession, établissement (lycée ou collège technique), commissariat
régional d'éducation, date de recrutement, dernière note avec l'inspecteur et sa date,
**emploi du temps** du lundi au samedi (8 h → 18 h, séances de 2 h), et en bas les **niveaux
enseignés avec le nombre d'élèves** : 2ème ES, 3ème EG, 4ème EG, 8ème et 9ème.

- À l'enregistrement, l'enseignant reçoit un **code personnel** (6 caractères) pour retrouver
  et modifier sa fiche depuis n'importe quel appareil (bouton « J'ai déjà une fiche »).
- Hors ligne, la fiche est gardée sur l'appareil puis **envoyée automatiquement** à la reconnexion ;
  un brouillon est sauvegardé en continu pendant la saisie.
- **Espace inspecteur** (bouton en haut à droite — mot de passe par défaut `admin2026`, à changer
  dès la première utilisation) : liste des fiches en temps réel, recherche, tri, statistiques
  (total d'élèves, élèves par niveau, moyenne des dernières notes), consultation / correction /
  **impression** d'une fiche, suppression, **export CSV**.
- Les fiches sont stockées dans le **même projet Firebase** que l'application, dans la zone
  publique partagée : `artifacts/default-app-id/public/data/enseignants`.

### Mise en ligne (GitHub Pages)

1. Sur GitHub : **Settings → Pages → Source : « Deploy from a branch » → branche `main`, dossier `/ (root)`**.
2. Après une à deux minutes, le lien à partager aux enseignants est :
   **`https://haythembenjima.github.io/rapports/enseignants.html`**

### Règles de sécurité Firestore requises

Dans la console Firebase (**Firestore Database → Règles** — lien direct :
[console.firebase.google.com/project/inspection-gestion/firestore/rules](https://console.firebase.google.com/project/inspection-gestion/firestore/rules)),
remplacez les règles par le modèle ci-dessous puis cliquez sur **Publier**. La zone publique doit
être ouverte aux utilisateurs connectés (la page connecte chaque visiteur de façon anonyme,
comme l'application principale) — sans cela, l'enregistrement des fiches affiche
« Accès refusé par le serveur » et la liste de l'espace inspecteur reste vide :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Rapports d'inspection : privés, chacun ne voit que les siens
    match /artifacts/{appId}/users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Zone partagée : fiches enseignants + configuration
    match /artifacts/{appId}/public/data/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

> ⚠️ Avec ces règles simples, toute personne disposant du lien peut techniquement lire la zone
> publique : le mot de passe de l'espace inspecteur protège l'**interface**, pas la base elle-même.
> C'est le même modèle que la configuration partagée de l'application. Pour durcir l'accès en
> lecture, il faudrait restreindre `enseignants/{fiche}` à l'UID du compte de l'inspecteur (mais
> la récupération de fiche par code personnel ne fonctionnerait plus entre appareils).

## Cours interactif — création de cours assistée par IA ([`cours-interactif/`](./cours-interactif/))

Application compagnon pour **créer des cours interactifs** à partir d'un simple sujet :
l'IA génère un cours complet (diapositives, **quiz** avec correction immédiate,
**éléments interactifs**, **export** `.pptx`/`.html` et lecture audio). Elle est basée
sur le projet open source **[OpenMAIC](https://github.com/THU-MAIC/OpenMAIC)** (licence
MIT), **préconfigurée pour Google Gemini** et avec une **interface en français**.

> ⚠️ Contrairement à `index.html` et `enseignants.html` (pages autonomes), c'est une
> **application serveur Next.js** : elle nécessite Node.js, une clé API et un hébergement
> (Vercel / Docker / serveur Node). Elle **ne se publie pas** sur GitHub Pages.

Démarrage rapide :

```bash
cd cours-interactif
cp .env.example .env.local      # puis renseignez GOOGLE_API_KEY=...
pnpm install
pnpm dev                        # → http://localhost:3000
```

Guide complet (configuration, déploiement Vercel/Docker) : **[`cours-interactif/LISEZ-MOI.md`](./cours-interactif/LISEZ-MOI.md)**.

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
