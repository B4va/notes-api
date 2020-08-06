import * as httpErrors from '../core/helpers/http/http_errors';
import * as httpResponses from '../core/helpers/http/http_responses';
import * as auth from '../core/auth';
import buildUser from './user_model';
import adaptAuth from '../core/helpers/adapters/auth_adapter';
import UniqueViolationError from '../core/helpers/errors/unique_violation_error';
import { hash } from '../core/helpers/utils/encrypter';

/**
 * Constructeur du controleur des utilisateurs.
 * @param {Object} notesDao DAO propre aux utilisateurs
 * @param {Object} authManager gestionnaire d'authentification
 * @returns {Function} controleur
 */
export default (usersDao, authManager) => {
  /**
   * Accès http.
   */
  return async (httpRequest) => {
    switch (httpRequest.method) {
      case 'POST':
        return postUser(httpRequest);
      case 'GET':
        return getUser(httpRequest);
      case 'PUT':
        return putUser(httpRequest);
      case 'DELETE':
        return deleteUser(httpRequest);
      case 'PATCH':
        if (httpRequest.queryParams.auth === 'revoke') {
          return revokeOneAccess(httpRequest);
        } else if (httpRequest.queryParams.auth === 'revoke-all') {
          return revokeAllAccess(httpRequest);
        } else if (httpRequest.queryParams.auth === 'login') {
          return loginUser(httpRequest);
        } else {
          return httpErrors.serverError();
        }
      default:
        return httpErrors.serverError();
    }
  };

  /**
   * Renvoie les informations de l'utilisateur connecté.
   * Validations : Connexion.
   * @param {Object} httpRequest - requête http
   * @returns {Object} réponse http
   */
  async function getUser(httpRequest) {
    const token = adaptAuth(httpRequest);
    try {
      const user = await authManager.verifyUser(token);
      const result = await usersDao.read(user.id);
      if (result) {
        return httpResponses.ok(result);
      } else {
        return httpErrors.authValidationError();
      }
    } catch (e) {
      console.log(e);
      return httpErrors.authValidationError();
    }
  }

  /**
   * Ajoute un utilisateur et renvoie les informations enregistrées.
   * Validations : Données.
   * @param {Object} httpRequest - requête http
   * @returns {Object} réponse http
   */
  async function postUser(httpRequest) {
    const userInfo = httpRequest.body;
    let user;
    try {
      user = await buildUser(userInfo);
      hash(user.password);
    } catch (e) {
      console.log(e);
      return httpErrors.invalidDataError(e);
    }
    try {
      const result = await usersDao.create(user);
      return httpResponses.created(result.ops);
    } catch (e) {
      if (e instanceof UniqueViolationError) {
        console.log(e.message);
        return httpErrors.uniqueViolationError(e);
      } else {
        return httpErrors.serverError();
      }
    }
  }

  /**
   * Modifie les données de l'utilisateur connecté.
   * Validations : Connexion, données.
   * @param {Object} httpRequest - requête http
   * @returns {Object} réponse http
   */
  async function putUser(httpRequest) {
    const token = adaptAuth(httpRequest);
    try {
      const user = await authManager.verifyUser(token);
      const userInfo = httpRequest.body;
      let newUser;
      try {
        newUser = await buildUser(userInfo);
      } catch (e) {
        return httpErrors.invalidDataError(e);
      }
      try {
        await usersDao.update(user.id, newUser);
        return httpResponses.noContent('Utilisateur modifié.');
      } catch (e) {
        return httpErrors.serverError();
      }
    } catch (e) {
      return httpErrors.authValidationError();
    }
  }

  /**
   * Supprime l'utilisateur connecté.
   * Validations : Connexion.
   * @param {Object} httpRequest - requête http
   * @returns {Object} réponse http
   */
  async function deleteUser(httpRequest) {
    const token = adaptAuth(httpRequest);
    try {
      const user = await authManager.verifyUser(token);
      const result = usersDao.remove(user.id);
      return httpResponses.noContent('Utilisateur supprimé.');
    } catch (e) {
      return httpErrors.authValidationError();
    }
  }

  /**
   * Connecte un utilisateur.
   * Validations : Authentification.
   * @param {Object} httpRequest - requête http
   * @returns {Object} réponse http
   */
  async function loginUser(httpRequest) {
    try {
      const user = await authManager.authenticateUser(httpRequest.body.email);
      return httpResponses.ok(result);
    } catch (e) {
      return httpErrors.authValidationError();
    }
  }

  /**
   * Déconnecte un utilisateur.
   * Validation : Connexion.
   * @param {Object} httpRequest - requête http
   * @returns {Object} réponse http
   */
  async function revokeOneAccess(httpRequest) {
    const token = adaptAuth(httpRequest);
    try {
      await authManager.verifyToken(token);
      const result = await authManager.revokeToken(token);
      return httpResponses.ok(result);
    } catch (e) {
      return httpErrors.authValidationError();
    }
  }

  /**
   * Déconnecte un utilisateur de tous ses appareils.
   * Validation : Connexion.
   * @param {Object} httpRequest - requête http
   * @returns {Object} réponse http
   */
  async function revokeAll(httpRequest) {
    const token = adaptAuth(httpRequest);
    try {
      const user = await authManager.verifyToken(token);
      const result = await authManager.revokeAll(user.id);
    } catch (e) {
      return httpErrors.authValidationError();
    }
  }
};
