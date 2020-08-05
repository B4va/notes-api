// ! à tester

import jwt from 'jsonwebtoken';
import 'dotenv/config';
import buildTokenDao from './auth_dao';

export default buildAuthManager;

/**
 * Constructeur du gestionnaire d'authentification.
 * @param {Object} database base de données
 * @returns {Object} méthodes d'authentification
 */
async function buildAuthManager(database) {
  const authDao = buildTokenDao(database);
  return Object.freeze({
    verifyToken,
    revokeToken,
    authenticateUser,
    revokeAll,
  });

  /**
   * Authentifie un utilisateur.
   * @param {String} email email utilisateur
   * @param {String} password mot de passe utilisateur
   * @returns {String} token de connexion
   */
  async function authenticateUser(email, password) {
    const user = authDao.checkUser(email, passaword);
    if (user) {
      return _generateToken(user.trace);
    } else {
      throw new Error();
    }
  }

  async function _generateToken(trace) {
    const token = await jwt.sign({ trace }, process.env.TOKEN_SECRET);
    return { status: 'Token généré.', token: token };
  }

  /**
   * Vérifie la connexion d'un utilisateur.
   * @param {String} token token de connexion
   * @returns {String} id utilisateur
   */
  async function verifyUser(token) {
    if (await authDao.isRevokedToken(token)) {
      throw new Error();
    }
    const trace = await jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await authDao.findTrace(trace);
    if (user) {
      return user._id;
    } else {
      throw new Error();
    }
  }

  /**
   * Révoque le token de connexion d'un utilisateur.
   * @param {String} token token de connexion 
   * @returns {Object} statut
   */
  async function revokeToken(token) {
    await authDao.addRevokedToken(token);
    return { status: 'Token révoqué.' };
  }

  /**
   * Invalide tous les token de connexion d'un utilisateur.
   * Modifie la référence enregistrée pour l'utilisateur et
   * sur laquelle se base le chiffrement du token.
   * @param {String} id id utilisateur
   * @returns {Object} statut
   */
  async function revokeAll(id) {
    const newTrace = uuid();
    await authDao.changeTrace(id);
    return { status: 'Emprunte globale modifiée.' };
  }
}
