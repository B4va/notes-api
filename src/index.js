import express from 'express';
import buildDatabase from './db';
import bodyParser from 'body-parser';
import routes from './routes';
import packageInfos from '../package.json';

const appName = packageInfos.name;
const app = express();
app.use(bodyParser.json());
buildDatabase()
  .then((db) => {
    console.log(`${appName} : Base de données connectée [${db.databaseName}].`);
    routes(app, db);
    app.listen(8080, () => console.log(`${appName} : Serveur lancé sur le port 8080.`));
  })
  .catch((err) => {
    console.log(`${appName} : Impossible de lancer le serveur.`, err);
  });
