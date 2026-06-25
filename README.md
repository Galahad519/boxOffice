# 🎬 boxOffice.io — Duel Box-Office

Un jeu **Higher/Lower** sur le cinéma : deux affiches s'affrontent, le budget de chaque film est visible, et il faut deviner lequel a généré le plus de recettes au box-office mondial. Bonne pioche → la partie continue ; erreur → le chrono décide du reste.

> Prototype personnel construit avec Vite + React + TypeScript, alimenté en direct par l'[API TMDB](https://www.themoviedb.org/).

<!-- À ajouter : une capture d'écran ou un GIF du jeu en action -->

## Fonctionnalités

- **Duel "Higher/Lower"** : budget toujours visible, recettes masquées jusqu'à la réponse.
- **Sélection de catégorie** avant de jouer — *Random* ou un genre précis (Thriller, Policier, Fantastique, Science-Fiction, Horreur, Action, Comédie, Drame, Animation, Aventure).
- **Pool de films dynamique** : avec une clé TMDB, l'app parcourt `/discover/movie` (filtré par genre si besoin) puis `/movie/{id}` pour ne garder que les films avec budget **et** recettes connus, jusqu'à un plafond configurable.
- **Repli hors-ligne** : sans clé (ou en attendant que le pool se remplisse), le jeu utilise une petite sélection de films emblématiques en dur.
- **Mode chrono** : 60 secondes par partie, score = nombre de bonnes réponses, meilleur score persisté dans `localStorage`.
- **Direction artistique "ticket de cinéma"** : typographies Bebas Neue / Inter / IBM Plex Mono, cartes façon ticket avec perforations de pellicule, tampon encré sur les résultats.

## Stack technique

| | |
|---|---|
| Build | [Vite](https://vite.dev/) |
| UI | React + TypeScript |
| Style | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Icônes | [lucide-react](https://lucide.dev/) |
| Données films | [TMDB API](https://developer.themoviedb.org/) |

## Démarrage rapide

```bash
git clone https://github.com/Galahad519/boxOffice.io.git
cd boxOffice.io
npm install
cp .env.example .env.local
# puis renseigner VITE_TMDB_API_KEY dans .env.local
npm run dev
```

- `npm run dev` — serveur de développement Vite
- `npm run build` — vérifie les types (`tsc -b`) puis génère le build de production dans `dist/`
- `npm run preview` — sert le build de production en local

## Variables d'environnement

Définies dans `.env.local` (ignoré par git, voir `.env.example`) :

| Variable | Rôle | Valeur par défaut |
|---|---|---|
| `VITE_TMDB_API_KEY` | Clé API TMDB (v3, type **Developer**) | — *(obligatoire pour le pool dynamique)* |
| `VITE_TMDB_POOL_CAP` | Nombre max de films chargés dans le pool | `1000` |
| `VITE_TMDB_MAX_PAGES` | Nombre max de pages `/discover` parcourues | `100` |

Sans `VITE_TMDB_API_KEY`, le jeu fonctionne quand même, mais reste cantonné aux films de repli (`src/data/fallbackMovies.ts`).

➡️ Clé gratuite en quelques minutes sur [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) (choisir **Developer**, pas Business — usage non commercial).

## Comment jouer

1. Choisis une catégorie (ou *Random*).
2. Deux affiches apparaissent, budget visible, recettes cachées.
3. Clique sur celle que tu penses avoir rapporté le plus.
4. Le résultat s'affiche (tampon "BONNE PIOCHE" / "RATÉ"), puis une nouvelle paire arrive automatiquement.
5. La partie se termine quand le chrono de 60 secondes atteint zéro — le score final se compare à ton record.

## Structure du projet

```
src/
├── components/
│   ├── CategorySelectScreen.tsx   # Écran de choix de catégorie
│   ├── PosterCard.tsx             # Carte-affiche (budget/recettes, image ou dégradé)
│   ├── ScoreBoard.tsx             # Chips Temps / Bonnes réponses / Record
│   └── VsDivider.tsx              # Séparateur "VS" animé entre les deux affiches
├── data/
│   ├── categories.ts              # Liste des catégories + mapping genre TMDB
│   └── fallbackMovies.ts          # Films de repli (sans clé API)
├── features/
│   └── box-office-duel/
│       └── BoxOfficeDuel.tsx      # Composant racine du jeu
├── hooks/
│   └── useBoxOfficeGame.ts        # Toute la logique : pool, chrono, score, tours
├── lib/
│   └── movies.ts                  # formatMoney, drawPair, filtre par catégorie
├── services/
│   └── tmdb.ts                    # Appels à l'API TMDB (discover + détails)
└── types/
    └── movie.ts                   # Types partagés (Movie, GamePhase, PickSide)
```

## Attribution TMDB

Ce produit utilise l'API TMDB mais n'est ni avalisé ni certifié par TMDB. Les données et affiches sont la propriété de leurs ayants droit respectifs.

## Limites connues

- La clé TMDB est utilisée côté client (pas de backend/proxy) — adapté à un usage personnel, pas à une mise en production publique à fort trafic.
- Le repli sans clé ne couvre que 14 films et un filtrage par catégorie approximatif (mots-clés sur le tag, pas les vrais genres TMDB).
- Pas de tests automatisés ni de CI pour l'instant.

## Genèse

Prototype d'abord exploré sous forme de composant React unique avec Claude, puis restructuré en véritable projet Vite/TypeScript (catégories, pool TMDB étendu, mode chrono).
