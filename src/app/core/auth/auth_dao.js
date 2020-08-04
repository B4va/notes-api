import mongo from 'mongodb';
import uuid from 'uuid';

/**
 * Constructeur de la DAO propre à l'authentification des utilisateurs.
 * @param {Object} database base de données
 * @returns {Object} méthodes DAO authentification
 */
export default (database) => {
  return Object.freeze({
    checkToken,
    checkUser,
    findTrace,
    addToken,
    changeTrace,
  });

  /**
   * Recherche un token parmi les token révoqués.
   * @param {String} token token de connexion 
   * @returns {String} token ou null si le token n'a pas été révoqué
   */
  async function checkRevokedToken(token) {
    const db = await database;
    return await db.collection('token').findOne({ token: token });
  }

  /**
   * Recherche un utilisateur correspondant aux identifiants
   * de connexion.
   * @param {String} email email utilisateur
   * @param {String} password mot de passe utilisateur
   * @returns {Object} utilisateur ou null si identifiants inconnus
   */
  async function checkUser(email, password) {
    const db = await database;
    return await db
      .collection('users')
      .findOne({ email: email, password: password });
  }

  /**
   * Recherche un utilisateur sur la base de sa trace.
   * @param {String} trace trace déchiffrée à partir du token
   * @returns {Object} utilisateur ou null si la trace ne correspond pas
   */
  async function findTrace(trace) {
    const db = await database;
    return await db.collection('users').findOne({ trace: trace });
  }

  /**
   * Ajoute un token à la liste des token révoqués.
   * @param {String} token token de connexion
   */
  async function addRevokedToken(token) {
    const db = await database;
    await db.collection('token').insertOne({ token: token });
  }

  /**
   * Modifie la trace d'un utilisateur, à partir de laquelle
   * sont chiffrés ses token de connexion.
   * @param {String} userId id utilisateur
   */
  async function changeTrace(userId) {
    const id = mongo.ObjectID(id);
    await db
      .collection('users')
      .updateOne({ _id: id }, { $set: { trace: uuid() } });
  }
};
