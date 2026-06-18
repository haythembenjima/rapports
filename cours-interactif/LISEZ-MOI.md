# Cours interactif — création de cours assistée par IA

Application de **création de cours interactifs** basée sur **[OpenMAIC](https://github.com/THU-MAIC/OpenMAIC)**
(Open Multi-Agent Interactive Classroom), **préconfigurée pour Google Gemini** avec une
**interface en français et arabe**.

À partir d'un simple sujet (ou d'un document que vous fournissez), l'IA construit un
**cours complet et interactif** : diapositives, quiz, éléments interactifs, le tout
animé par des « enseignants » et « élèves » IA.

> ⚠️ Ce n'est **pas** une simple page HTML : c'est une **application serveur Next.js**
> qui nécessite Node.js, une clé API et un hébergement (Vercel, Docker, ou un serveur
> Node). Elle **ne peut pas** être publiée telle quelle sur GitHub Pages.

## Fonctionnalités principales

- **Génération IA du cours** — décrivez un sujet ou joignez vos supports ; l'IA produit
  un plan puis un cours structuré en diapositives. La **langue du cours est déduite
  automatiquement** du sujet (un sujet en français → un cours en français).
- **Quiz interactifs** — questions à choix multiples / vrai-faux avec correction
  immédiate, score et état conservé jusqu'à la page de fin de cours.
- **Éléments interactifs** — simulations HTML, schémas, cartes mentales, et même
  programmation en ligne (mode interactif approfondi) pour un apprentissage actif.
- **Export & lecture** — export en **`.pptx`** (diapositives éditables) ou **`.html`**
  (page interactive autonome), lecture audio (synthèse vocale / TTS) et tableau blanc.

## Prérequis

- **Node.js ≥ 20** (recommandé : Node 22 — voir `.nvmrc`)
- **pnpm ≥ 10** (`npm install -g pnpm` ou `corepack enable`)
- Une **clé API Google Gemini** (gratuite) : <https://aistudio.google.com/apikey>

## Démarrage rapide (local)

```bash
# 1. Se placer dans le dossier de l'application
cd cours-interactif

# 2. Créer le fichier de configuration et y mettre votre clé Gemini
cp .env.example .env.local
#   puis éditez .env.local et renseignez :  GOOGLE_API_KEY=VOTRE_CLE
#   (DEFAULT_MODEL=google:gemini-3-flash-preview est déjà préconfiguré)

# 3. Installer les dépendances
pnpm install

# 4. Lancer en développement
pnpm dev
```

Ouvrez ensuite **<http://localhost:3000>**. L'interface s'affiche **en français**
(le sélecteur de langue en haut permet de changer ; la langue du navigateur est
aussi détectée automatiquement).

### Mode production

```bash
pnpm build      # construit l'application optimisée
pnpm start      # démarre le serveur de production (port 3000)
```

## Application de bureau Windows (.exe)

Une version **bureau** (Electron) est packagée dans le dossier
[`../cours-interactif-desktop/`](../cours-interactif-desktop/). Elle embarque le serveur Next
(lancé en local au démarrage) et s'installe comme un logiciel Windows classique.

- **Téléchargement** : depuis les *Releases* du dépôt (asset `Cours-Interactif-Setup.exe`).
- **Construction** : automatique via GitHub Actions sur un runner Windows
  ([`.github/workflows/build-cours-windows.yml`](../.github/workflows/build-cours-windows.yml)).
  Le `.exe` ne peut pas être compilé sous Linux/macOS (modules natifs `sharp` / `@napi-rs/canvas`
  spécifiques à Windows).
- **Clé API** : au premier lancement, ouvrez **Paramètres** et saisissez votre clé Google Gemini
  (rien n'est codé en dur dans l'installateur).
- **Build local** (sur une machine Windows, pour tester) :
  ```bash
  cd cours-interactif && pnpm install && pnpm build
  # copier .next/standalone, .next/static et public dans ../cours-interactif-desktop/standalone
  cd ../cours-interactif-desktop && npm install && npm run dist   # → dist-desktop/Cours-Interactif-Setup.exe
  ```

## Configuration (Gemini & autres)

La configuration se fait dans **`.env.local`** (copie de `.env.example`).
Le strict minimum pour démarrer avec Gemini :

```bash
GOOGLE_API_KEY=VOTRE_CLE_GEMINI
DEFAULT_MODEL=google:gemini-3-flash-preview   # déjà présent dans .env.example
```

- **Modèle recommandé** : `google:gemini-3-flash-preview` (meilleur équilibre
  qualité / vitesse). Pour une qualité maximale (plus lent) :
  `google:gemini-3.1-pro-preview`.
- OpenMAIC supporte aussi OpenAI, Anthropic, DeepSeek, Qwen, Ollama (local), etc.
  Il suffit de renseigner la clé correspondante dans `.env.local`.
- **Protéger l'accès** (optionnel) : définissez `ACCESS_CODE=...` pour exiger un mot
  de passe à l'entrée du site.
- **Routage par étape** (optionnel) : `MODEL_ROUTES` permet d'utiliser un modèle
  différent selon l'étape de génération (voir les commentaires dans `.env.example`).

> 🔒 `.env.local` contient votre clé secrète : il est **ignoré par git** (voir
> `.gitignore`) et ne doit **jamais** être publié.

## Déploiement

### Option A — Vercel (recommandé)

OpenMAIC est une application Next.js : le plus simple est Vercel.

1. Importez ce dépôt dans Vercel et définissez le **dossier racine (Root Directory)**
   du projet sur **`cours-interactif`**.
2. Ajoutez les variables d'environnement (`GOOGLE_API_KEY`,
   `DEFAULT_MODEL=google:gemini-3-flash-preview`).
3. Déployez. Le fichier `vercel.json` (commandes `pnpm install` / `pnpm build`,
   `maxDuration` des fonctions) est déjà fourni.

### Option B — Docker

Un `Dockerfile` (multi-étapes, sortie `standalone`) et un `docker-compose.yml` sont
fournis :

```bash
cd cours-interactif
docker compose up --build
# l'application écoute sur le port 3000
```

Pensez à passer vos variables d'environnement au conteneur (fichier `.env` /
`environment:` du compose).

## Langue de l'interface

- L'application ne propose que **deux langues** : **Français** (par défaut) et
  **العربية / arabe**. Le sélecteur en haut permet de basculer entre les deux ;
  l'arabe s'affiche de droite à gauche (RTL).
- La langue du navigateur est détectée automatiquement (un navigateur arabe ouvre
  l'app en arabe) ; toute autre langue retombe sur le **français**.
- Repli automatique vers le **français** pour toute chaîne non encore traduite.
- La langue du **contenu pédagogique généré** est indépendante : elle est déduite du
  sujet/des supports fournis.

## Crédits & licence

Cette application est basée sur **[OpenMAIC](https://github.com/THU-MAIC/OpenMAIC)**
de THU-MAIC, distribué sous licence **MIT** (voir [`LICENSE`](./LICENSE)).
Le `README.md` d'origine (en anglais) et `README-zh.md` (chinois) sont conservés dans
ce dossier pour la documentation complète des fonctionnalités avancées (multi-agents,
voix/TTS, simulations 3D, intégration OpenClaw, etc.).
