# 🃏 NKG Solitaire

Un jeu de solitaire moderne et élégant développé avec Vue 3, TypeScript et Vite.

## 🎮 Fonctionnalités

- **Interface moderne** : Design élégant avec des animations fluides
- **Système de score** : Points basés sur les mouvements et la stratégie
- **Statistiques en temps réel** : Suivi du score, des mouvements et du temps
- **Drag & Drop intuitif** : Glisser-déposer des cartes avec des indicateurs visuels
- **Détection de victoire** : Modal de félicitations avec statistiques finales
- **Nouvelle partie** : Recommencer facilement
- **Aide intégrée** : Règles du jeu accessibles en un clic

## 🚀 Installation et Lancement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Lancer les tests
npm run test:unit
```

## 🎯 Règles du Jeu

### Objectif
Placez toutes les cartes dans les 4 fondations, organisées par couleur de l'As au Roi.

### Règles de Base
- **Tableau** : Construisez des séquences décroissantes en alternant les couleurs (rouge/noir)
- **Fondations** : Construisez des séquences croissantes de l'As au Roi, par couleur
- **Stock** : Cliquez pour piocher des cartes
- **Roi** : Seul un Roi peut être placé sur un tableau vide

### Contrôles
- **Glisser-Déposer** : Faites glisser les cartes pour les déplacer
- **Double-clic** : Place automatiquement une carte sur une fondation valide
- **Nouvelle Partie** : Bouton en haut à droite

### Système de Score
- **+10 points** : Carte placée sur une fondation
- **+5 points** : Carte révélée dans le tableau
- **-2 points** : Cycle dans la pile de défausse

## 🛠️ Technologies Utilisées

- **Vue 3** avec Composition API
- **TypeScript** pour la sécurité des types
- **Pinia** pour la gestion d'état
- **Vite** pour le build et le développement
- **CSS3** avec des animations et transitions
- **Vitest** pour les tests unitaires

## 📁 Structure du Projet

```
src/
├── components/          # Composants Vue
│   ├── card/           # Composants de cartes
│   ├── GameBoard.vue   # Plateau principal
│   ├── GameStats.vue   # Statistiques
│   └── GameHelp.vue    # Aide
├── models/             # Modèles de données
├── services/           # Services et logique métier
├── stores/             # Store Pinia
├── utils/              # Utilitaires
└── css/                # Styles globaux
```

## 🎨 Personnalisation

Le jeu utilise des variables CSS pour la personnalisation :

```css
:root {
  --card-width: 60px;
  --card-height: 90px;
}
```

## 📝 Licence

Ce projet est sous licence MIT.