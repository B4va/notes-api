import mongodb from 'mongodb';
import 'dotenv/config';

export default buildDatabase;

/**
 * Constructeur de la base de données.
 * @returns {Object} base de données
 */
async function buildDatabase() {
  const dbUsername = process.env.DB_USERNAME;
  const dbPassword = process.env.DB_PASSWORD;
  const dbUrl = process.env.DB_URL;
  const dbName = process.env.DB_NAME;
  const MongoClient = mongodb.MongoClient;
  const url = `mongodb+srv://${dbUsername}:${dbPassword}@${dbUrl}`;
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  return client.db(dbName);
}
