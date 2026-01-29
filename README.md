# Projet Médiathèque – UE 315

## Contexte pédagogique

Ce projet est un **mini-projet de groupe** réalisé dans le cadre de l’**UE 315** de la  
**Licence Professionnelle – 3ᵉ année – Métiers de l’informatique : Application Web**.

L’objectif est de développer une **petite application web de gestion d’une médiathèque** permettant :
- l’affichage d’un catalogue de documents,
- la consultation de leur disponibilité,
- la gestion de l’emprunt et du retour des documents,
- l’affichage de statistiques.

---

## Technologies utilisées

L’application est développée sous la forme d’un **projet Node.js monolithique avec rendu côté serveur (SSR)**.

### Stack technique
- **Node.js**
- **Express** — serveur web
- **MongoDB** — base de données (driver natif)
- **EJS** — moteur de templates (rendu HTML côté serveur)
- **dotenv** — gestion des variables d’environnement
- **nodemon** — rechargement automatique en mode développement

---

## Base de données

Les données de la médiathèque sont stockées dans une base **MongoDB** distante (cluster Atlas).

L’application se connecte directement à MongoDB à l’aide du **driver officiel**, sans ORM, conformément aux consignes pédagogiques.

---

## Rendu des pages (EJS)

Le moteur de templates **EJS** est utilisé afin de :
- générer dynamiquement les pages HTML côté serveur,
- afficher et mettre en forme les données issues de MongoDB,
- faciliter l’implémentation du catalogue, des statuts des documents (disponible / emprunté) et des statistiques.

Cela permet de conserver un **frontend simple en HTML/CSS**, sans framework JavaScript lourd ni frontend séparé.

---

## Installation et configuration

### Pré-requis
- Node.js installé
- Accès à la base MongoDB (informations fournies **en privé uniquement**)

---

### Variables d’environnement

Avant de lancer le projet, il est nécessaire de créer un fichier **`.env`** à la racine du projet.

⚠️ Le fichier `.env` n’est **pas versionné** et contient des informations sensibles.

Exemple de variables attendues :

```env
PORT=3000
MONGODB_URI=...
MONGODB_DB=UE_315
```

### Installation des dépendances

```
npm install
```

### Lancer le projet

#### Mode Production :

```
npm start
```

#### Mode Dev (avec rechargement automatique) :
```
npm dev
```