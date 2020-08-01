# Notes API

> API de test, réutilisable comme base technique. **Licence MIT**.

![node](img_readme/node.png)
![express](img_readme/express.png)
![mongoDB](img_readme/mongo.png)

## Organisation

- `index.js` : Lancement du serveur **Node JS**.
- `routes.js` : Routing de l'application via **Express**.
- `app/` : Process de l'application.
    - `notes/` : Modélisation et gestion de notes, associées à des utilisateurs.
    - `users` : Modélisation et gestion des utilisateurs.
    - `core/` : Process réparti dans les différents modèles de l'application.
        - `auth` : Process d'authentification.
        - `db` : Mise en place de la base de données via **MongoDB** et **MongoDB Atlas**.
        - `helpers` : Utils.

L'application est divisée en modules de façon à isoler les différents process métiers et à réaliser ces processus indépendamment de la structure des différentes dépendances.

## Environnement

Les variables d'environnement doivent être configurées à la racine de l'application, dans un fichier `.env`

**Informations requises** :
- `DB_USERNAME` : Identifiant utilisateur de la base de données MongoDB Atlas.
- `DB_PASSWORD` : Mot de passe utilisateur de la base de données.
- `DB_URL` : Adresse du cluster MongoDB Atlas.
- `DB_NAME` : Nom de la base de données.

## Dépendances

- **ESM** : Modularisation de l'application
- **Express** : Gestion des requêtes
- **BodyParser** : Traitement des données reçues
- **MongoDB** : Base de données
- **Dotenv** : Gestion des variables d'environnement

**Développement** :
- **Jest** : Tests
- **Nodemon** : Lancement du serveur node