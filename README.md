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
**emploi du temps** du lundi au samedi (8 h → 18 h, séances de 2 h — avec salle et précision :
quinzaine semaine A/B, groupes G1/G2, séances d'une heure, créneau partagé entre deux classes),
et en bas la **liste des classes enseignées, déduite automatiquement de l'emploi du temps**,
avec le nombre d'élèves par classe (niveaux : 2ème ES, 3ème EG, 4ème EG, 8ème et 9ème).

- À l'enregistrement, l'enseignant reçoit un **code personnel** (6 caractères) pour retrouver
  et modifier sa fiche depuis n'importe quel appareil (bouton « J'ai déjà une fiche »).
- Hors ligne, la fiche est gardée sur l'appareil puis **envoyée automatiquement** à la reconnexion ;
  un brouillon est sauvegardé en continu pendant la saisie.
- **Espace inspecteur** : connexion avec un **compte e-mail / mot de passe** (le même que dans
  l'application « Rapport d'Inspection » ; bouton **Compte** pour le créer). Chaque inspecteur
  reçoit un **code personnel** et un **lien à partager** (`enseignants.html?i=CODE`) : les fiches
  remplies via son lien arrivent directement dans **sa** base, et chaque inspecteur ne voit que
  les siennes. Liste en temps réel, recherche, tri, **filtres avancés** (CRE, niveau enseigné,
  plage de notes, dernière note avant une date — enseignants jamais notés inclus —, et jour/créneau
  de l'emploi du temps : « qui enseigne le mardi de 14 h à 16 h ? » avec la classe et la salle
  affichées), statistiques (total d'élèves, élèves par niveau, moyenne des dernières notes),
  consultation / correction / **impression** d'une fiche, suppression, **export CSV** (de la liste
  filtrée). Les fiches reçues **sans code** (ancien lien) peuvent être **importées** dans sa base
  en un clic. Le champ « Code inspecteur » de la fiche est **en lecture seule** : il ne se remplit
  que par le lien partagé.
- Les fiches sont stockées dans le **même projet Firebase** que l'application, dans la zone
  publique partagée : `artifacts/default-app-id/public/data/enseignants`.

- **Suivi des visites** (privé) : statut à visiter / programmée / faite, dates et remarques
  personnelles de l'inspecteur sur chaque fiche ; **vue Planning** hebdomadaire des enseignants
  visitables créneau par créneau ; alerte « **nouvelles fiches** » depuis la dernière connexion.
- **Corbeille** (suppression réversible) et **Sauvegarde / Restauration** de toute la base en JSON.
- **Site installable** (PWA) : sur téléphone, menu du navigateur → « Ajouter à l'écran d'accueil » ;
  sur PC, icône d'installation dans la barre d'adresse. L'icône « Enseignants » s'ouvre alors
  comme une application.

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

### Règles durcies (recommandées dès que le suivi des visites est utilisé)

La version ci-dessus suffit pour démarrer, mais elle laisse toute la zone publique lisible et
modifiable par quiconque est connecté. La version ci-dessous ajoute des protections **côté
serveur** : le **suivi des visites (remarques privées)** n'est lisible que par l'inspecteur
concerné, chaque inspecteur ne peut écrire que **son** profil, la **corbeille** est réservée aux
comptes inspecteurs, et la **suppression** d'une fiche est réservée à l'inspecteur dont le code
figure sur la fiche (une fiche « sans code » doit d'abord être importée). Les fiches elles-mêmes
restent lisibles/modifiables par les utilisateurs connectés — nécessaire pour que l'enseignant
retrouve sa fiche par code depuis n'importe quel appareil.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Rapports d'inspection (application) : privés, chacun les siens
    match /artifacts/{appId}/users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Fiches enseignants : lecture/création/mise à jour pour tout utilisateur connecté ;
    // suppression réservée à l'inspecteur dont le code figure sur la fiche
    match /artifacts/{appId}/public/data/enseignants/{fiche} {
      allow read, create, update: if request.auth != null;
      allow delete: if request.auth != null &&
        get(/databases/$(database)/documents/artifacts/$(appId)/public/data/enseignants_config/insp_$(request.auth.uid)).data.code == resource.data.insp;
    }

    // Profils inspecteurs : chacun écrit le sien
    match /artifacts/{appId}/public/data/enseignants_config/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && docId == 'insp_' + request.auth.uid;
    }

    // Suivi des visites (remarques privées) : seul l'inspecteur concerné y accède
    match /artifacts/{appId}/public/data/enseignants_suivi/{ficheId} {
      allow read, delete: if request.auth != null &&
        resource.data.insp == get(/databases/$(database)/documents/artifacts/$(appId)/public/data/enseignants_config/insp_$(request.auth.uid)).data.code;
      allow create, update: if request.auth != null &&
        request.resource.data.insp == get(/databases/$(database)/documents/artifacts/$(appId)/public/data/enseignants_config/insp_$(request.auth.uid)).data.code;
    }

    // Corbeille : réservée aux comptes inspecteurs
    match /artifacts/{appId}/public/data/enseignants_corbeille/{ficheId} {
      allow read, write: if request.auth != null &&
        exists(/databases/$(database)/documents/artifacts/$(appId)/public/data/enseignants_config/insp_$(request.auth.uid));
    }
  }
}
```

> Remarque : même durcies, ces règles laissent les **fiches** lisibles par toute personne
> connectée (c'est ce qui permet le code personnel des enseignants). La page n'expose ces données
> qu'aux inspecteurs, mais un utilisateur technique pourrait les lire via l'API : n'y mettez pas
> d'informations sensibles au-delà de ce qui est demandé.

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
