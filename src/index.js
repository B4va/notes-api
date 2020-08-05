import express from 'express';
import buildDatabase from './app/core/db';
import buildAuthManager from './app/core/auth';
import bodyParser from 'body-parser';
import routes from './routes';
import packageInfos from '../package.json';

/**
 * Lancement de l'application.
 */
async function run() {
  const appName = packageInfos.name;
  const app = express();
  app.use(bodyParser.json());
  try {
    const db = await buildDatabase();
    console.log(`${appName} : Base de données connectée [${db.databaseName}].`);
    const authManager = await buildAuthManager(db);
    routes(app, db, authManager);
    app.listen(8080, () =>
      console.log(`${appName} : Serveur lancé sur le port 8080.`),
    );
  } catch (err) {
    console.log(`${appName} : Impossible de lancer le serveur.`, err);
  }
}

/*****/

run();
