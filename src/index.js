import express from 'express';
import buildDatabase from './db';
import bodyParser from 'body-parser';
import routes from './routes';

const app = express();
app.use(bodyParser.json());
buildDatabase()
  .then((db) => {
    console.log('Base de données connectée');
    routes(app, db);
    app.listen(8080, () => console.log('Serveur lancé sur le port 8080.'));
  })
  .catch((err) => {
    console.log('Impossible de lancer le serveur', err);
  });
